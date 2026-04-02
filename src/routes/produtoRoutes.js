const express = require("express");
const ProdutoController = require("../controllers/produtoController");
const { requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", requireRole("ADMIN"), ProdutoController.criar);
router.get("/", requireRole("ADMIN", "VENDEDOR"), ProdutoController.listar);
router.get("/:id", requireRole("ADMIN", "VENDEDOR"), ProdutoController.obterPorId);
router.put("/:id", requireRole("ADMIN"), ProdutoController.atualizar);
router.patch("/:id/desabilitar", requireRole("ADMIN"), ProdutoController.desabilitar);
router.delete("/:id", requireRole("ADMIN"), ProdutoController.remover);

module.exports = router;
