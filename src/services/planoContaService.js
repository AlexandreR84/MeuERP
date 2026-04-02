const { PlanoConta } = require("../models");

class PlanoContaService {
  static async criar(dados) {
    const { codigo, nome, tipo, conta_pai_id } = dados;

    if (!codigo || !nome || !tipo) {
      throw { status: 400, message: "Codigo, nome e tipo da conta sao obrigatorios." };
    }

    const existente = await PlanoConta.findOne({ where: { codigo } });
    if (existente) {
      throw { status: 400, message: "Ja existe uma conta com esse codigo." };
    }

    if (conta_pai_id) {
      const contaPai = await PlanoConta.findByPk(conta_pai_id);
      if (!contaPai) {
        throw { status: 404, message: "Conta pai nao encontrada." };
      }
    }

    return PlanoConta.create({
      codigo,
      nome,
      tipo,
      conta_pai_id: conta_pai_id || null,
      ativo: dados.ativo !== undefined ? Boolean(dados.ativo) : true
    });
  }

  static async listar() {
    return PlanoConta.findAll({
      include: [
        {
          model: PlanoConta,
          as: "contaPai"
        }
      ],
      order: [["codigo", "ASC"]]
    });
  }

  static async obterPorId(id) {
    const conta = await PlanoConta.findByPk(id, {
      include: [{ model: PlanoConta, as: "contaPai" }]
    });

    if (!conta) {
      throw { status: 404, message: "Conta contabil nao encontrada." };
    }

    return conta;
  }

  static async atualizar(id, dados) {
    const conta = await PlanoConta.findByPk(id);
    if (!conta) {
      throw { status: 404, message: "Conta contabil nao encontrada." };
    }

    if (dados.codigo && dados.codigo !== conta.codigo) {
      const existente = await PlanoConta.findOne({ where: { codigo: dados.codigo } });
      if (existente) {
        throw { status: 400, message: "Ja existe uma conta com esse codigo." };
      }
    }

    if (dados.conta_pai_id) {
      if (Number(dados.conta_pai_id) === Number(id)) {
        throw { status: 400, message: "Uma conta nao pode ser pai dela mesma." };
      }

      const contaPai = await PlanoConta.findByPk(dados.conta_pai_id);
      if (!contaPai) {
        throw { status: 404, message: "Conta pai nao encontrada." };
      }
    }

    Object.assign(conta, {
      codigo: dados.codigo ?? conta.codigo,
      nome: dados.nome ?? conta.nome,
      tipo: dados.tipo ?? conta.tipo,
      conta_pai_id: dados.conta_pai_id !== undefined ? dados.conta_pai_id || null : conta.conta_pai_id
    });

    if (dados.ativo !== undefined) {
      conta.ativo = Boolean(dados.ativo);
    }

    await conta.save();
    return conta;
  }

  static async desabilitar(id) {
    const conta = await PlanoConta.findByPk(id);
    if (!conta) {
      throw { status: 404, message: "Conta contabil nao encontrada." };
    }

    conta.ativo = false;
    await conta.save();
    return conta;
  }

  static async remover(id) {
    const conta = await PlanoConta.findByPk(id);
    if (!conta) {
      throw { status: 404, message: "Conta contabil nao encontrada." };
    }

    await conta.destroy();
    return { message: "Conta contabil removida com sucesso." };
  }
}

module.exports = PlanoContaService;
