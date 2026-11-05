// routes/ReviewRoute.js
import express from "express";
import { createReview, getAllReviews } from "../controllers/ReviewController.js";

const router = express.Router();

router.get("/", getAllReviews);

router.post("/", createReview);

export default router;
