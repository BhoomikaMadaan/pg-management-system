const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Room = sequelize.define("Room", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  room_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rent: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("available", "occupied", "maintenance", "blocked"),
    defaultValue: "available"
  },
  floor_number: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Room;