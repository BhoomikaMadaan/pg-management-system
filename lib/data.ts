// lib/data.ts  — Seed data for the entire app

export type Role = "owner" | "tenant";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  roomId?: string; // tenant's assigned room
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Room {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  ownerId: string;
  location: string;
  tenantId?: string;
  isBooked: boolean;
  amenities: string[];
  floor: number;
  type: "Single" | "Double" | "Suite" | "Triple";
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  roomId?: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  priority: "high" | "medium" | "low";
  category: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  roomId: string;
  amount: number;
  method: string;
  status: "paid" | "due" | "overdue";
  date: string;
}

export const SEED_USERS: User[] = [
  { id: "u1", name: "John Landlord",  email: "owner@demo.com",  password: "owner123",  role: "owner" },
  { id: "u9", name: "Sarah Property", email: "sarah@demo.com",  password: "owner123",  role: "owner" },
  { id: "u2", name: "Alex Johnson",   email: "alex@demo.com",   password: "alex123",   role: "tenant", roomId: "r1" },
  { id: "u3", name: "Sara Mehta",     email: "sara@demo.com",   password: "sara123",   role: "tenant", roomId: "r3" },
  { id: "u4", name: "David Kumar",    email: "david@demo.com",  password: "david123",  role: "tenant", roomId: "r5" },
  { id: "u5", name: "Priya Sharma",   email: "priya@demo.com",  password: "priya123",  role: "tenant", roomId: "r2" },
];

export const SEED_ROOMS: Room[] = [
  {
    id: "r1", title: "Premium Single Suite", price: 13000, type: "Suite", isBooked: true,
    description: "Spacious air-conditioned suite with attached bathroom, fast WiFi, and 24/7 water supply. Ideal for working professionals.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop",
    ownerId: "u1", location: "Bengaluru", tenantId: "u2", amenities: ["AC", "WiFi", "Attached Bath", "Mess"], floor: 2,
  },
  {
    id: "r2", title: "Cozy Single Room", price: 9500, type: "Single", isBooked: true,
    description: "Comfortable single occupancy room with shared bathroom, high-speed internet, and access to common kitchen and TV lounge.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop",
    ownerId: "u1", location: "Mumbai", tenantId: "u5", amenities: ["WiFi", "Ceiling Fan", "Common Kitchen"], floor: 1,
  },
  {
    id: "r3", title: "Sharing Double Bed", price: 7000, type: "Double", isBooked: true,
    description: "Affordable sharing room with double bed, lockers for each tenant, common bathroom, and included lunch/dinner mess.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format&fit=crop",
    ownerId: "u1", location: "Pune", tenantId: "u3", amenities: ["WiFi", "Locker", "Mess", "TV"], floor: 1,
  },
  {
    id: "r4", title: "Luxury AC Suite", price: 16000, type: "Suite", isBooked: false,
    description: "Premium luxury suite on the top floor with private balcony, AC, refrigerator, and premium mattresses. All meals included.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
    ownerId: "u9", location: "Delhi", tenantId: undefined, amenities: ["AC", "WiFi", "Balcony", "Fridge", "All Meals"], floor: 3,
  },
  {
    id: "r5", title: "Triple Sharing Room", price: 5500, type: "Triple", isBooked: true,
    description: "Budget-friendly triple sharing room with bunk beds, lockers, shared bathroom, and basic WiFi. Great for students.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop",
    ownerId: "u9", location: "Hyderabad", tenantId: "u4", amenities: ["WiFi", "Locker", "Bunk Beds"], floor: 1,
  },
  {
    id: "r6", title: "Garden View Single", price: 11000, type: "Single", isBooked: false,
    description: "Single room with a beautiful garden view, AC, attached bathroom, and 24/7 security. Perfect for long-term stays.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop",
    ownerId: "u1", location: "Chennai", tenantId: undefined, amenities: ["AC", "WiFi", "Attached Bath", "Garden View"], floor: 2,
  },
];

export const SEED_COMPLAINTS: Complaint[] = [
  { id: "c1", userId: "u3", userName: "Sara Mehta", roomId: "r3", title: "AC not working", description: "The AC in my room has stopped working since yesterday. It's very hot and affecting my sleep and work.", status: "open", priority: "high", category: "Maintenance", createdAt: "2025-03-16T10:30:00Z" },
  { id: "c2", userId: "u2", userName: "Alex Johnson", roomId: "r1", title: "Water leakage in bathroom", description: "There is a constant water leakage from the ceiling of my bathroom. It's been 2 days and the floor is always wet.", status: "in-progress", priority: "high", category: "Plumbing", createdAt: "2025-03-15T14:00:00Z" },
  { id: "c3", userId: "u4", userName: "David Kumar", roomId: "r5", title: "WiFi connectivity issue", description: "WiFi is very slow in my room. Speeds drop to near zero after 9pm every day making it impossible to work.", status: "resolved", priority: "medium", category: "Electrical", createdAt: "2025-03-14T09:00:00Z" },
  { id: "c4", userId: "u5", userName: "Priya Sharma", roomId: "r2", title: "Pest control needed", description: "I've been noticing cockroaches in the common kitchen area. Please arrange for pest control at the earliest.", status: "open", priority: "medium", category: "Hygiene", createdAt: "2025-03-13T11:00:00Z" },
];

export const SEED_PAYMENTS: Payment[] = [
  { id: "p1", tenantId: "u2", tenantName: "Alex Johnson",  roomId: "r1", amount: 13000, method: "UPI",  status: "paid",    date: "2025-03-01" },
  { id: "p2", tenantId: "u3", tenantName: "Sara Mehta",    roomId: "r3", amount: 7000,  method: "Cash", status: "paid",    date: "2025-03-02" },
  { id: "p3", tenantId: "u4", tenantName: "David Kumar",   roomId: "r5", amount: 5500,  method: "Bank", status: "paid",    date: "2025-03-03" },
  { id: "p4", tenantId: "u5", tenantName: "Priya Sharma",  roomId: "r2", amount: 9500,  method: "—",    status: "due",     date: "2025-03-05" },
  { id: "p5", tenantId: "u2", tenantName: "Alex Johnson",  roomId: "r1", amount: 13000, method: "UPI",  status: "paid",    date: "2025-02-01" },
  { id: "p6", tenantId: "u3", tenantName: "Sara Mehta",    roomId: "r3", amount: 7000,  method: "Cash", status: "paid",    date: "2025-02-02" },
];

// Chat seed: tenant u2 ↔ owner u1
export const SEED_MESSAGES: Message[] = [
  { id: "m1", fromId: "u2", toId: "u1", text: "Hi! Is the Luxury AC Suite still available?",              timestamp: "2025-03-16T09:00:00Z", read: true },
  { id: "m2", fromId: "u1", toId: "u2", text: "Yes it is! Would you like to schedule a visit?",           timestamp: "2025-03-16T09:05:00Z", read: true },
  { id: "m3", fromId: "u2", toId: "u1", text: "Yes please. Also, is parking included in the rent?",       timestamp: "2025-03-16T09:10:00Z", read: true },
  { id: "m4", fromId: "u1", toId: "u2", text: "Parking is available at ₹500/month extra. Visit tomorrow?", timestamp: "2025-03-16T09:12:00Z", read: true },
  { id: "m5", fromId: "u3", toId: "u1", text: "My AC stopped working. Can you please arrange repair?",    timestamp: "2025-03-16T10:00:00Z", read: false },
  { id: "m6", fromId: "u1", toId: "u3", text: "I'll send the technician today by 5 PM. Apologies!",       timestamp: "2025-03-16T10:15:00Z", read: false },
  { id: "m7", fromId: "u4", toId: "u1", text: "When is our next rent due date?",                          timestamp: "2025-03-16T11:00:00Z", read: false },
];

