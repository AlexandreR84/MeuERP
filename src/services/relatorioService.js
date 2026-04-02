const { Op } = require("sequelize");
const sequelize = require("../database");
const {
  Produto,
  PedidoVenda,
  ItemVenda,
  ContaReceber,
  ContaPagar,
  PlanoConta,
  LancamentoContabil
} = require("../models");

class RelatorioService {
  static async necessidadeCompra() {
    return Produto.findAll({
      where: {
        ativo: true,
        [Op.and]: [sequelize.where(sequelize.col("estoque"), Op.lte, sequelize.col("estoque_minimo"))]
      },
      order: [["nome", "ASC"]]
    });
  }

  static async fluxoCaixa() {
    const [receber, pagar] = await Promise.all([
      ContaReceber.findAll({ order: [["id", "DESC"]] }),
      ContaPagar.findAll({ order: [["id", "DESC"]] })
    ]);

    const entradasPendentes = receber
      .filter((item) => item.status === "PENDENTE")
      .reduce((acc, item) => acc + Number(item.valor), 0);
    const saidasPendentes = pagar
      .filter((item) => item.status === "PENDENTE")
      .reduce((acc, item) => acc + Number(item.valor), 0);
    const entradasRealizadas = receber
      .filter((item) => item.status === "PAGO")
      .reduce((acc, item) => acc + Number(item.valor), 0);
    const saidasRealizadas = pagar
      .filter((item) => item.status === "PAGO")
      .reduce((acc, item) => acc + Number(item.valor), 0);

    return {
      resumo: {
        entradasPendentes,
        saidasPendentes,
        entradasRealizadas,
        saidasRealizadas,
        saldoProjetado: entradasPendentes - saidasPendentes,
        saldoRealizado: entradasRealizadas - saidasRealizadas
      },
      contasReceber: receber,
      contasPagar: pagar
    };
  }

  static async lucratividade() {
    const itens = await ItemVenda.findAll({
      include: [
        {
          model: PedidoVenda,
          as: "pedido"
        }
      ],
      order: [["id", "DESC"]]
    });

    const linhas = itens.map((item) => {
      const receita = Number(item.preco_unitario) * Number(item.quantidade);
      const custo = Number(item.custo_unitario || 0) * Number(item.quantidade);
      return {
        pedido_id: item.pedido_id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        receita,
        custo,
        lucro: receita - custo
      };
    });

    return {
      resumo: {
        receitaTotal: linhas.reduce((acc, item) => acc + item.receita, 0),
        custoTotal: linhas.reduce((acc, item) => acc + item.custo, 0),
        lucroTotal: linhas.reduce((acc, item) => acc + item.lucro, 0)
      },
      itens: linhas
    };
  }

  static async impostos() {
    const pedidos = await PedidoVenda.findAll({
      order: [["id", "DESC"]]
    });

    return {
      aliquotaPadrao: Number(process.env.SALES_TAX_PERCENT || 10),
      totalImpostos: pedidos.reduce((acc, pedido) => acc + Number(pedido.imposto_valor || 0), 0),
      pedidos
    };
  }

  static async balancoPatrimonial() {
    const lancamentos = await LancamentoContabil.findAll({
      include: [{ model: PlanoConta, as: "planoConta" }]
    });

    const grupos = {
      ativo: 0,
      passivo: 0,
      patrimonioLiquido: 0
    };

    for (const lancamento of lancamentos) {
      const tipo = lancamento.planoConta?.tipo;
      const valor = Number(lancamento.valor);
      const sinal = lancamento.natureza === "DEBITO" ? 1 : -1;

      if (tipo === "ATIVO") grupos.ativo += valor * sinal;
      if (tipo === "PASSIVO") grupos.passivo += valor * -sinal;
      if (tipo === "PATRIMONIO_LIQUIDO") grupos.patrimonioLiquido += valor * -sinal;
    }

    return grupos;
  }

  static async dre() {
    const lancamentos = await LancamentoContabil.findAll({
      include: [{ model: PlanoConta, as: "planoConta" }]
    });

    let receitas = 0;
    let despesas = 0;

    for (const lancamento of lancamentos) {
      const tipo = lancamento.planoConta?.tipo;
      const valor = Number(lancamento.valor);

      if (tipo === "RECEITA") {
        receitas += lancamento.natureza === "CREDITO" ? valor : -valor;
      }

      if (tipo === "DESPESA") {
        despesas += lancamento.natureza === "DEBITO" ? valor : -valor;
      }
    }

    return {
      receitas,
      despesas,
      resultado: receitas - despesas
    };
  }
}

module.exports = RelatorioService;
