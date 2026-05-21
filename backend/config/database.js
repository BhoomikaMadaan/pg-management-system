const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "pg_management",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "root",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

sequelize.authenticate()
    .then(() => {
        console.log("✅ Database connected successfully");
    })
    .catch((err) => {
        console.log("❌ Database connection failed:", err.message);
    });

module.exports = sequelize;