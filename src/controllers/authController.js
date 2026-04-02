const AuthService = require("../services/authService");

class AuthController {
  static async login(req, res, next) {
    try {
      const resultado = await AuthService.login(req.body);
      return res.json(resultado);
    } catch (error) {
      return next(error);
    }
  }

  static async me(req, res) {
    return res.json({ usuario: req.usuario });
  }
}

module.exports = AuthController;
