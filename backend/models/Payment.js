const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.INTEGER
  },
  amount: {
    type: DataTypes.INTEGER
  },
  month: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  }
});

module.exports = Payment;