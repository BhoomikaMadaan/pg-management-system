const Room = require("../models/Room");

// Add Room
exports.addRoom = async (req, res) => {
  try {
    const { room_number, capacity, rent } = req.body;

    const room = await Room.create({
      room_number,
      capacity,
      rent
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};