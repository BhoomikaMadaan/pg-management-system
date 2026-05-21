const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Tenant = sequelize.define("Tenant", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  join_date: {
    type: DataTypes.DATE
  }
});

module.exports = Tenant;