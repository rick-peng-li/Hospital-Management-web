// controllers/AppointmentController.js
import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";

const populate = (query) =>
  query.populate("doctor", "name specialty image experience");

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await populate(
      Appointment.find().sort({ appointmentDate: 1 })
    );
    return res.status(200).json({ data: appointments });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { patientName, doctorId, appointmentDate, notes } = req.body;

    if (!patientName || !doctorId || !appointmentDate) {
      return res
        .status(400)
        .json({ message: "Patient, doctor and date are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await Appointment.create({
      patientName,
      doctor: doctor._id,
      appointmentDate: new Date(appointmentDate),
      notes: notes || "",
    });

    const doctorSnapshot = {
      _id: doctor._id,
      name: doctor.name,
      specialty: doctor.specialty,
      image: doctor.image,
      experience: doctor.experience,
    };

    return res.status(201).json({
      message: "Appointment scheduled successfully",
      data: { ...appointment.toObject(), doctor: doctorSnapshot },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Scheduled", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid appointment status" });
    }

    const appointment = await populate(
      Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      )
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
