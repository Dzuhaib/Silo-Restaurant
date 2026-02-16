"use client";

import { useState, useCallback, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import styles from "./page.module.css";
import { format, parseISO } from "date-fns";
import { Reservation } from "@/types/database";

export default function DashboardPage() {
    const [email, setEmail] = useState("");
    const [lookupCode, setLookupCode] = useState("");
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLookedUp, setHasLookedUp] = useState(false);

    const fetchReservations = useCallback(async (searchEmail?: string, searchCode?: string) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchEmail) params.append("email", searchEmail);
            if (searchCode) params.append("code", searchCode);

            const response = await fetch(`/api/reservations?${params.toString()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch reservations");
            }

            setReservations(data.reservations || []);
            setHasLookedUp(true);
        } catch (err) {
            console.error("Dashboard error:", err);
            setError(err instanceof Error ? err.message : "Failed to load reservations");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLookup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email && !lookupCode) {
            setError("Please enter your email or confirmation code");
            return;
        }
        fetchReservations(email, lookupCode);
    };

    const handleCancel = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this reservation?")) return;

        try {
            const response = await fetch(`/api/reservations/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to cancel reservation");
            }

            // Refresh the list
            fetchReservations(email, lookupCode);
            alert("Reservation cancelled successfully");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to cancel reservation");
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "confirmed": return styles.status_confirmed;
            case "cancelled": return styles.status_cancelled;
            default: return styles.status_pending;
        }
    };

    return (
        <main className={styles.dashboard}>
            <header className={styles.dashboardHeader}>
                <h1 className={styles.title}>My Reservations</h1>
                <p className={styles.subtitle}>
                    View and manage your upcoming bookings. Enter your details below to retrieve your reservation status.
                </p>
            </header>

            <section className={styles.lookupSection}>
                <GlassCard>
                    <form onSubmit={handleLookup} className={styles.lookupForm}>
                        <GlassInput
                            label="Email Address"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className={styles.orDivider}>OR</div>
                        <GlassInput
                            label="Confirmation Code"
                            placeholder="SILO-XXXX-XXXX"
                            value={lookupCode}
                            onChange={(e) => setLookupCode(e.target.value)}
                        />
                        <div className={styles.lookupBtnWrapper}>
                            <GlassButton variant="primary" type="submit" disabled={loading}>
                                {loading ? "Searching..." : "Look Up"}
                            </GlassButton>
                        </div>
                    </form>
                    {error && (
                        <div style={{ color: "#EF4444", marginTop: "16px", fontSize: "0.85rem", textAlign: "center", padding: "12px", background: "rgba(239,68,68,0.05)", borderRadius: "4px" }}>
                            {error}
                        </div>
                    )}
                </GlassCard>
            </section>

            {hasLookedUp && (
                <section className={styles.resultsSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Your Bookings</h2>
                        <div className={styles.sectionLine} />
                    </div>

                    {reservations.length === 0 ? (
                        <div className={styles.emptyState}>
                            <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <p>No reservations matching these details were found.</p>
                        </div>
                    ) : (
                        <div className={styles.reservationsGrid}>
                            {reservations.map((res) => (
                                <GlassCard key={res.id}>
                                    <div className={styles.card}>
                                        <div className={styles.cardTop}>
                                            <div className={styles.confCodeWrapper}>
                                                <span className={styles.confLabel}>Booking Ref</span>
                                                <span className={styles.confCode}>{res.confirmation_code}</span>
                                            </div>
                                            <div className={`${styles.status} ${getStatusClass(res.status)}`}>
                                                {res.status}
                                            </div>
                                        </div>

                                        <div className={styles.mainInfo}>
                                            <div className={styles.infoBlock}>
                                                <span className={styles.infoLabel}>Date & Time</span>
                                                <div className={styles.infoValue}>
                                                    <svg className={styles.infoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {format(parseISO(res.reservation_date), "MMM d, yyyy")} @ {res.reservation_time}
                                                </div>
                                            </div>
                                            <div className={styles.infoBlock}>
                                                <span className={styles.infoLabel}>Party Size</span>
                                                <div className={styles.infoValue}>
                                                    <svg className={styles.infoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 014.99-3.857M4.992 8.003a5.002 5.002 0 0114.015 0M11 15v2m0-2h4v2m-4 0h4" />
                                                    </svg>
                                                    {res.party_size} {res.party_size === 1 ? "Person" : "People"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.guestSection}>
                                            <div className={styles.guestPrimary}>
                                                <span className={styles.guestName}>{res.guest_name}</span>
                                                <span className={styles.guestPhone}>{res.guest_phone}</span>
                                            </div>

                                            {res.status !== "cancelled" && (
                                                <GlassButton
                                                    className={styles.cancelBtn}
                                                    onClick={() => handleCancel(res.id)}
                                                >
                                                    Cancel Booking
                                                </GlassButton>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}
