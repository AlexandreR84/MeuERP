const RelatorioService = require("../services/relatorioService");

class RelatorioController {
  static async necessidadeCompra(req, res, next) {
    try {
      const dados = await RelatorioService.necessidadeCompra();
      return res.json(dados);
    } catch (error) {
      return next(error);
    }
  }

  static async lucratividade(req, res, next) {
    try {
      const dados = await RelatorioService.lucratividade();
      return res.json(dados);
    } catch (error) {
      return next(error);
    }
  }

  static async impostos(req, res, next) {
    try {
      const dados = await RelatorioService.impostos();
      return res.json(dados);
    } catch (error) {
      return next(error);
    }
  }

  static async balanco(req, res, next) {
    try {
      const dados = await RelatorioService.balancoPatrimonial();
      return res.json(dados);
    } catch (error) {
      return next(error);
    }
  }

  static async dre(req, res, next) {
    try {
      const dados = await RelatorioService.dre();
      return res.json(dados);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = RelatorioController;
