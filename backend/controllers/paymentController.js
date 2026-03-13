const Payment = require("../models/Payment");

// Add Payment
exports.addPayment = async (req, res) => {
  try {
    const { tenant_id, amount, month } = req.body;

    const payment = await Payment.create({
      tenant_id,
      amount,
      month
    });

    res.status(201).json(payment);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json(payments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};