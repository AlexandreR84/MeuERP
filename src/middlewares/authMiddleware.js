const { Usuario } = require("../models");
const { verifyToken } = require("../utils/auth");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ error: "Autenticacao obrigatoria." });
    }

    const payload = verifyToken(token);
    const usuario = await Usuario.findByPk(payload.sub);

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ error: "Usuario invalido ou inativo." });
    }

    req.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message || "Nao foi possivel validar a autenticacao." });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.tipo)) {
      return res.status(403).json({ error: "Voce nao tem permissao para executar esta operacao." });
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};
