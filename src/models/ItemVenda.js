const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const ItemVenda = sequelize.define("ItemVenda", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: "A quantidade deve ser inteira." },
      min: { args: [1], msg: "A quantidade minima e 1." }
    }
  },
  preco_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "O preco unitario deve ser numerico." },
      min: { args: [0], msg: "O preco unitario nao pode ser negativo." }
    }
  },
  custo_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = ItemVenda;
