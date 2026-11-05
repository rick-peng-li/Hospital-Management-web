import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { PORT, mongoDBUrl } from "./config.js";
import { seedDatabase } from "./seed.js";
import patientRoutes from "./api/routes/PatientRoute.js";
import doctorRoutes from "./api/routes/DoctorRoute.js";
import appointmentRoutes from "./api/routes/AppointmentRoute.js";
import contactRoutes from "./api/routes/ContactRoute.js";
import reviewRoutes from "./api/routes/ReviewRoute.js";
import adminRoutes from "./api/routes/AdminRoute.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

mongoose
  .connect(mongoDBUrl)
  .then(async () => {
    console.log("App connected to database");
    await seedDatabase();
  })
  .catch((error) => {
    console.log(error);
  });

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`App is listening to port: ${PORT}`);
  });
}

export default app;
