const ClienteService = require("../services/clienteService");

class ClienteController {
  static async criar(req, res, next) {
    try {
      const cliente = await ClienteService.criar(req.body);
      return res.status(201).json(cliente);
    } catch (error) {
      return next(error);
    }
  }

  static async listar(req, res, next) {
    try {
      const clientes = await ClienteService.listar();
      return res.json(clientes);
    } catch (error) {
      return next(error);
    }
  }

  static async obterPorId(req, res, next) {
    try {
      const cliente = await ClienteService.obterPorId(req.params.id);
      return res.json(cliente);
    } catch (error) {
      return next(error);
    }
  }

  static async atualizar(req, res, next) {
    try {
      const cliente = await ClienteService.atualizar(req.params.id, req.body);
      return res.json(cliente);
    } catch (error) {
      return next(error);
    }
  }

  static async desabilitar(req, res, next) {
    try {
      const cliente = await ClienteService.desabilitar(req.params.id);
      return res.json(cliente);
    } catch (error) {
      return next(error);
    }
  }

  static async remover(req, res, next) {
    try {
      const resultado = await ClienteService.remover(req.params.id);
      return res.json(resultado);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ClienteController;
