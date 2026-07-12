const jwt = require("jsonwebtoken");
const env = require("../config/env");

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: { code: "UNAUTHENTICATED", message: "Missing or invalid authorization header" } });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, error: { code: "INVALID_TOKEN", message: "Token is expired or invalid" } });
  }
}

module.exports = authenticate;
