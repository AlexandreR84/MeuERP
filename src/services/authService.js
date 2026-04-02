const { Usuario } = require("../models");
const { hashPassword, signToken, verifyPassword } = require("../utils/auth");

class AuthService {
  static async login({ email, senha }) {
    if (!email || !senha) {
      throw { status: 400, message: "Email e senha sao obrigatorios." };
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !usuario.ativo || !verifyPassword(senha, usuario.senha)) {
      throw { status: 401, message: "Credenciais invalidas." };
    }

    const token = signToken({
      sub: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      exp: Date.now() + 1000 * 60 * 60 * 8
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    };
  }

  static async ensureDefaultAdmin() {
    const totalUsuarios = await Usuario.count();

    if (totalUsuarios > 0) {
      return;
    }

    await Usuario.create({
      nome: "Administrador",
      email: process.env.DEFAULT_ADMIN_EMAIL || "admin@microerp.local",
      senha: hashPassword(process.env.DEFAULT_ADMIN_PASSWORD || "admin123"),
      tipo: "ADMIN",
      ativo: true
    });
  }
}

module.exports = AuthService;
