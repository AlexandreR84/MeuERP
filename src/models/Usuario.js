const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Usuario = sequelize.define("Usuario", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "O nome do usuario e obrigatorio." }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "Informe um email valido." },
      notEmpty: { msg: "O email e obrigatorio." }
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "A senha e obrigatoria." }
    }
  },
  tipo: {
    type: DataTypes.ENUM("ADMIN", "VENDEDOR"),
    allowNull: false,
    validate: {
      notEmpty: { msg: "O tipo do usuario e obrigatorio." }
    }
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

module.exports = Usuario;
