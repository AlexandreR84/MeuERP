const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const PedidoVenda = sequelize.define("PedidoVenda", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cliente_id: {
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
  imposto_percentual: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 10
  },
  imposto_valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "O total da venda deve ser numerico." },
      min: { args: [0], msg: "O total da venda nao pode ser negativo." }
    }
  }
});

module.exports = PedidoVenda;
