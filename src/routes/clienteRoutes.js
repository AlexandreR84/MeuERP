const express = require("express");
const ClienteController = require("../controllers/clienteController");
const { requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", requireRole("ADMIN", "VENDEDOR"), ClienteController.criar);
router.get("/", requireRole("ADMIN", "VENDEDOR"), ClienteController.listar);
router.get("/:id", requireRole("ADMIN", "VENDEDOR"), ClienteController.obterPorId);
router.put("/:id", requireRole("ADMIN", "VENDEDOR"), ClienteController.atualizar);
router.patch("/:id/desabilitar", requireRole("ADMIN"), ClienteController.desabilitar);
router.delete("/:id", requireRole("ADMIN"), ClienteController.remover);

module.exports = router;
