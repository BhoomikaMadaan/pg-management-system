/**
 * Socket.io Handler - Enhanced
 * This module handles all real-time events including messaging, notifications, and user presence.
 */

const socketHandler = (io) => {
    // Track active users
    const activeUsers = new Map();
    const userSockets = new Map();

    io.on("connection", (socket) => {
        console.log(`⚡ New user connected: ${socket.id}`);

        // Store user info
        let currentUser = { socketId: socket.id, userId: null, role: null };

        /**
         * User login - register their user ID with socket
         */
        socket.on("userLogin", (data) => {
            const userId = typeof data === "string" ? data : data.userId;
            const role = data.role || null;
            
            currentUser.userId = userId;
            currentUser.role = role;
            
            socket.join(`user_${userId}`);
            if (role) socket.join(`role_${role}`);
            
            activeUsers.set(userId, { socketId: socket.id, role, timestamp: Date.now() });
            if (!userSockets.has(userId)) userSockets.set(userId, []);
            userSockets.get(userId).push(socket.id);
            
            console.log(`[User Login] User ${userId} (${role}) connected with socket ${socket.id}`);
            io.emit("userOnline", { userId, role, status: "online", timestamp: Date.now() });
        });

        /**
         * Send message with read receipts
         */
        socket.on("sendMessage", (data) => {
            const { fromId, toId, text, id, timestamp, attachments = [] } = data;
            console.log(`[Message] From ${fromId} to ${toId}: ${text}`);
            
            const message = {
                id,
                fromId,
                toId,
                text,
                timestamp,
                read: false,
                delivered: true,
                attachments
            };

            // Emit to recipient
            io.to(`user_${toId}`).emit("receiveMessage", message);
            
            // Also emit back to sender for UI consistency
            io.to(`user_${fromId}`).emit("receiveMessage", message);
            
            // Message delivery confirmation
            socket.emit("messageSent", { id, timestamp, delivered: true });
        });

        /**
         * Typing indicator
         */
        socket.on("userTyping", (data) => {
            const { toId, fromId, isTyping } = data;
            io.to(`user_${toId}`).emit("userTyping", { fromId, isTyping, timestamp: Date.now() });
        });

        /**
         * Mark message as read with delivery confirmation
         */
        socket.on("markMessageRead", (data) => {
            const { messageId, fromId, toId } = data;
            io.emit("messageMarkedRead", { messageId, fromId, toId, timestamp: Date.now() });
        });

        /**
         * Read receipt acknowledgment
         */
        socket.on("readReceipt", (data) => {
            const { toId, fromId, messageIds } = data;
            io.to(`user_${toId}`).emit("readReceipt", { fromId, messageIds, timestamp: Date.now() });
        });

        /**
         * Join room by role or custom room
         */
        socket.on("joinRoom", (room) => {
            socket.join(room);
            console.log(`[Join Room] User ${currentUser.userId} joined room: ${room}`);
        });

        /**
         * New Complaint - Notify admins
         */
        socket.on("newComplaint", (data) => {
            console.log(`[New Complaint] Submitted by ${currentUser.userId}:`, data.title);
            
            io.to("role_admin").emit("notification", {
                id: `notif_${Date.now()}`,
                type: "NEW_COMPLAINT",
                title: "New Complaint",
                message: `${data.userName} submitted a complaint: "${data.title}"`,
                details: data,
                severity: "high",
                actionable: true
            });
        });

        /**
         * Complaint Resolved - Notify tenant
         */
        socket.on("complaintResolved", (data) => {
            const { tenantId, tenantName, complaintDetails } = data;
            console.log(`[Complaint Resolved] For tenant ${tenantId}`);
            
            io.to(`user_${tenantId}`).emit("notification", {
                id: `notif_${Date.now()}`,
                type: "COMPLAINT_RESOLVED",
                title: "Complaint Resolved",
                message: `Your complaint "${complaintDetails.title}" has been resolved.`,
                details: complaintDetails,
                severity: "info"
            });
        });

        /**
         * Rent Reminder - Notify tenants
         */
        socket.on("rentReminder", (data) => {
            console.log(`[Rent Reminder] Triggered by ${currentUser.userId}`);
            
            io.to("role_tenant").emit("notification", {
                id: `notif_${Date.now()}`,
                type: "RENT_REMINDER",
                title: "Rent Due",
                message: `Reminder: Your rent is due on ${data.dueDate}. Amount: ₹${data.amount}`,
                details: data,
                severity: "high",
                actionable: true
            });
        });

        /**
         * Payment Received - Notify relevant parties
         */
        socket.on("paymentReceived", (data) => {
            const { tenantId, amount, tenantName } = data;
            console.log(`[Payment Received] ₹${amount} from ${tenantName}`);
            
            // Notify tenant
            io.to(`user_${tenantId}`).emit("notification", {
                id: `notif_${Date.now()}`,
                type: "PAYMENT_CONFIRMED",
                title: "Payment Received",
                message: `We received your payment of ₹${amount}. Thank you!`,
                details: data,
                severity: "success"
            });
            
            // Notify admins
            io.to("role_admin").emit("notification", {
                id: `notif_${Date.now()}`,
                type: "PAYMENT_RECEIVED",
                title: "Payment Received",
                message: `${tenantName} paid ₹${amount}`,
                details: data,
                severity: "info"
            });
        });

        /**
         * Broadcast notification by admin
         */
        socket.on("broadcastNotification", (data) => {
            if (currentUser.role !== "admin") {
                socket.emit("error", { message: "Only admins can broadcast notifications" });
                return;
            }
            
            console.log(`[Broadcast] From admin ${currentUser.userId}: ${data.title}`);
            
            io.emit("notification", {
                id: `notif_${Date.now()}`,
                type: data.type || "BROADCAST",
                title: data.title,
                message: data.message,
                severity: data.severity || "info",
                details: data.details
            });
        });

        /**
         * Update user activity status
         */
        socket.on("setPresence", (status) => {
            if (currentUser.userId) {
                const user = activeUsers.get(currentUser.userId);
                if (user) {
                    user.status = status; // "online", "away", "offline", "dnd"
                    activeUsers.set(currentUser.userId, user);
                    io.emit("presenceUpdate", { userId: currentUser.userId, status, timestamp: Date.now() });
                }
            }
        });

        /**
         * Get active users list
         */
        socket.on("getActiveUsers", () => {
            const users = Array.from(activeUsers.entries()).map(([userId, data]) => ({
                userId,
                status: data.status || "online",
                role: data.role
            }));
            socket.emit("activeUsers", users);
        });

        /**
         * Handle disconnection
         */
        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
            
            if (currentUser.userId) {
                const sockets = userSockets.get(currentUser.userId) || [];
                const remaining = sockets.filter(s => s !== socket.id);
                
                if (remaining.length === 0) {
                    activeUsers.delete(currentUser.userId);
                    userSockets.delete(currentUser.userId);
                    io.emit("userOffline", { 
                        userId: currentUser.userId, 
                        status: "offline", 
                        timestamp: Date.now() 
                    });
                } else {
                    userSockets.set(currentUser.userId, remaining);
                }
            }
        });

        /**
         * Error handling
         */
        socket.on("error", (err) => {
            console.error(`Socket error for ${socket.id}:`, err);
        });
    });
};

module.exports = socketHandler;
