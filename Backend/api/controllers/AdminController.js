// controllers/AdminController.js
import jwt from "jsonwebtoken";
import { Patient } from "../models/Patient.js";
import { Doctor } from "../models/Doctor.js";
import { Appointment } from "../models/Appointment.js";
import { Review } from "../models/Review.js";
import {
  JWT_SECRET,
  ADMIN_USER,
  ADMIN_PASSWORD,
} from "../../config.js";

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({ token, username });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const [doctors, patients, appointments, completed, reviews] =
      await Promise.all([
        Doctor.countDocuments(),
        Patient.countDocuments(),
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: "Completed" }),
        Review.countDocuments(),
      ]);

    return res.status(200).json({
      data: { doctors, patients, appointments, completed, reviews },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
