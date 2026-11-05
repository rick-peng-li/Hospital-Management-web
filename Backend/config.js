import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 6005;

export const mongoDBUrl =
  process.env.DB_Url || "mongodb://127.0.0.1:27017/healthnest";

export const JWT_SECRET = process.env.JWT_SECRET || "healthnest_jwt_secret";

export const ADMIN_USER = process.env.ADMIN_USER || "admin";

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";
