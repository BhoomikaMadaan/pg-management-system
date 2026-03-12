const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("pg_management", "root", "root", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = sequelize;