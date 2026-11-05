// routes/ContactRoute.js
import express from "express";
import { createContact, getAllContacts } from "../controllers/ContactController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createContact);

router.get("/", requireAuth("admin"), getAllContacts);

export default router;
