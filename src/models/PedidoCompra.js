const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const PedidoCompra = sequelize.define("PedidoCompra", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fornecedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  desconto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "O total da compra deve ser numerico." },
      min: { args: [0], msg: "O total da compra nao pode ser negativo." }
    }
  },
  status: {
    type: DataTypes.ENUM("EMITIDO", "RECEBIDO"),
    allowNull: false,
    defaultValue: "RECEBIDO"
  },
  nf_entrada: {
    type: DataTypes.STRING,
    allowNull: true
  },
  forma_pagamento: {
    type: DataTypes.STRING,
    allowNull: true
  },
  recebido_em: {
    type: DataTypes.DATE,
    allowNull: true
  },
  observacao: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = PedidoCompra;
