// middleware/auth.js
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config.js";

// Verifies the bearer token and optionally checks the role.
export const requireAuth = (role) => (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (role && payload.role !== role) {
      return res.status(403).json({ message: "You are not allowed to do that" });
    }
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
