import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
