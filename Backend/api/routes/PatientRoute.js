// routes/PatientRoute.js
import express from "express";
import {
  registerPatient,
  loginPatient,
  getAllPatients,
  updatePatient,
  deletePatient,
} from "../controllers/PatientController.js";

const router = express.Router();

// Register a new patient
router.post("/register", registerPatient);

// Login a patient
router.post("/login", loginPatient);

router.get("/get-patients", getAllPatients);

router.put("/update-patient", updatePatient);

router.post("/delete-patient", deletePatient);

export default router;
