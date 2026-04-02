const express = require("express");
const PlanoContaController = require("../controllers/planoContaController");
const { requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", requireRole("ADMIN"), PlanoContaController.criar);
router.get("/", requireRole("ADMIN"), PlanoContaController.listar);
router.get("/:id", requireRole("ADMIN"), PlanoContaController.obterPorId);
router.put("/:id", requireRole("ADMIN"), PlanoContaController.atualizar);
router.patch("/:id/desabilitar", requireRole("ADMIN"), PlanoContaController.desabilitar);
router.delete("/:id", requireRole("ADMIN"), PlanoContaController.remover);

module.exports = router;
