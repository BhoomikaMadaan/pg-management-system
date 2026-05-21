const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Complaint = sequelize.define("Complaint", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  }
});

module.exports = Complaint;