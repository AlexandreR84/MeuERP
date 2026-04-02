const crypto = require("crypto");

const TOKEN_SECRET = process.env.AUTH_SECRET || "micro-erp-academico-secret";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, originalHash] = String(storedHash || "").split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
}

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyToken(token) {
  const [body, signature] = String(token || "").split(".");

  if (!body || !signature) {
    throw new Error("Token invalido.");
  }

  const expectedSignature = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error("Assinatura do token invalida.");
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (payload.exp && Date.now() > payload.exp) {
    throw new Error("Sessao expirada.");
  }

  return payload;
}

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken
};
