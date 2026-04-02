const ProdutoService = require("../services/produtoService");

class ProdutoController {
  static async criar(req, res, next) {
    try {
      const produto = await ProdutoService.criar(req.body);
      return res.status(201).json(produto);
    } catch (error) {
      return next(error);
    }
  }

  static async listar(req, res, next) {
    try {
      const produtos = await ProdutoService.listar();
      return res.json(produtos);
    } catch (error) {
      return next(error);
    }
  }

  static async obterPorId(req, res, next) {
    try {
      const produto = await ProdutoService.obterPorId(req.params.id);
      return res.json(produto);
    } catch (error) {
      return next(error);
    }
  }

  static async atualizar(req, res, next) {
    try {
      const produto = await ProdutoService.atualizar(req.params.id, req.body);
      return res.json(produto);
    } catch (error) {
      return next(error);
    }
  }

  static async desabilitar(req, res, next) {
    try {
      const produto = await ProdutoService.desabilitar(req.params.id);
      return res.json(produto);
    } catch (error) {
      return next(error);
    }
  }

  static async remover(req, res, next) {
    try {
      const resultado = await ProdutoService.remover(req.params.id);
      return res.json(resultado);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ProdutoController;
