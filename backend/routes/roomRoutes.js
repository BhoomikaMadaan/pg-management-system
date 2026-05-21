const express = require("express");
const router = express.Router();

const { addRoom, getRooms } = require("../controllers/roomController");

router.post("/rooms", addRoom);
router.get("/rooms", getRooms);

module.exports = router;