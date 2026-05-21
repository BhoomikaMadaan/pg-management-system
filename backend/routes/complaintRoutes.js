const express = require("express");
const router = express.Router();

const { addComplaint, getComplaints } = require("../controllers/complaintController");

router.post("/complaints", addComplaint);
router.get("/complaints", getComplaints);

module.exports = router;