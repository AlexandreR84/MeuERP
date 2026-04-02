const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const PlanoConta = sequelize.define("PlanoConta", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "O codigo da conta e obrigatorio." }
    }
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "O nome da conta e obrigatorio." }
    }
  },
  tipo: {
    type: DataTypes.ENUM("ATIVO", "PASSIVO", "PATRIMONIO_LIQUIDO", "RECEITA", "DESPESA"),
    allowNull: false
  },
  conta_pai_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

module.exports = PlanoConta;
