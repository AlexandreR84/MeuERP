const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Produto = sequelize.define("Produto", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "O nome do produto e obrigatorio." }
    }
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "O codigo do produto e obrigatorio." }
    }
  },
  preco_custo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "O preco de custo deve ser numerico." },
      min: { args: [0], msg: "O preco de custo nao pode ser negativo." }
    }
  },
  preco_venda: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "O preco de venda deve ser numerico." },
      min: { args: [0], msg: "O preco de venda nao pode ser negativo." }
    }
  },
  margem_lucro: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: { msg: "O estoque deve ser inteiro." },
      min: { args: [0], msg: "O estoque nao pode ser negativo." }
    }
  },
  estoque_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: { msg: "O estoque minimo deve ser inteiro." },
      min: { args: [0], msg: "O estoque minimo nao pode ser negativo." }
    }
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

module.exports = Produto;
