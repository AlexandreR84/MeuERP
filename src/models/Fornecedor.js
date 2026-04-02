const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Fornecedor = sequelize.define("Fornecedor", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "O nome do fornecedor e obrigatorio." }
    }
  },
  cnpj: {
    type: DataTypes.STRING(18),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "O CNPJ e obrigatorio." }
    }
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

module.exports = Fornecedor;
