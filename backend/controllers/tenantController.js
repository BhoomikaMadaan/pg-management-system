const Tenant = require("../models/Tenant");

// Add Tenant
exports.addTenant = async (req, res) => {
  try {
    const { user_id, room_id, join_date } = req.body;

    const tenant = await Tenant.create({
      user_id,
      room_id,
      join_date
    });

    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Tenants
exports.getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll();
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};