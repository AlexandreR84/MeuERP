const { Cliente } = require("../models");
const { onlyDigits, validarCpf } = require("../utils/documentos");

class ClienteService {
  static async criar(dados) {
    const { nome, cpf } = dados;

    if (!nome || !cpf) {
      throw { status: 400, message: "Nome e CPF do cliente sao obrigatorios." };
    }

    const cpfNormalizado = onlyDigits(cpf);
    if (!validarCpf(cpfNormalizado)) {
      throw { status: 400, message: "Informe um CPF valido." };
    }

    const existente = await Cliente.findOne({ where: { cpf: cpfNormalizado } });
    if (existente) {
      throw { status: 400, message: "Ja existe um cliente com esse CPF." };
    }

    return Cliente.create({
      nome,
      cpf: cpfNormalizado,
      ativo: dados.ativo !== undefined ? Boolean(dados.ativo) : true
    });
  }

  static async listar() {
    return Cliente.findAll({
      order: [["id", "ASC"]]
    });
  }

  static async obterPorId(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw { status: 404, message: "Cliente nao encontrado." };
    }
    return cliente;
  }

  static async atualizar(id, dados) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw { status: 404, message: "Cliente nao encontrado." };
    }

    if (dados.cpf) {
      const cpfNormalizado = onlyDigits(dados.cpf);
      if (!validarCpf(cpfNormalizado)) {
        throw { status: 400, message: "Informe um CPF valido." };
      }

      if (cpfNormalizado !== cliente.cpf) {
        const existente = await Cliente.findOne({ where: { cpf: cpfNormalizado } });
        if (existente) {
          throw { status: 400, message: "Ja existe um cliente com esse CPF." };
        }
      }

      cliente.cpf = cpfNormalizado;
    }

    cliente.nome = dados.nome ?? cliente.nome;
    if (dados.ativo !== undefined) {
      cliente.ativo = Boolean(dados.ativo);
    }

    await cliente.save();
    return cliente;
  }

  static async desabilitar(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw { status: 404, message: "Cliente nao encontrado." };
    }

    cliente.ativo = false;
    await cliente.save();
    return cliente;
  }

  static async remover(id) {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      throw { status: 404, message: "Cliente nao encontrado." };
    }

    await cliente.destroy();
    return { message: "Cliente removido com sucesso." };
  }
}

module.exports = ClienteService;
