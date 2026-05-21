const Complaint = require("../models/Complaint");

// Add Complaint
exports.addComplaint = async (req, res) => {
  try {
    const { tenant_id, title, description } = req.body;

    const complaint = await Complaint.create({
      tenant_id,
      title,
      description
    });

    res.status(201).json(complaint);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Complaints
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll();
    res.status(200).json(complaints);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};