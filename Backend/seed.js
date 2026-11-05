// seed.js - creates the default doctors, demo patient and sample appointments
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "node:url";
import { mongoDBUrl } from "./config.js";
import { Doctor } from "./api/models/Doctor.js";
import { Patient } from "./api/models/Patient.js";
import { Appointment } from "./api/models/Appointment.js";

const doctors = [
  {
    name: "Dr. Smith",
    specialty: "Cardiology",
    patients: 120,
    appointments: 450,
    experience: 15,
    qualifications: "MD, FACC",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "Dr. Smith is a renowned cardiologist with over 15 years of experience in treating complex heart conditions.",
  },
  {
    name: "Dr. Johnson",
    specialty: "Pediatrics",
    patients: 200,
    appointments: 600,
    experience: 10,
    qualifications: "MD, FAAP",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    bio: "Dr. Johnson is a compassionate pediatrician dedicated to providing comprehensive care for children of all ages.",
  },
  {
    name: "Dr. Williams",
    specialty: "Orthopedics",
    patients: 150,
    appointments: 500,
    experience: 12,
    qualifications: "MD, FAAOS",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    bio: "Dr. Williams specializes in sports medicine and joint replacement surgeries, helping patients regain mobility and improve their quality of life.",
  },
  {
    name: "Dr. Brown",
    specialty: "Neurology",
    patients: 100,
    appointments: 350,
    experience: 18,
    qualifications: "MD, PhD",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    bio: "Dr. Brown is a leading neurologist with expertise in treating a wide range of neurological disorders and conducting groundbreaking research.",
  },
  {
    name: "Dr. Taylor",
    specialty: "Dermatology",
    patients: 180,
    appointments: 550,
    experience: 8,
    qualifications: "MD, FAAD",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    bio: "Dr. Taylor is a skilled dermatologist specializing in both medical and cosmetic dermatology, helping patients achieve healthy and beautiful skin.",
  },
  {
    name: "Dr. Alex",
    specialty: "Gynecologist",
    patients: 350,
    appointments: 650,
    experience: 10,
    qualifications: "MD, PhD",
    image: "https://randomuser.me/api/portraits/men/94.jpg",
    bio: "Dr. Alex is an experienced gynecologist providing comprehensive women's health care, specializing in reproductive health, pregnancy care, and preventive medicine for women of all ages.",
  },
  {
    name: "Dr. Wilson",
    specialty: "General practitioner",
    patients: 250,
    appointments: 620,
    experience: 12,
    qualifications: "MD, PHD",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    bio: "Dr. Wilson is an experienced general practitioner providing comprehensive primary care and preventive medicine for patients of all ages.",
  },
  {
    name: "Dennis Schmidt",
    specialty: "Anesthesiologist",
    patients: 350,
    appointments: 750,
    experience: 17,
    qualifications: "MD, PHD",
    image: "https://randomuser.me/api/portraits/men/26.jpg",
    bio: "Dr. Dennis Schmidt is an experienced anesthesiologist providing comprehensive primary care and preventive medicine for patients of all ages.",
  },
  {
    name: "Reginald Bennett",
    specialty: "Ophthalmologist",
    patients: 150,
    appointments: 450,
    experience: 15,
    qualifications: "MD, PHD",
    image: "https://randomuser.me/api/portraits/men/18.jpg",
    bio: "Dr. Reginald Bennett is an experienced ophthalmologist providing comprehensive primary care and preventive medicine for patients of all ages.",
  },
];

export async function seedDatabase() {
  if ((await Doctor.countDocuments()) === 0) {
    await Doctor.insertMany(doctors);
    console.log("Seeded doctors");
  }

  const demoPatient = await Patient.findOne({ email: "demo@healthnest.com" });
  if (!demoPatient) {
    await Patient.create({
      name: "Demo Patient",
      email: "demo@healthnest.com",
      password: await bcrypt.hash("demo1234", 10),
      gender: "Male",
      mobile: "5551234567",
      age: 32,
      patientId: uuidv4(),
    });
    console.log("Seeded demo patient");
  }

  if ((await Appointment.countDocuments()) === 0) {
    const [first, second] = await Doctor.find().sort({ createdAt: 1 }).limit(2);
    if (first && second) {
      await Appointment.create([
        {
          patientName: "John Doe",
          doctor: first._id,
          appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          notes: "Regular checkup",
        },
        {
          patientName: "Jane Smith",
          doctor: second._id,
          appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          notes: "Follow-up",
        },
      ]);
      console.log("Seeded sample appointments");
    }
  }
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  mongoose
    .connect(mongoDBUrl)
    .then(async () => {
      await seedDatabase();
      console.log("Database seeded successfully");
      await mongoose.disconnect();
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
