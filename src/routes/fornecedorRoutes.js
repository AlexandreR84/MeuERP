const express = require("express");
const FornecedorController = require("../controllers/fornecedorController");
const { requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", requireRole("ADMIN"), FornecedorController.criar);
router.get("/", requireRole("ADMIN"), FornecedorController.listar);
router.get("/:id", requireRole("ADMIN"), FornecedorController.obterPorId);
router.put("/:id", requireRole("ADMIN"), FornecedorController.atualizar);
router.patch("/:id/desabilitar", requireRole("ADMIN"), FornecedorController.desabilitar);
router.delete("/:id", requireRole("ADMIN"), FornecedorController.remover);

module.exports = router;
