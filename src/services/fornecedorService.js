const { Fornecedor } = require("../models");
const { onlyDigits, validarCnpj } = require("../utils/documentos");

class FornecedorService {
  static async criar(dados) {
    const { nome, cnpj } = dados;

    if (!nome || !cnpj) {
      throw { status: 400, message: "Nome e CNPJ do fornecedor sao obrigatorios." };
    }

    const cnpjNormalizado = onlyDigits(cnpj);
    if (!validarCnpj(cnpjNormalizado)) {
      throw { status: 400, message: "Informe um CNPJ valido." };
    }

    const existente = await Fornecedor.findOne({ where: { cnpj: cnpjNormalizado } });
    if (existente) {
      throw { status: 400, message: "Ja existe um fornecedor com esse CNPJ." };
    }

    return Fornecedor.create({
      nome,
      cnpj: cnpjNormalizado,
      ativo: dados.ativo !== undefined ? Boolean(dados.ativo) : true
    });
  }

  static async listar() {
    return Fornecedor.findAll({
      order: [["id", "ASC"]]
    });
  }

  static async obterPorId(id) {
    const fornecedor = await Fornecedor.findByPk(id);
    if (!fornecedor) {
      throw { status: 404, message: "Fornecedor nao encontrado." };
    }
    return fornecedor;
  }

  static async atualizar(id, dados) {
    const fornecedor = await Fornecedor.findByPk(id);
    if (!fornecedor) {
      throw { status: 404, message: "Fornecedor nao encontrado." };
    }

    if (dados.cnpj) {
      const cnpjNormalizado = onlyDigits(dados.cnpj);
      if (!validarCnpj(cnpjNormalizado)) {
        throw { status: 400, message: "Informe um CNPJ valido." };
      }

      if (cnpjNormalizado !== fornecedor.cnpj) {
        const existente = await Fornecedor.findOne({ where: { cnpj: cnpjNormalizado } });
        if (existente) {
          throw { status: 400, message: "Ja existe um fornecedor com esse CNPJ." };
        }
      }

      fornecedor.cnpj = cnpjNormalizado;
    }

    fornecedor.nome = dados.nome ?? fornecedor.nome;
    if (dados.ativo !== undefined) {
      fornecedor.ativo = Boolean(dados.ativo);
    }

    await fornecedor.save();
    return fornecedor;
  }

  static async desabilitar(id) {
    const fornecedor = await Fornecedor.findByPk(id);
    if (!fornecedor) {
      throw { status: 404, message: "Fornecedor nao encontrado." };
    }

    fornecedor.ativo = false;
    await fornecedor.save();
    return fornecedor;
  }

  static async remover(id) {
    const fornecedor = await Fornecedor.findByPk(id);
    if (!fornecedor) {
      throw { status: 404, message: "Fornecedor nao encontrado." };
    }

    await fornecedor.destroy();
    return { message: "Fornecedor removido com sucesso." };
  }
}

module.exports = FornecedorService;
