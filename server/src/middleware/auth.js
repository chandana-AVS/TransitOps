const jwt = require("jsonwebtoken");
const env = require("../config/env");

function authenticate(req, res, next) {
  let token = null;
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, error: { code: "UNAUTHENTICATED", message: "Missing or invalid authorization token" } });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, error: { code: "INVALID_TOKEN", message: "Token is expired or invalid" } });
  }
}

module.exports = authenticate;
