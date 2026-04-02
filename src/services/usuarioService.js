const { Usuario } = require("../models");
const { hashPassword } = require("../utils/auth");

class UsuarioService {
  static sanitize(usuario) {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      ativo: usuario.ativo,
      created_at: usuario.created_at,
      updated_at: usuario.updated_at
    };
  }

  static async criar(dados) {
    const { nome, email, senha, tipo } = dados;

    if (!nome || !email || !senha || !tipo) {
      throw { status: 400, message: "Nome, email, senha e tipo sao obrigatorios." };
    }

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      throw { status: 400, message: "Ja existe um usuario com esse email." };
    }

    const usuario = await Usuario.create({
      nome,
      email,
      senha: hashPassword(senha),
      tipo,
      ativo: dados.ativo !== undefined ? Boolean(dados.ativo) : true
    });

    return this.sanitize(usuario);
  }

  static async listar() {
    const usuarios = await Usuario.findAll({ order: [["id", "ASC"]] });
    return usuarios.map((usuario) => this.sanitize(usuario));
  }

  static async obterPorId(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw { status: 404, message: "Usuario nao encontrado." };
    }
    return this.sanitize(usuario);
  }

  static async atualizar(id, dados) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw { status: 404, message: "Usuario nao encontrado." };
    }

    if (dados.email && dados.email !== usuario.email) {
      const existente = await Usuario.findOne({ where: { email: dados.email } });
      if (existente) {
        throw { status: 400, message: "Ja existe um usuario com esse email." };
      }
    }

    Object.assign(usuario, {
      nome: dados.nome ?? usuario.nome,
      email: dados.email ?? usuario.email,
      tipo: dados.tipo ?? usuario.tipo
    });

    if (dados.ativo !== undefined) {
      usuario.ativo = Boolean(dados.ativo);
    }

    if (dados.senha) {
      usuario.senha = hashPassword(dados.senha);
    }

    await usuario.save();
    return this.sanitize(usuario);
  }

  static async desabilitar(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw { status: 404, message: "Usuario nao encontrado." };
    }

    usuario.ativo = false;
    await usuario.save();
    return this.sanitize(usuario);
  }

  static async remover(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw { status: 404, message: "Usuario nao encontrado." };
    }

    await usuario.destroy();
    return { message: "Usuario removido com sucesso." };
  }
}

module.exports = UsuarioService;
