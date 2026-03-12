const { io } = require("socket.io-client");

// Connect to the server
const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("✅ Successfully connected to Socket.io server!");
    console.log("My Socket ID:", socket.id);

    // Send a test message
    console.log("Sending test message...");
    socket.emit("message", { text: "Hello from test script!" });
});

// Listen for broadcasted messages
socket.on("message", (data) => {
    console.log("📩 Received from server:", data);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
});

socket.on("connect_error", (error) => {
    console.log("❗ Connection Error:", error.message);
});
