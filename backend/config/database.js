const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("pg_management", "root", "bunnyhoney123@", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = sequelize;