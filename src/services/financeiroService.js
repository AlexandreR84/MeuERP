const sequelize = require("../database");
const {
  ContaReceber,
  ContaPagar,
  PedidoVenda,
  PedidoCompra,
  Cliente,
  Fornecedor
} = require("../models");
const ContabilidadeService = require("./contabilidadeService");
const RelatorioService = require("./relatorioService");

class FinanceiroService {
  static async listarContasReceber() {
    return ContaReceber.findAll({
      include: [
        {
          model: PedidoVenda,
          as: "pedidoVenda",
          include: [{ model: Cliente, as: "cliente" }]
        }
      ],
      order: [["id", "ASC"]]
    });
  }

  static async listarContasPagar() {
    return ContaPagar.findAll({
      include: [
        {
          model: PedidoCompra,
          as: "pedidoCompra",
          include: [{ model: Fornecedor, as: "fornecedor" }]
        }
      ],
      order: [["id", "ASC"]]
    });
  }

  static async baixarContaReceber(contaReceberId, dados = {}) {
    if (!contaReceberId) {
      throw { status: 400, message: "Informe o id da conta a receber." };
    }

    return sequelize.transaction(async (transaction) => {
      const conta = await ContaReceber.findByPk(contaReceberId, { transaction });

      if (!conta) {
        throw { status: 404, message: "Conta a receber nao encontrada." };
      }

      if (conta.status === "PAGO") {
        throw { status: 400, message: "Nao e permitido editar uma conta com status PAGO." };
      }

      conta.status = "PAGO";
      conta.data_liquidacao = dados.data_liquidacao || new Date();
      conta.forma_pagamento = dados.forma_pagamento || conta.forma_pagamento;
      conta.historico = dados.historico || conta.historico;
      await conta.save({ transaction });

      await ContabilidadeService.lancarRecebimento({
        contaReceber: conta,
        transaction
      });

      return conta;
    });
  }

  static async fluxoCaixa() {
    return RelatorioService.fluxoCaixa();
  }
}

module.exports = FinanceiroService;
