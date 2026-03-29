"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  User, Room, Complaint, Payment, Message,
  SEED_USERS, SEED_ROOMS, SEED_COMPLAINTS, SEED_PAYMENTS, SEED_MESSAGES,
} from "./data";

// ─── Settings ────────────────────────────────────────────
export type Theme    = "dark" | "light";
export type Currency = "INR" | "USD";
export type Lang     = "English" | "Hindi";

interface Settings {
  theme:    Theme;
  currency: Currency;
  lang:     Lang;
}

// ─── Store shape ──────────────────────────────────────────
interface StoreCtx {
  // Auth
  currentUser: User | null;
  authError:   string;
  login:           (email: string, password: string) => boolean;
  signup:          (name: string, email: string, password: string, role: User["role"]) => boolean;
  logout:          () => void;
  changePassword:  (oldPw: string, newPw: string) => string | null; // null = success, string = error
  // Users
  users: User[];
  // Rooms
  rooms: Room[];
  addRoom:     (room: Omit<Room, "id">) => void;
  deleteRoom:  (id: string) => void;
  bookRoom:    (roomId: string) => string | null;  // null = success, string = error
  // Complaints
  complaints: Complaint[];
  addComplaint:          (c: Omit<Complaint, "id" | "createdAt">) => void;
  updateComplaintStatus: (id: string, status: Complaint["status"]) => void;
  // Payments
  payments: Payment[];
  // Messages / Chat
  messages: Message[];
  sendMessage: (toId: string, text: string) => void;
  markRead:    (fromId: string) => void;
  // Settings
  settings:   Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  // Helpers
  formatPrice:  (amount: number) => string;
}

const Store = createContext<StoreCtx | null>(null);

function nextId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

const DEFAULT_SETTINGS: Settings = { theme: "dark", currency: "INR", lang: "English" };

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError,   setAuthError]   = useState("");
  const [users,       setUsers]       = useState<User[]>(SEED_USERS);
  const [rooms,       setRooms]       = useState<Room[]>(SEED_ROOMS);
  const [complaints,  setComplaints]  = useState<Complaint[]>(SEED_COMPLAINTS);
  const [payments,    setPayments]    = useState<Payment[]>(SEED_PAYMENTS);
  const [messages,    setMessages]    = useState<Message[]>(SEED_MESSAGES);
  const [settings,    setSettings]    = useState<Settings>(DEFAULT_SETTINGS);

  // ── Rehydrate from localStorage ───────────────────────
  useEffect(() => {
    try {
      const u  = localStorage.getItem("se_user");      if (u)  setCurrentUser(JSON.parse(u));
      const s  = localStorage.getItem("se_settings");  if (s)  setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });
      const r  = localStorage.getItem("se_rooms");     if (r)  setRooms(JSON.parse(r));
      const us = localStorage.getItem("se_users");     if (us) setUsers(JSON.parse(us));
      const c  = localStorage.getItem("se_complaints");if (c)  setComplaints(JSON.parse(c));
      const m  = localStorage.getItem("se_messages");  if (m)  setMessages(JSON.parse(m));
    } catch {}
  }, []);

  // ── Apply theme to <html> ─────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", settings.theme);
    if (settings.theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, [settings.theme]);

  const persist = (key: string, val: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  };

  // ── Auth ──────────────────────────────────────────────
  const login = useCallback((email: string, password: string): boolean => {
    // Always read latest users from state
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) { setAuthError("Invalid email or password."); return false; }
    setCurrentUser(found);
    persist("se_user", found);
    setAuthError("");
    return true;
  }, [users]);

  const signup = useCallback((name: string, email: string, password: string, role: User["role"]): boolean => {
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setAuthError("This email is already registered."); return false;
    }
    const newUser: User = { id: nextId(), name, email, password, role };
    const updated = [...users, newUser];
    setUsers(updated);
    persist("se_users", updated);
    setCurrentUser(newUser);
    persist("se_user", newUser);
    setAuthError("");
    return true;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("se_user");
  }, []);

  const changePassword = useCallback((oldPw: string, newPw: string): string | null => {
    if (!currentUser) return "Not authenticated.";
    if (currentUser.password !== oldPw) return "Current password is incorrect.";
    if (newPw.length < 6) return "New password must be at least 6 characters.";
    if (!/[a-zA-Z]/.test(newPw) || !/[0-9]/.test(newPw)) return "Password must contain both letters and numbers.";
    const updated = users.map(u => u.id === currentUser.id ? { ...u, password: newPw } : u);
    setUsers(updated);
    persist("se_users", updated);
    const updatedUser = { ...currentUser, password: newPw };
    setCurrentUser(updatedUser);
    persist("se_user", updatedUser);
    return null;
  }, [currentUser, users]);

  // ── Rooms ─────────────────────────────────────────────
  const addRoom = useCallback((room: Omit<Room, "id">) => {
    const newRoom = { ...room, id: nextId() };
    const updated = [...rooms, newRoom];
    setRooms(updated);
    persist("se_rooms", updated);
  }, [rooms]);

  const deleteRoom = useCallback((id: string) => {
    const updated = rooms.filter(r => r.id !== id);
    setRooms(updated);
    persist("se_rooms", updated);
  }, [rooms]);

  const bookRoom = useCallback((roomId: string): string | null => {
    if (!currentUser) return "Please log in to book a room.";
    const room = rooms.find(r => r.id === roomId);
    if (!room) return "Room not found.";
    if (room.isBooked) return "This room is already booked.";
    // Set room as booked
    const updatedRooms = rooms.map(r =>
      r.id === roomId ? { ...r, isBooked: true, tenantId: currentUser.id } : r
    );
    setRooms(updatedRooms);
    persist("se_rooms", updatedRooms);
    // Update user's roomId
    const updatedUsers = users.map(u =>
      u.id === currentUser.id ? { ...u, roomId } : u
    );
    setUsers(updatedUsers);
    const updated = { ...currentUser, roomId };
    setCurrentUser(updated);
    persist("se_user", updated);
    persist("se_users", updatedUsers);
    return null;
  }, [currentUser, rooms, users]);

  // ── Complaints ────────────────────────────────────────
  const addComplaint = useCallback((c: Omit<Complaint, "id" | "createdAt">) => {
    const nc: Complaint = { ...c, id: nextId(), createdAt: new Date().toISOString() };
    const updated = [nc, ...complaints];
    setComplaints(updated);
    persist("se_complaints", updated);
  }, [complaints]);

  const updateComplaintStatus = useCallback((id: string, status: Complaint["status"]) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status } : c);
    setComplaints(updated);
    persist("se_complaints", updated);
  }, [complaints]);

  // ── Messages / Chat ───────────────────────────────────
  const sendMessage = useCallback((toId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const msg: Message = {
      id: nextId(), fromId: currentUser.id, toId,
      text: text.trim(), timestamp: new Date().toISOString(), read: false,
    };
    const updated = [...messages, msg];
    setMessages(updated);
    persist("se_messages", updated);
  }, [currentUser, messages]);

  const markRead = useCallback((fromId: string) => {
    const updated = messages.map(m =>
      m.fromId === fromId && !m.read ? { ...m, read: true } : m
    );
    setMessages(updated);
    persist("se_messages", updated);
  }, [messages]);

  // ── Settings ──────────────────────────────────────────
  const setSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      persist("se_settings", next);
      return next;
    });
  }, []);

  const formatPrice = useCallback((amount: number): string => {
    if (settings.currency === "USD") return `$${(amount / 83).toFixed(0)}`;
    return `₹${amount.toLocaleString("en-IN")}`;
  }, [settings.currency]);

  return (
    <Store.Provider value={{
      currentUser, authError, login, signup, logout, changePassword,
      users,
      rooms, addRoom, deleteRoom, bookRoom,
      complaints, addComplaint, updateComplaintStatus,
      payments,
      messages, sendMessage, markRead,
      settings, setSetting, formatPrice,
    }}>
      {children}
    </Store.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Store);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useGreeting(name: string) {
  const h = new Date().getHours();
  const time = h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
  const first = name.split(" ")[0];
  return `Good ${time}, ${first} 👋`;
}
