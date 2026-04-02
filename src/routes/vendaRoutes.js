const express = require("express");
const VendaController = require("../controllers/vendaController");
const { requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", requireRole("ADMIN", "VENDEDOR"), VendaController.registrar);

module.exports = router;
