const express = require("express");
const produtoRoutes = require("./produtoRoutes");
const clienteRoutes = require("./clienteRoutes");
const fornecedorRoutes = require("./fornecedorRoutes");
const compraRoutes = require("./compraRoutes");
const vendaRoutes = require("./vendaRoutes");
const financeiroRoutes = require("./financeiroRoutes");
const authRoutes = require("./authRoutes");
const usuarioRoutes = require("./usuarioRoutes");
const planoContaRoutes = require("./planoContaRoutes");
const relatorioRoutes = require("./relatorioRoutes");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use("/auth", authRoutes);
router.use(requireAuth);
router.use("/produtos", produtoRoutes);
router.use("/clientes", clienteRoutes);
router.use("/fornecedores", fornecedorRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/plano-contas", planoContaRoutes);
router.use("/compras", compraRoutes);
router.use("/vendas", vendaRoutes);
router.use("/relatorios", relatorioRoutes);
router.use("/", financeiroRoutes);

module.exports = router;
