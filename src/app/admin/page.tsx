"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassButton } from "@/components/ui/GlassButton";
import { Reservation, ReservationStatus } from "@/types/database";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import {
    CheckCircle,
    XCircle,
    Calendar,
    Users,
    Clock,
    ChevronRight,
    Search,
    RefreshCw,
    LogOut,
    Check
} from "lucide-react";

export default function AdminPortal() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filter, setFilter] = useState<"all" | "today" | "upcoming">("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Check auth on mount
    useEffect(() => {
        const auth = localStorage.getItem("silo_admin_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
            fetchReservations();
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would be a server-side check
        // But for this project, we'll use a secret env var handled via API check
        // For the UI entry, we'll check against a common "Staff password"
        if (password === "SiloAdmin2026") {
            localStorage.setItem("silo_admin_auth", "true");
            localStorage.setItem("silo_admin_secret", password);
            setIsAuthenticated(true);
            fetchReservations();
        } else {
            setError("Invalid staff password");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("silo_admin_auth");
        localStorage.removeItem("silo_admin_secret");
        setIsAuthenticated(false);
    };

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const secret = localStorage.getItem("silo_admin_secret");
            const response = await fetch("/api/reservations", {
                headers: {
                    "x-admin-secret": secret || "",
                },
            });
            const data = await response.json();
            if (response.ok) {
                setReservations(data.reservations);
            } else {
                setError(data.error || "Failed to fetch reservations");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: ReservationStatus) => {
        try {
            const secret = localStorage.getItem("silo_admin_secret");
            const response = await fetch(`/api/reservations/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-secret": secret || "",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Update local state
                setReservations(prev =>
                    prev.map(res => res.id === id ? { ...res, status: newStatus } : res)
                );
            } else {
                const data = await response.json();
                alert(data.error || "Failed to update status");
            }
        } catch (err) {
            alert("Error updating status");
        }
    };

    const filteredReservations = reservations.filter(res => {
        const matchesSearch =
            res.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.confirmation_code.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        const date = parseISO(res.reservation_date);
        if (filter === "today") return isToday(date);
        if (filter === "upcoming") return date >= new Date();
        return true;
    });

    const stats = {
        total: reservations.length,
        today: reservations.filter(r => isToday(parseISO(r.reservation_date))).length,
        pending: reservations.filter(r => r.status === "pending").length,
        confirmed: reservations.filter(r => r.status === "confirmed").length,
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>The Silo. Staff Portal</h1>
                <div className={styles.loginContainer}>
                    <GlassCard className={styles.loginCard}>
                        <h2 className={styles.loginTitle}>Secure Log In</h2>
                        <form onSubmit={handleLogin}>
                            <GlassInput
                                label="Staff Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter access code"
                                required
                            />
                            {error && <p style={{ color: "red", fontSize: "0.8rem", marginTop: "1rem" }}>{error}</p>}
                            <GlassButton
                                type="submit"
                                variant="primary"
                                fullWidth
                                style={{ marginTop: "2rem" }}
                            >
                                Enter Dashboard
                            </GlassButton>
                        </form>
                    </GlassCard>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.dashboardHeader}>
                <div>
                    <h1 className={styles.title} style={{ textAlign: "left", fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                        Staff Dashboard
                    </h1>
                    <p style={{ color: "var(--white-muted)" }}>Welcome back. Manage your floor in real-time.</p>
                </div>
                <div className={styles.controls}>
                    <button onClick={fetchReservations} className={styles.actionBtn} title="Refresh Data">
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button onClick={handleLogout} className={styles.actionBtn} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <GlassCard className={styles.statCard}>
                    <span className={styles.statValue}>{stats.total}</span>
                    <span className={styles.statLabel}>Total Bookings</span>
                </GlassCard>
                <GlassCard className={styles.statCard}>
                    <span className={styles.statValue} style={{ color: "#4ade80" }}>{stats.today}</span>
                    <span className={styles.statLabel}>Today's Covers</span>
                </GlassCard>
                <GlassCard className={styles.statCard}>
                    <span className={styles.statValue} style={{ color: "#FFD700" }}>{stats.pending}</span>
                    <span className={styles.statLabel}>Pending Requests</span>
                </GlassCard>
                <GlassCard className={styles.statCard}>
                    <span className={styles.statValue} style={{ color: "#60a5fa" }}>{stats.confirmed}</span>
                    <span className={styles.statLabel}>Confirmed</span>
                </GlassCard>
            </div>

            <div className={styles.dashboardHeader} style={{ marginBottom: "1.5rem" }}>
                <div className={styles.filterGroup}>
                    <button
                        className={`${styles.filterBtn} ${filter === "all" ? styles.filterBtnActive : ""}`}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === "today" ? styles.filterBtnActive : ""}`}
                        onClick={() => setFilter("today")}
                    >
                        Today
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === "upcoming" ? styles.filterBtnActive : ""}`}
                        onClick={() => setFilter("upcoming")}
                    >
                        Upcoming
                    </button>
                </div>
                <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
                    <Search
                        size={18}
                        style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--white-muted)" }}
                    />
                    <input
                        type="text"
                        placeholder="Search guest or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.75rem 1rem 0.75rem 2.5rem",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            color: "white",
                            outline: "none"
                        }}
                    />
                </div>
            </div>

            <div className={styles.reservationsTableWrapper}>
                <table className={styles.reservationsTable}>
                    <thead>
                        <tr>
                            <th>Guest</th>
                            <th>Details</th>
                            <th>Code</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReservations.length > 0 ? (
                            filteredReservations.map((res) => (
                                <tr key={res.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{res.guest_name}</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--white-muted)" }}>{res.guest_email}</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--white-muted)" }}>{res.guest_phone}</div>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <Calendar size={14} color="var(--gold-light)" />
                                            {format(parseISO(res.reservation_date), "MMM dd, yyyy")}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                                            <Clock size={14} color="var(--gold-light)" />
                                            {res.reservation_time}
                                            <span style={{ color: "var(--white-muted)" }}>•</span>
                                            <Users size={14} color="var(--gold-light)" />
                                            {res.party_size} guests
                                        </div>
                                    </td>
                                    <td>
                                        <code style={{ background: "rgba(212,175,55,0.1)", padding: "0.2rem 0.4rem", borderRadius: "4px", color: "var(--gold-light)" }}>
                                            {res.confirmation_code}
                                        </code>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[`status-${res.status}`]}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actionsCell}>
                                            {res.status === "pending" && (
                                                <button
                                                    onClick={() => updateStatus(res.id, "confirmed")}
                                                    className={`${styles.actionBtn} ${styles.confirmBtn}`}
                                                    title="Confirm"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            {["pending", "confirmed"].includes(res.status) && (
                                                <button
                                                    onClick={() => updateStatus(res.id, "completed")}
                                                    className={`${styles.actionBtn} ${styles.completeBtn}`}
                                                    title="Mark Completed"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            {res.status !== "cancelled" && (
                                                <button
                                                    onClick={() => updateStatus(res.id, "cancelled")}
                                                    className={`${styles.actionBtn} ${styles.cancelBtn}`}
                                                    title="Cancel"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: "center", padding: "4rem", color: "var(--white-muted)" }}>
                                    No reservations found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
