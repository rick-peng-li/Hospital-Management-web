// controllers/PatientController.js
import { Patient } from "../models/Patient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { JWT_SECRET } from "../../config.js";

const publicPatient = (patient) => {
  const result = patient.toObject ? patient.toObject() : { ...patient };
  delete result.password;
  return result;
};

// Register a new patient
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, gender, mobile, age } = req.body;

    if (!name || !email || !password || !gender || !mobile || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingPatient = await Patient.findOne({
      email: email.toLowerCase(),
    });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = await Patient.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      gender,
      mobile,
      age,
      patientId: uuidv4(),
    });

    return res.status(201).json({
      message: "Patient registered successfully",
      patient: publicPatient(newPatient),
    });
  } catch (error) {
    console.error("Error registering patient:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("-password")
      .sort({ createdAt: -1 });
    return res.status(200).json({ data: patients });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login a patient
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const patient = await Patient.findOne({ email: email.toLowerCase() });
    if (!patient) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token, patient: publicPatient(patient) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { patientId, password, ...fields } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: "Patient id is required" });
    }

    if (fields.email) {
      fields.email = fields.email.toLowerCase();
    }
    if (password) {
      fields.password = await bcrypt.hash(password, 10);
    }

    const patient = await Patient.findByIdAndUpdate(patientId, fields, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { patientId } = req.body;
    const patient = await Patient.findByIdAndDelete(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
