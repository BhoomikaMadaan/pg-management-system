/**
 * Socket.io Handler
 * This module handles all real-time events and connections.
 */

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`⚡ New user connected: ${socket.id}`);

        // Listen for custom events here (e.g., chat messages, notifications)
        socket.on("message", (data) => {
            console.log(`Message from ${socket.id}:`, data);
            // Broadcast to all clients
            io.emit("message", data);
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });
};

module.exports = socketHandler;
