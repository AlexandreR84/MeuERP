const CompraService = require("../services/compraService");

class CompraController {
  static async registrar(req, res, next) {
    try {
      const resultado = await CompraService.registrarCompra(req.body, req.usuario);
      return res.status(201).json(resultado);
    } catch (error) {
      return next(error);
    }
  }

  static async receber(req, res, next) {
    try {
      const resultado = await CompraService.confirmarRecebimento(req.body, req.usuario);
      return res.json(resultado);
    } catch (error) {
      return next(error);
    }
  }

  static async baixarContaPagar(req, res, next) {
    try {
      const { conta_pagar_id, ...dados } = req.body;
      const conta = await CompraService.baixarContaPagar(conta_pagar_id, dados);
      return res.json(conta);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = CompraController;
