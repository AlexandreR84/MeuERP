const FornecedorService = require("../services/fornecedorService");

class FornecedorController {
  static async criar(req, res, next) {
    try {
      const fornecedor = await FornecedorService.criar(req.body);
      return res.status(201).json(fornecedor);
    } catch (error) {
      return next(error);
    }
  }

  static async listar(req, res, next) {
    try {
      const fornecedores = await FornecedorService.listar();
      return res.json(fornecedores);
    } catch (error) {
      return next(error);
    }
  }

  static async obterPorId(req, res, next) {
    try {
      const fornecedor = await FornecedorService.obterPorId(req.params.id);
      return res.json(fornecedor);
    } catch (error) {
      return next(error);
    }
  }

  static async atualizar(req, res, next) {
    try {
      const fornecedor = await FornecedorService.atualizar(req.params.id, req.body);
      return res.json(fornecedor);
    } catch (error) {
      return next(error);
    }
  }

  static async desabilitar(req, res, next) {
    try {
      const fornecedor = await FornecedorService.desabilitar(req.params.id);
      return res.json(fornecedor);
    } catch (error) {
      return next(error);
    }
  }

  static async remover(req, res, next) {
    try {
      const resultado = await FornecedorService.remover(req.params.id);
      return res.json(resultado);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = FornecedorController;
