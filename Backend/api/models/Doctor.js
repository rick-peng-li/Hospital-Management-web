// models/Doctor.js
import mongoose from "mongoose";

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    patients: {
      type: Number,
      default: 0,
    },
    appointments: {
      type: Number,
      default: 0,
    },
    experience: {
      type: Number,
      default: 0,
    },
    qualifications: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
