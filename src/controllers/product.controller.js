const { Product } = require("../models");
const slugify = require("slugify");

// GET /api/products (público: lista activos)
exports.list = async (_req, res) => {
  const items = await Product.findAll({
    where: { active: true },
    order: [["createdAt", "DESC"]],
  });
  res.json(items);
};

// GET /api/products/all (admin: lista todos, incluso inactivos)
exports.listAll = async (_req, res) => {
  const items = await Product.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json(items);
};

// POST /api/products (admin)
exports.create = async (req, res) => {
  const { name, description, price, stock, imageUrl, active = true, infoShort, infoBullets } = req.body;
  if (!name || price == null) return res.status(400).json({ msg: "Faltan campos" });
  const slug = slugify(name, { lower: true, strict: true });
  const p = await Product.create({ name, slug, description, price, stock, imageUrl, active, infoShort,
    infoBullets });
  res.status(201).json(p);
};

// PUT /api/products/:id (admin)
exports.update = async (req, res) => {
  const { id } = req.params;
  const p = await Product.findByPk(id);
  if (!p) return res.status(404).json({ msg: "Producto no encontrado" });

  const { name, description, price, stock, imageUrl, active, infoShort, infoBullets } = req.body;

  if (name) {
    p.name = name;
    p.slug = slugify(name, { lower: true, strict: true });
  }
  if (description !== undefined) p.description = description;
  if (price !== undefined) p.price = price;
  if (stock !== undefined) p.stock = stock;
  if (imageUrl !== undefined) p.imageUrl = imageUrl;
  if (active !== undefined) p.active = active;
  if (infoShort !== undefined) p.infoShort = infoShort;
  if (infoBullets !== undefined) p.infoBullets = infoBullets;

  await p.save();
  res.json(p);
};

// DELETE /api/products/:id (admin)
exports.remove = async (req, res) => {
  const { id } = req.params;
  const p = await Product.findByPk(id);
  if (!p) return res.status(404).json({ msg: "Producto no encontrado" });
  await p.destroy();
  res.json({ msg: "Producto eliminado" });
};

