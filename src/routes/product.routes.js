const { Router } = require("express");
const ctrl = require("../controllers/product.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = Router();

// pública (catálogo)
router.get("/", ctrl.list);

// admin
router.get("/all", requireAuth, requireAdmin, ctrl.listAll);
router.post("/", requireAuth, requireAdmin, ctrl.create);
router.put("/:id", requireAuth, requireAdmin, ctrl.update);
router.delete("/:id", requireAuth, requireAdmin, ctrl.remove);

module.exports = router;
