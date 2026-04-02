const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const LancamentoContabil = sequelize.define("LancamentoContabil", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  lote: {
    type: DataTypes.STRING,
    allowNull: false
  },
  plano_conta_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  natureza: {
    type: DataTypes.ENUM("DEBITO", "CREDITO"),
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "O valor do lancamento deve ser numerico." },
      min: { args: [0], msg: "O valor do lancamento nao pode ser negativo." }
    }
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  historico: {
    type: DataTypes.STRING,
    allowNull: false
  },
  origem_tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  origem_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = LancamentoContabil;
