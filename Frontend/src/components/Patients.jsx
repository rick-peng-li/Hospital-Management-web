import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const emptyPatient = {
  name: "",
  age: "",
  gender: "",
  mobile: "",
  email: "",
  password: "",
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newPatient, setNewPatient] = useState(emptyPatient);
  const [error, setError] = useState("");

  const loadPatients = async () => {
    try {
      const response = await axios.get("/api/patients/get-patients");
      setPatients(response.data.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleInputChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setNewPatient(emptyPatient);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPatient.name.trim().length < 4) {
      setError("Name must be at least 4 characters long.");
      return;
    }

    if (newPatient.mobile && !/^[0-9]{10}$/.test(newPatient.mobile.replace(/\D/g, ""))) {
      setError("Contact number should contain 10 digits.");
      return;
    }

    try {
      if (editingId) {
        await axios.put("/api/patients/update-patient", {
          patientId: editingId,
          name: newPatient.name,
          email: newPatient.email,
          age: Number(newPatient.age),
          gender: newPatient.gender,
          mobile: newPatient.mobile,
          password: newPatient.password || undefined,
        });
      } else {
        await axios.post("/api/patients/register", {
          name: newPatient.name,
          email: newPatient.email,
          age: Number(newPatient.age),
          gender: newPatient.gender,
          mobile: newPatient.mobile,
          password: newPatient.password,
        });
      }

      await loadPatients();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save patient.");
    }
  };

  const startEdit = (patient) => {
    setEditingId(patient._id);
    setNewPatient({
      name: patient.name,
      email: patient.email,
      age: patient.age,
      gender: patient.gender,
      mobile: patient.mobile,
      password: "",
    });
    setShowForm(true);
  };

  const deletePatient = async (id) => {
    try {
      await axios.post("/api/patients/delete-patient", { patientId: id });
      await loadPatients();
    } catch (error) {
      console.log("Error in deleting the patient", error);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-light min-h-screen p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6 sm:mb-8">
        Patient Management
      </h1>

      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-accent text-primary px-6 py-2 rounded-full font-bold flex items-center"
          onClick={showForm ? resetForm : () => setShowForm(true)}
        >
          <FaUserPlus className="mr-2" />
          {showForm ? "Cancel" : "Add New Patient"}
        </motion.button>
        <div className="relative w-full sm:w-auto">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
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
              name="name"
              placeholder="Patient Name"
              className="p-2 border border-gray-300 rounded"
              value={newPatient.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Patient Email"
              className="p-2 border border-gray-300 rounded"
              value={newPatient.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              className="p-2 border border-gray-300 rounded"
              value={newPatient.age}
              onChange={handleInputChange}
              required
            />
            <select
              name="gender"
              className="p-2 border border-gray-300 rounded"
              value={newPatient.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="tel"
              name="mobile"
              placeholder="Contact Number"
              className="p-2 border border-gray-300 rounded"
              value={newPatient.mobile}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder={editingId ? "New password (optional)" : "Password"}
              className="p-2 border border-gray-300 rounded"
              value={newPatient.password}
              onChange={handleInputChange}
              required={!editingId}
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="mt-4 bg-accent text-primary px-6 py-2 rounded-full font-bold"
          >
            {editingId ? "Save Changes" : "Add Patient"}
          </button>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <motion.div
            key={patient._id}
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-xl font-semibold text-primary mb-2">
              {patient.name}
            </h3>
            <p className="text-gray-600 mb-1">Age: {patient.age}</p>
            <p className="text-gray-600 mb-1">Gender: {patient.gender}</p>
            <p className="text-gray-600 mb-1">Contact: {patient.mobile}</p>
            <p className="text-gray-600 mb-4">Email: {patient.email}</p>
            <div className="flex justify-end">
              <button
                className="text-blue-500 mr-2"
                onClick={() => startEdit(patient)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500"
                onClick={() => deletePatient(patient._id)}
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <p className="text-center text-gray-500">No patients found.</p>
      )}
    </div>
  );
};

export default Patients;
