const express = require("express");
const UsuarioController = require("../controllers/usuarioController");
const { requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", requireRole("ADMIN"), UsuarioController.criar);
router.get("/", requireRole("ADMIN"), UsuarioController.listar);
router.get("/:id", requireRole("ADMIN"), UsuarioController.obterPorId);
router.put("/:id", requireRole("ADMIN"), UsuarioController.atualizar);
router.patch("/:id/desabilitar", requireRole("ADMIN"), UsuarioController.desabilitar);
router.delete("/:id", requireRole("ADMIN"), UsuarioController.remover);

module.exports = router;
