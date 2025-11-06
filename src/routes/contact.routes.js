// src/routes/contact.routes.js
const { Router } = require("express");
const { create, list } = require("../controllers/contact.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = Router();

// público: crear contacto
router.post("/", create);

// admin: ver contactos (si lo deseas)
router.get("/", requireAuth, requireAdmin, list);

module.exports = router;
