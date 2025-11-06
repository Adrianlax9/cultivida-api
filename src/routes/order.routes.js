const { Router } = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
  create,
  mine,
  getOne,
  listAll,
  updateStatus,
} = require("../controllers/order.controller");

const router = Router();

// Cliente: crear orden
router.post("/", requireAuth, create);

// Cliente: ver mis órdenes
router.get("/mine", requireAuth, mine);

// Cliente o admin: ver una orden específica
router.get("/:id", requireAuth, getOne);

// Admin: ver todas
router.get("/", requireAuth, requireAdmin, listAll);

// Admin: actualizar estado
router.put("/:id/status", requireAuth, requireAdmin, updateStatus);

module.exports = router;
