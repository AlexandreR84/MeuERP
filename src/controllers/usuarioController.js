const UsuarioService = require("../services/usuarioService");

class UsuarioController {
  static async criar(req, res, next) {
    try {
      const usuario = await UsuarioService.criar(req.body);
      return res.status(201).json(usuario);
    } catch (error) {
      return next(error);
    }
  }

  static async listar(req, res, next) {
    try {
      const usuarios = await UsuarioService.listar();
      return res.json(usuarios);
    } catch (error) {
      return next(error);
    }
  }

  static async obterPorId(req, res, next) {
    try {
      const usuario = await UsuarioService.obterPorId(req.params.id);
      return res.json(usuario);
    } catch (error) {
      return next(error);
    }
  }

  static async atualizar(req, res, next) {
    try {
      const usuario = await UsuarioService.atualizar(req.params.id, req.body);
      return res.json(usuario);
    } catch (error) {
      return next(error);
    }
  }

  static async desabilitar(req, res, next) {
    try {
      const usuario = await UsuarioService.desabilitar(req.params.id);
      return res.json(usuario);
    } catch (error) {
      return next(error);
    }
  }

  static async remover(req, res, next) {
    try {
      const resultado = await UsuarioService.remover(req.params.id);
      return res.json(resultado);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = UsuarioController;
