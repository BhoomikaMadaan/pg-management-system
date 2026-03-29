const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./config/database");

// GraphQL
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");

// Import Models
const User = require("./models/User");
const Room = require("./models/Room");
const Tenant = require("./models/Tenant");
const Complaint = require("./models/Complaint");
const Payment = require("./models/Payment");

// Routes
const roomRoutes = require("./routes/roomRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Sockets
const socketHandler = require("./sockets/socketHandler");
const socketService = require("./sockets/socketService");

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

// Initialize the Socket.io service for controllers
socketService.init(io);

// Attach Socket.io handler
socketHandler(io);

// REST API routes
app.use("/api", roomRoutes);
app.use("/api", tenantRoutes);
app.use("/api", complaintRoutes);
app.use("/api", paymentRoutes);

// GraphQL endpoint
app.use("/graphql", graphqlHTTP({
  schema: schema,
  graphiql: true
}));

// Test route
app.get("/", (req, res) => {
    res.send("PG Management System API Running with GraphQL and Socket.io");
});

const PORT = 5000;

// Connect to database and sync tables
sequelize.authenticate()
    .then(() => {
        console.log("Database connected successfully");
        return sequelize.sync();
    })
    .then(() => {
        console.log("All tables created/synced successfully");
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

