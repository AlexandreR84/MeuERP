const PlanoContaService = require("../services/planoContaService");

class PlanoContaController {
  static async criar(req, res, next) {
    try {
      const conta = await PlanoContaService.criar(req.body);
      return res.status(201).json(conta);
    } catch (error) {
      return next(error);
    }
  }

  static async listar(req, res, next) {
    try {
      const contas = await PlanoContaService.listar();
      return res.json(contas);
    } catch (error) {
      return next(error);
    }
  }

  static async obterPorId(req, res, next) {
    try {
      const conta = await PlanoContaService.obterPorId(req.params.id);
      return res.json(conta);
    } catch (error) {
      return next(error);
    }
  }

  static async atualizar(req, res, next) {
    try {
      const conta = await PlanoContaService.atualizar(req.params.id, req.body);
      return res.json(conta);
    } catch (error) {
      return next(error);
    }
  }

  static async desabilitar(req, res, next) {
    try {
      const conta = await PlanoContaService.desabilitar(req.params.id);
      return res.json(conta);
    } catch (error) {
      return next(error);
    }
  }

  static async remover(req, res, next) {
    try {
      const resultado = await PlanoContaService.remover(req.params.id);
      return res.json(resultado);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = PlanoContaController;
