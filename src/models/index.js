const sequelize = require("../database");
const Usuario = require("./Usuario");
const Cliente = require("./Cliente");
const Fornecedor = require("./Fornecedor");
const Produto = require("./Produto");
const PedidoCompra = require("./PedidoCompra");
const ItemCompra = require("./ItemCompra");
const PedidoVenda = require("./PedidoVenda");
const ItemVenda = require("./ItemVenda");
const EstoqueMovimentacao = require("./EstoqueMovimentacao");
const ContaReceber = require("./ContaReceber");
const ContaPagar = require("./ContaPagar");
const PlanoConta = require("./PlanoConta");
const LancamentoContabil = require("./LancamentoContabil");

Fornecedor.hasMany(PedidoCompra, {
  foreignKey: "fornecedor_id",
  as: "pedidosCompra"
});
PedidoCompra.belongsTo(Fornecedor, {
  foreignKey: "fornecedor_id",
  as: "fornecedor"
});

PedidoCompra.hasMany(ItemCompra, {
  foreignKey: "pedido_id",
  as: "itens"
});
ItemCompra.belongsTo(PedidoCompra, {
  foreignKey: "pedido_id",
  as: "pedido"
});

Produto.hasMany(ItemCompra, {
  foreignKey: "produto_id",
  as: "itensCompra"
});
ItemCompra.belongsTo(Produto, {
  foreignKey: "produto_id",
  as: "produto"
});

Cliente.hasMany(PedidoVenda, {
  foreignKey: "cliente_id",
  as: "pedidosVenda"
});
PedidoVenda.belongsTo(Cliente, {
  foreignKey: "cliente_id",
  as: "cliente"
});

PedidoVenda.hasMany(ItemVenda, {
  foreignKey: "pedido_id",
  as: "itens"
});
ItemVenda.belongsTo(PedidoVenda, {
  foreignKey: "pedido_id",
  as: "pedido"
});

Produto.hasMany(ItemVenda, {
  foreignKey: "produto_id",
  as: "itensVenda"
});
ItemVenda.belongsTo(Produto, {
  foreignKey: "produto_id",
  as: "produto"
});

Produto.hasMany(EstoqueMovimentacao, {
  foreignKey: "produto_id",
  as: "movimentacoes"
});
EstoqueMovimentacao.belongsTo(Produto, {
  foreignKey: "produto_id",
  as: "produto"
});

Usuario.hasMany(EstoqueMovimentacao, {
  foreignKey: "usuario_id",
  as: "movimentacoesEstoque"
});
EstoqueMovimentacao.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario"
});

PedidoVenda.hasOne(ContaReceber, {
  foreignKey: "pedido_venda_id",
  as: "contaReceber"
});
ContaReceber.belongsTo(PedidoVenda, {
  foreignKey: "pedido_venda_id",
  as: "pedidoVenda"
});

PedidoCompra.hasOne(ContaPagar, {
  foreignKey: "pedido_compra_id",
  as: "contaPagar"
});
ContaPagar.belongsTo(PedidoCompra, {
  foreignKey: "pedido_compra_id",
  as: "pedidoCompra"
});

PlanoConta.hasMany(PlanoConta, {
  foreignKey: "conta_pai_id",
  as: "filhos"
});
PlanoConta.belongsTo(PlanoConta, {
  foreignKey: "conta_pai_id",
  as: "contaPai"
});

PlanoConta.hasMany(LancamentoContabil, {
  foreignKey: "plano_conta_id",
  as: "lancamentos"
});
LancamentoContabil.belongsTo(PlanoConta, {
  foreignKey: "plano_conta_id",
  as: "planoConta"
});

module.exports = {
  sequelize,
  Usuario,
  Cliente,
  Fornecedor,
  Produto,
  PedidoCompra,
  ItemCompra,
  PedidoVenda,
  ItemVenda,
  EstoqueMovimentacao,
  ContaReceber,
  ContaPagar,
  PlanoConta,
  LancamentoContabil
};
