const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");   // database connection

// Import Models
const User = require("./models/User");
const Room = require("./models/Room");
const Tenant = require("./models/Tenant");
const Complaint = require("./models/Complaint");
const Payment = require("./models/Payment");
const roomRoutes = require("./routes/roomRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", roomRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("PG Management System API Running");
});

const PORT = 5000;

// Connect to database and sync tables
sequelize.authenticate()
.then(() => {
    console.log("Database connected successfully");

    return sequelize.sync();   // create tables if not present
})
.then(() => {
    console.log("All tables created successfully");

    // Start server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

})
.catch((err) => {
    console.error("Database connection error:", err);
});