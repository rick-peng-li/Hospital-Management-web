// controllers/ReviewController.js
import { Review } from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.create({
      name: name || "Anonymous",
      rating,
      comment: comment || "",
    });

    return res.status(201).json({
      message: "Thank you for your review",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: reviews });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
