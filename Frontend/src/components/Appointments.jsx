import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Login from "./Login";
import {
  FaCalendarPlus,
  FaSearch,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import LoginContext from "../context/LoginContext";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("healthnest_token")}`,
  },
});

const Appointments = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    doctorId: "",
    appointmentDate: new Date(),
    notes: "",
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedDoctorId = queryParams.get("doctorId");

  const loadDoctors = async () => {
    try {
      const response = await axios.get("/api/doctors");
      setDoctors(response.data.data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await axios.get("/api/appointments");
      setAppointments(response.data.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    loadDoctors();
    loadAppointments();
  }, []);

  useEffect(() => {
    if (selectedDoctorId && doctors.length > 0) {
      setNewAppointment((prev) => ({ ...prev, doctorId: selectedDoctorId }));
      setShowForm(true);
    }
  }, [selectedDoctorId, doctors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setNewAppointment((prev) => ({ ...prev, appointmentDate: date }));
  };

  const validateName = (name) => /^[A-Za-z][A-Za-z\s]{3,}$/.test(name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateName(newAppointment.patientName)) {
      setError(
        "Patient name must start with a letter and be at least 4 characters long."
      );
      return;
    }
    if (!(newAppointment.appointmentDate > new Date())) {
      setError("Appointment date must be in the future.");
      return;
    }

    try {
      await axios.post(
        "/api/appointments",
        {
          patientName: newAppointment.patientName,
          doctorId: newAppointment.doctorId,
          appointmentDate: newAppointment.appointmentDate,
          notes: newAppointment.notes,
        },
        authHeader()
      );

      await loadAppointments();
      setNewAppointment({
        patientName: "",
        doctorId: "",
        appointmentDate: new Date(),
        notes: "",
      });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to schedule appointment.");
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`/api/appointments/${id}`, authHeader());
      await loadAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  const completeAppointment = async (id) => {
    try {
      await axios.patch(
        `/api/appointments/${id}/status`,
        { status: "Completed" },
        authHeader()
      );
      await loadAppointments();
    } catch (err) {
      console.error("Error updating appointment:", err);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isLoggedIn ? (
        <div className="bg-light min-h-screen p-4 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6 sm:mb-8">
            Appointment Management
          </h1>

          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-accent text-primary px-6 py-2 rounded-full font-bold flex items-center"
              onClick={() => setShowForm(!showForm)}
            >
              <FaCalendarPlus className="mr-2" />
              {showForm ? "Cancel" : "New Appointment"}
            </motion.button>
            <div className="relative w-full sm:w-auto">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg mb-8"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="patientName"
                  placeholder="Patient Name"
                  className="p-2 border border-gray-300 rounded"
                  value={newAppointment.patientName}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="doctorId"
                  className="p-2 border border-gray-300 rounded"
                  value={newAppointment.doctorId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
                <DatePicker
                  selected={newAppointment.appointmentDate}
                  onChange={handleDateChange}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="p-2 border border-gray-300 rounded w-full"
                />
                <textarea
                  name="notes"
                  placeholder="Notes"
                  className="p-2 border border-gray-300 rounded"
                  value={newAppointment.notes}
                  onChange={handleInputChange}
                />
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="mt-4 bg-accent text-primary px-6 py-2 rounded-full font-bold"
              >
                Schedule Appointment
              </button>
            </motion.form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => (
              <motion.div
                key={appointment._id}
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {appointment.patientName}
                </h3>
                <p className="text-gray-600 mb-2">
                  Doctor: {appointment.doctor?.name}
                </p>
                <p className="text-gray-600 mb-2">
                  Specialty: {appointment.doctor?.specialty}
                </p>
                <p className="text-gray-600 mb-2">
                  Date: {new Date(appointment.appointmentDate).toLocaleString()}
                </p>
                <p className="text-gray-600 mb-4">Notes: {appointment.notes}</p>
                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                  <div>
                    <button
                      className="text-red-500 mr-2"
                      onClick={() => deleteAppointment(appointment._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    {appointment.status !== "Completed" && (
                      <button
                        className="text-green-500"
                        onClick={() => completeAppointment(appointment._id)}
                        title="Mark as Completed"
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <p className="text-center text-gray-500">No appointments found.</p>
          )}
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Appointments;
