// controllers/DoctorController.js
import { Doctor } from "../models/Doctor.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: 1 });
    return res.status(200).json({ data: doctors });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ data: doctor });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
