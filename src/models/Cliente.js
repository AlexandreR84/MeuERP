const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Cliente = sequelize.define("Cliente", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "O nome do cliente e obrigatorio." }
    }
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "O CPF e obrigatorio." }
    }
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

module.exports = Cliente;
