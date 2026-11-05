// routes/AdminRoute.js
import express from "express";
import { loginAdmin, getStats } from "../controllers/AdminController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/stats", requireAuth("admin"), getStats);

export default router;
