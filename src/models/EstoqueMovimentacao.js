const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const EstoqueMovimentacao = sequelize.define("EstoqueMovimentacao", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pedido_compra_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pedido_venda_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM("ENTRADA", "SAIDA"),
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: "A quantidade da movimentacao deve ser inteira." },
      min: { args: [1], msg: "A quantidade minima da movimentacao e 1." }
    }
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

module.exports = EstoqueMovimentacao;
