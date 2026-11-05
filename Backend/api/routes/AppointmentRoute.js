// routes/AppointmentRoute.js
import express from "express";
import {
  getAllAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/AppointmentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllAppointments);

router.post("/", requireAuth("patient"), createAppointment);

router.patch("/:id/status", requireAuth(), updateAppointmentStatus);

router.delete("/:id", requireAuth(), deleteAppointment);

export default router;
