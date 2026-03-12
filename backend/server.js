const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./config/database");   // import database connection
const socketHandler = require("./sockets/socketHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust this to your frontend URL in production for security
        methods: ["GET", "POST"]
    }
});

// Attach Socket.io handler
socketHandler(io);

// Test route
app.get("/", (req, res) => {
    res.send("PG Management System API Running with Socket.io");
});

// Test database connection
sequelize.authenticate()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});