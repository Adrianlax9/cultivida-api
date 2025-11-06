// src/routes/review.routes.js
const { Router } = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { listApproved, create, listAll, approve, remove } = require("../controllers/review.controller");
const router = Router();

router.get("/", listApproved);                 // público (solo aprobados)
router.post("/", requireAuth, create);         // crear opinión (usuario logueado)

// Opcional: panel admin
router.get("/admin", requireAuth, requireAdmin, listAll);
router.patch("/:id/approve", requireAuth, requireAdmin, approve);
router.delete("/:id", requireAuth, requireAdmin, remove);

module.exports = router;
