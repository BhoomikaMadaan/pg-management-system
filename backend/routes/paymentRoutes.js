const express = require("express");
const router = express.Router();

const { addPayment, getPayments } = require("../controllers/paymentController");

router.post("/payments", addPayment);
router.get("/payments", getPayments);

module.exports = router;