// src/controllers/order.controller.js
const { Order, OrderItem, Product, User, sequelize } = require("../models");

/**
 * POST /api/orders
 * Crea una orden con sus ítems, descuenta stock y calcula totales.
 */
async function create(req, res) {
  const t = await sequelize.transaction(); // ✅ usa el sequelize global
  try {
    const userId = req.user.id;
    const {
      items,           // [{ productId, quantity }]
      address,
      city,
      phone,
      notes,
      shippingCost,    // número
      subtotal,        // opcional (se recalcula)
      totalToPay       // opcional (se recalcula)
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ msg: "Carrito vacío" });
    }
    if (!address || !city || !phone) {
      await t.rollback();
      return res.status(400).json({ msg: "Faltan datos de envío" });
    }

    let totalCalculadoProductos = 0;
    const lineItems = [];

    // Validación de stock y armado de ítems
    for (const it of items) {
      const p = await Product.findByPk(it.productId, { transaction: t });
      if (!p || !p.active) {
        await t.rollback();
        return res.status(400).json({ msg: `Producto ${it.productId} no disponible` });
      }
      if (p.stock < it.quantity) {
        await t.rollback();
        return res.status(400).json({ msg: `Stock insuficiente para ${p.name}` });
      }

      const unitPrice = Number(p.price);
      totalCalculadoProductos += unitPrice * Number(it.quantity);

      lineItems.push({
        productId: p.id,
        name: p.name,
        price: unitPrice,
        quantity: Number(it.quantity),
        imageUrl: p.imageUrl,
      });

      // Descontar stock
      p.stock = p.stock - Number(it.quantity);
      await p.save({ transaction: t });
    }

    const costoEnvio = Number(shippingCost || 0);
    const totalFinal = totalCalculadoProductos + costoEnvio;

    const order = await Order.create(
      {
        userId,
        status: "pending", // puedes usar "pendiente" si así lo definiste
        address,
        city,
        phone,
        notes: notes || "",
        subtotal: totalCalculadoProductos,
        shippingCost: costoEnvio,
        total: totalFinal,
      },
      { transaction: t }
    );

    // Crear ítems
    for (const li of lineItems) {
      await OrderItem.create(
        { orderId: order.id, ...li },
        { transaction: t }
      );
    }

    await t.commit();

    // Devolver la orden con relaciones
    const withItems = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: "items" },
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
    });

    return res.status(201).json({ msg: "Orden creada", order: withItems });
  } catch (err) {
    console.error("order.create error:", err);
    await t.rollback();
    return res.status(500).json({ msg: "Error creando la orden" });
  }
}

/**
 * GET /api/orders/mine
 * Lista las órdenes del usuario autenticado.
 */
async function mine(req, res) {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: "items" }],
      order: [["createdAt", "DESC"]],
    });
    return res.json(orders);
  } catch (err) {
    console.error("order.mine error:", err);
    return res.status(500).json({ msg: "Error consultando tus órdenes" });
  }
}

/**
 * GET /api/orders/:id
 * Devuelve una orden; solo el dueño o admin puede verla.
 */
async function getOne(req, res) {
  try {
    const { id } = req.params;
    const o = await Order.findByPk(id, {
      include: [
        { model: OrderItem, as: "items" },
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
    });
    if (!o) return res.status(404).json({ msg: "Orden no encontrada" });

    if (req.user.role !== "admin" && o.userId !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    return res.json(o);
  } catch (err) {
    console.error("order.getOne error:", err);
    return res.status(500).json({ msg: "Error consultando orden" });
  }
}

/**
 * GET /api/orders  (admin)
 * Lista todas las órdenes.
 */
async function listAll(_req, res) {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, as: "items" },
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json(orders);
  } catch (err) {
    console.error("order.listAll error:", err);
    return res.status(500).json({ msg: "Error consultando órdenes" });
  }
}

/**
 * PUT /api/orders/:id/status  (admin)
 * Actualiza el estado de una orden.
 */
async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const o = await Order.findByPk(id);
    if (!o) return res.status(404).json({ msg: "Orden no encontrada" });

    o.status = status || o.status;
    await o.save();

    return res.json({ msg: "Estado actualizado", order: o });
  } catch (err) {
    console.error("order.updateStatus error:", err);
    return res.status(500).json({ msg: "Error actualizando estado" });
  }
}

module.exports = { create, mine, getOne, listAll, updateStatus };
