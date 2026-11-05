// controllers/ContactController.js
import { Contact } from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.create({ name, email, message });

    return res.status(201).json({
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: contacts });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
