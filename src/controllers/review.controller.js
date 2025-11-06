// src/controllers/review.controller.js
const { Review, User } = require("../models");

exports.listApproved = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "12", 10), 50);
  const items = await Review.findAll({
    where: { approved: true },
    order: [["createdAt", "DESC"]],
    limit
  });
  res.json(items);
};

exports.create = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ msg: "No autorizado" });

  const { message, rating = 5, city = "" } = req.body;
  if (!message || !String(message).trim()) {
    return res.status(400).json({ msg: "El mensaje es obligatorio" });
  }

  // intenta tomar el nombre desde el usuario, si existe
  let name = "Usuario";
  try {
    const user = await User.findByPk(userId);
    name = user?.name || user?.email || "Usuario";
  } catch (e) {}

  const review = await Review.create({
    userId,
    name,
    city,
    rating: Math.max(1, Math.min(5, Number(rating))),
    message,
    approved: true // si quieres moderación: false
  });

  res.status(201).json(review);
};

// (Opcional) rutas para admin: aprobar/eliminar
exports.listAll = async (_req, res) => {
  const items = await Review.findAll({ order: [["createdAt", "DESC"]] });
  res.json(items);
};
exports.approve = async (req, res) => {
  const { id } = req.params;
  const r = await Review.findByPk(id);
  if (!r) return res.status(404).json({ msg: "No encontrado" });
  r.approved = true;
  await r.save();
  res.json(r);
};
exports.remove = async (req, res) => {
  const { id } = req.params;
  const r = await Review.findByPk(id);
  if (!r) return res.status(404).json({ msg: "No encontrado" });
  await r.destroy();
  res.json({ ok: true });
};
