/**
 * Socket.io Handler
 * This module handles all real-time events and connections.
 */

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`⚡ New user connected: ${socket.id}`);

        /**
         * 1. joinRoom event
         * Users can join rooms based on their role (e.g., 'admin', 'tenant') or their user ID
         * Example: socket.emit("joinRoom", "admin") or socket.emit("joinRoom", "user_123")
         */
        socket.on("joinRoom", (room) => {
            socket.join(room);
            console.log(`[Join Room] User ${socket.id} joined room: ${room}`);
        });

        /**
         * 2. newComplaint event
         * When a tenant submits a complaint, send a real-time notification to all users in the 'admin' room.
         */
        socket.on("newComplaint", (data) => {
            console.log(`[New Complaint] Submitted by ${socket.id}:`, data);
            
            // Broadcast the notification to all clients in the 'admin' room
            io.to("admin").emit("notification", {
                type: "NEW_COMPLAINT",
                message: "A new complaint has been submitted by a tenant.",
                details: data
            });
        });

        /**
         * 3. complaintResolved event
         * When an admin resolves a complaint, send a notification to the specific tenant.
         * The tenant is expected to have joined a room with their unique tenantId.
         */
        socket.on("complaintResolved", (data) => {
            const { tenantId, complaintDetails } = data;
            console.log(`[Complaint Resolved] For tenant ${tenantId} by admin ${socket.id}`);
            
            // Send notification to the specific tenant's room
            io.to(tenantId).emit("notification", {
                type: "COMPLAINT_RESOLVED",
                message: "Your complaint has been resolved by an administrator.",
                details: complaintDetails
            });
        });

        /**
         * 4. rentReminder event
         * Send a rent reminder notification to all tenants.
         * Tenants are expected to have joined the 'tenant' room.
         */
        socket.on("rentReminder", (data) => {
            console.log(`[Rent Reminder] Triggered by ${socket.id}`);
            
            // Broadcast the notification to all clients in the 'tenant' room
            io.to("tenant").emit("notification", {
                type: "RENT_REMINDER",
                message: "This is a reminder to pay your upcoming rent.",
                details: data
            });
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });
};

module.exports = socketHandler;
