const express = require("express");
const AuthController = require("../controllers/authController");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", AuthController.login);
router.get("/me", requireAuth, AuthController.me);

module.exports = router;
