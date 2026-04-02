const express = require("express");
const RelatorioController = require("../controllers/relatorioController");
const { requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/necessidade-compra", requireRole("ADMIN"), RelatorioController.necessidadeCompra);
router.get("/lucratividade", requireRole("ADMIN"), RelatorioController.lucratividade);
router.get("/impostos", requireRole("ADMIN"), RelatorioController.impostos);
router.get("/balanco", requireRole("ADMIN"), RelatorioController.balanco);
router.get("/dre", requireRole("ADMIN"), RelatorioController.dre);

module.exports = router;
