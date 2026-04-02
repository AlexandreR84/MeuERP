require("dotenv").config();

const express = require("express");
const path = require("path");
const { DataTypes } = require("sequelize");
const sequelize = require("./src/database");
const routes = require("./src/routes");
const AuthService = require("./src/services/authService");
const ContabilidadeService = require("./src/services/contabilidadeService");
const { Produto } = require("./src/models");

const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "public");

app.use(express.json());
app.use(express.static(publicPath));

app.get("/health", (req, res) => {
  res.json({ message: "Meu ERP backend online." });
});

app.use("/", routes);

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "Erro de validacao.",
      details: err.errors.map((item) => item.message)
    });
  }

  return res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor."
  });
});

async function garantirCodigoProduto() {
  const queryInterface = sequelize.getQueryInterface();
  const descricaoTabela = await queryInterface.describeTable("Produto");

  if (!descricaoTabela.codigo) {
    await queryInterface.addColumn("Produto", "codigo", {
      type: DataTypes.STRING,
      allowNull: true
    });

    const produtos = await Produto.findAll({
      attributes: ["id"]
    });

    for (const produto of produtos) {
      await Produto.update(
        {
          codigo: `PROD-${String(produto.id).padStart(4, "0")}`
        },
        {
          where: { id: produto.id }
        }
      );
    }

    await queryInterface.changeColumn("Produto", "codigo", {
      type: DataTypes.STRING,
      allowNull: false
    });

    await queryInterface.addIndex("Produto", ["codigo"], {
      unique: true,
      name: "produto_codigo_unique"
    });
  }
}

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexao com MySQL estabelecida com sucesso.");

    await sequelize.sync();
    await garantirCodigoProduto();
    await sequelize.sync({ alter: true });
    await ContabilidadeService.ensureDefaultPlanAccounts();
    console.log("Models sincronizados com o banco.");

    await AuthService.ensureDefaultAdmin();
    console.log("Usuario administrador padrao validado.");

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}.`);
    });
  } catch (error) {
    console.error("Falha ao iniciar a aplicacao:", error.message);
    process.exit(1);
  }
}

startServer();
