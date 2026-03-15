const { io } = require("socket.io-client");

console.log("Starting Client test...");

// Connect Admin client
const adminSocket = io("http://localhost:5000");

// Connect Tenant client
const tenantSocket = io("http://localhost:5000");

const TENANT_ID = "tenant_001";

// 1. Admin logs in and joins 'admin' room
adminSocket.on("connect", () => {
    console.log(`[Admin] Connected with ID: ${adminSocket.id}`);
    adminSocket.emit("joinRoom", "admin");
});

// Admin listens for notifications
adminSocket.on("notification", (data) => {
    console.log(`\n🔊 [Admin Received Notification]:`, data);

    // If admin gets a complaint, simulate resolving it
    if (data.type === "NEW_COMPLAINT") {
        console.log(`\n⏳ [Admin Action]: Working on resolving complaint from ${data.details.tenantId}...`);
        
        setTimeout(() => {
            console.log(`\n✅ [Admin Emits]: 'complaintResolved'`);
            adminSocket.emit("complaintResolved", {
                tenantId: data.details.tenantId,
                complaintDetails: "We have dispatched a technician. It is fixed now."
            });
        }, 1000);

        // Later, admin also sends out a global rent reminder
        setTimeout(() => {
            console.log(`\n🕒 [Admin Emits]: 'rentReminder'`);
            adminSocket.emit("rentReminder", {
                dueDate: "2026-04-01",
                amount: 15600
            });
        }, 2000);
    }
});

// 2. Tenant logs in and joins 'tenant' room + their unique ID room
tenantSocket.on("connect", () => {
    console.log(`[Tenant] Connected with ID: ${tenantSocket.id}`);
    
    tenantSocket.emit("joinRoom", "tenant"); // Join tenant role-based room
    tenantSocket.emit("joinRoom", TENANT_ID); // Join ID-specific room
    
    // Simulate tenant making a complaint shortly after joining
    setTimeout(() => {
        console.log(`\n📩 [Tenant Emits]: 'newComplaint'`);
        tenantSocket.emit("newComplaint", {
            tenantId: TENANT_ID,
            issue: "Water heater is not working in room 104"
        });
    }, 500);
});

// Tenant listens for notifications
tenantSocket.on("notification", (data) => {
    console.log(`\n🔔 [Tenant Received Notification]:`, data);
});

// Auto-close test file after showing flow
setTimeout(() => {
    console.log("\n🛑 Terminating test connections...");
    adminSocket.disconnect();
    tenantSocket.disconnect();
    process.exit(0);
}, 3500);
