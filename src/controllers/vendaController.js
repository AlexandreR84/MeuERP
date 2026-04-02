const VendaService = require("../services/vendaService");

class VendaController {
  static async registrar(req, res, next) {
    try {
      const resultado = await VendaService.registrarVenda(req.body, req.usuario);
      return res.status(201).json(resultado);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = VendaController;
