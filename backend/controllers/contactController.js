import TrustedContact from "../models/TrustedContact.js";

// ADD contact
export const addContact = async (req, res) => {
  try {
    const { name, phone, relation, created_by } = req.body;

    if (!name || !phone || !created_by) {
      return res.status(400).json({
        success: false,
        error: "name, phone and created_by are required"
      });
    }

    const contact = await TrustedContact.create({
      name,
      phone,
      relation,
      created_by
    });

    res.status(201).json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET contacts
export const getContacts = async (req, res) => {
  try {
    const { created_by } = req.query;

    if (!created_by) {
      return res.status(400).json({
        success: false,
        error: "created_by is required"
      });
    }

    const contacts = await TrustedContact.find({ created_by });
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE contact
export const deleteContact = async (req, res) => {
  try {
    await TrustedContact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
