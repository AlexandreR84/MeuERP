const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const ItemCompra = sequelize.define("ItemCompra", {
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
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "O preco do item deve ser numerico." },
      min: { args: [0], msg: "O preco do item nao pode ser negativo." }
    }
  }
});

module.exports = ItemCompra;
