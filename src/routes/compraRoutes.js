const express = require("express");
const CompraController = require("../controllers/compraController");
const { requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", requireRole("ADMIN"), CompraController.registrar);
router.post("/receber", requireRole("ADMIN"), CompraController.receber);
router.post("/contas-pagar/baixar", requireRole("ADMIN"), CompraController.baixarContaPagar);

module.exports = router;
