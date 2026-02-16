"use client";

import { useState, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import styles from "./page.module.css";
import { addDays, format, isToday, isTomorrow } from "date-fns";

type Step = "datetime" | "details" | "confirm" | "success";

export default function ReservePage() {
    const [currentStep, setCurrentStep] = useState<Step>("datetime");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [partySize, setPartySize] = useState<number>(2);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        requests: "",
        dietary: "",
    });
    const [confirmationCode, setConfirmationCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    guest_name: formData.name,
                    guest_email: formData.email,
                    guest_phone: formData.phone,
                    party_size: partySize,
                    reservation_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
                    reservation_time: selectedTime,
                    dietary_notes: formData.dietary,
                    special_requests: formData.requests,
                }),
            });

            let data;
            const text = await response.text();

            try {
                data = JSON.parse(text);
            } catch (parseErr) {
                console.error('Response was not valid JSON:', text);
                throw new Error('Server returned an invalid response. Please check logs.');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create reservation');
            }

            // Set confirmation code from server response
            setConfirmationCode(data.confirmationCode);
            setCurrentStep("success");
        } catch (err) {
            console.error('Reservation error details:', err);
            setError(err instanceof Error ? err.message : 'Failed to create reservation. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, partySize, selectedDate, selectedTime]);

    // Generate next 14 days (excluding Sun/Mon when closed)
    const getAvailableDates = useCallback(() => {
        const dates: Date[] = [];
        let currentDate = new Date();

        while (dates.length < 10) {
            const day = currentDate.getDay();
            // Exclude Sunday (0) and Monday (1)
            if (day !== 0 && day !== 1) {
                dates.push(new Date(currentDate));
            }
            currentDate = addDays(currentDate, 1);
        }
        return dates;
    }, []);

    // Time slots based on day
    const getTimeSlots = useCallback((date: Date | null) => {
        if (!date) return [];

        const day = date.getDay();
        const slots: string[] = [];

        // Saturday has lunch + dinner
        if (day === 6) {
            slots.push("12:00", "12:30", "13:00", "13:30", "14:00");
        }

        // All open days have dinner service
        slots.push("18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00");

        return slots;
    }, []);

    const formatDateLabel = useCallback((date: Date) => {
        if (isToday(date)) return "Today";
        if (isTomorrow(date)) return "Tomorrow";
        return format(date, "EEE");
    }, []);


    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, name: e.target.value }));
    }, []);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, email: e.target.value }));
    }, []);

    const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, phone: e.target.value }));
    }, []);

    const handleDietaryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, dietary: e.target.value }));
    }, []);

    const handleRequestsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, requests: e.target.value }));
    }, []);

    return (
        <main className={styles.reserve}>
            <div className={styles.reserve__header}>
                <h1 className={styles.reserve__title}>Reserve a Table</h1>
                <p className={styles.reserve__subtitle}>
                    Join us for an unforgettable dining experience at The Silo
                </p>
            </div>

            {/* Step Indicator */}
            {currentStep !== "success" && (
                <div className={styles.steps}>
                    <div className={`${styles.step} ${currentStep === "datetime" ? styles["step--active"] : ""} ${["details", "confirm"].includes(currentStep) ? styles["step--completed"] : ""}`}>
                        <div className={styles.step__number}>1</div>
                        <span>Date & Time</span>
                    </div>
                    <span className={styles.step__arrow}>→</span>
                    <div className={`${styles.step} ${currentStep === "details" ? styles["step--active"] : ""} ${currentStep === "confirm" ? styles["step--completed"] : ""}`}>
                        <div className={styles.step__number}>2</div>
                        <span>Details</span>
                    </div>
                    <span className={styles.step__arrow}>→</span>
                    <div className={`${styles.step} ${currentStep === "confirm" ? styles["step--active"] : ""}`}>
                        <div className={styles.step__number}>3</div>
                        <span>Confirm</span>
                    </div>
                </div>
            )}

            {/* Form Steps */}
            <div className={styles.form__container}>
                {currentStep === "datetime" && (
                    <div className="glass-card">
                        <div className="glass-card__content">
                            <div className={styles.form__section}>
                                <h2 className={styles.section__title}>Select Party Size</h2>
                                <div className={styles.party__grid}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                                        <button
                                            key={size}
                                            className={`${styles.party__button} ${partySize === size ? styles["party__button--active"] : ""
                                                }`}
                                            onClick={() => setPartySize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.form__section}>
                                <h2 className={styles.section__title}>Choose Date</h2>
                                <div className={styles.date__grid}>
                                    {getAvailableDates().map((date, idx) => (
                                        <button
                                            key={idx}
                                            className={`${styles.date__button} ${selectedDate && date.toDateString() === selectedDate.toDateString()
                                                ? styles["date__button--active"]
                                                : ""
                                                }`}
                                            onClick={() => setSelectedDate(date)}
                                        >
                                            <span className={styles.date__day}>{formatDateLabel(date)}</span>
                                            <span className={styles.date__number}>{format(date, "d")}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedDate && (
                                <div className={styles.form__section}>
                                    <h2 className={styles.section__title}>Choose Time</h2>
                                    <div className={styles.time__grid}>
                                        {getTimeSlots(selectedDate).map((time) => (
                                            <button
                                                key={time}
                                                className={`${styles.time__button} ${selectedTime === time ? styles["time__button--active"] : ""
                                                    }`}
                                                onClick={() => setSelectedTime(time)}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.form__actions}>
                                <div></div>
                                <GlassButton
                                    variant="primary"
                                    disabled={!selectedDate || !selectedTime}
                                    onClick={() => setCurrentStep("details")}
                                >
                                    Continue
                                </GlassButton>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === "details" && (
                    <div className="glass-card">
                        <div className="glass-card__content">
                            <div className={styles.form__section}>
                                <h2 className={styles.section__title}>Your Information</h2>
                                <div className={styles.form__grid}>
                                    <GlassInput
                                        label="Full Name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                    />
                                    <GlassInput
                                        label="Email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleEmailChange}
                                    />
                                </div>
                                <GlassInput
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="+92 300 1234567"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                />
                            </div>

                            <div className={styles.form__section}>
                                <h2 className={styles.section__title}>Additional Information</h2>
                                <GlassInput
                                    label="Dietary Requirements"
                                    placeholder="e.g., vegetarian, vegan, gluten-free"
                                    value={formData.dietary}
                                    onChange={handleDietaryChange}
                                />
                                <div style={{ marginTop: "20px" }}>
                                    <GlassInput
                                        label="Special Requests"
                                        placeholder="Occasion, seating preference, Sky Dome, etc."
                                        value={formData.requests}
                                        onChange={handleRequestsChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.form__actions}>
                                <GlassButton onClick={() => setCurrentStep("datetime")}>
                                    Back
                                </GlassButton>
                                <GlassButton
                                    variant="primary"
                                    disabled={!formData.name || !formData.email || !formData.phone}
                                    onClick={() => setCurrentStep("confirm")}
                                >
                                    Continue
                                </GlassButton>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === "confirm" && (
                    <div className="glass-card">
                        <div className="glass-card__content">
                            {error && (
                                <div style={{
                                    padding: '16px',
                                    marginBottom: '24px',
                                    background: 'rgba(220, 38, 38, 0.1)',
                                    border: '1px solid rgba(220, 38, 38, 0.3)',
                                    borderRadius: 'var(--radius-md)',
                                    color: '#fca5a5'
                                }}>
                                    {error}
                                </div>
                            )}
                            <div className={styles.form__section}>
                                <h2 className={styles.section__title}>Confirm Reservation</h2>
                                <div className={styles.summary}>
                                    <div className={styles.summary__item}>
                                        <span className={styles.summary__label}>Date</span>
                                        <span className={styles.summary__value}>
                                            {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                                        </span>
                                    </div>
                                    <div className={styles.summary__item}>
                                        <span className={styles.summary__label}>Time</span>
                                        <span className={styles.summary__value}>{selectedTime}</span>
                                    </div>
                                    <div className={styles.summary__item}>
                                        <span className={styles.summary__label}>Party Size</span>
                                        <span className={styles.summary__value}>
                                            {partySize} {partySize === 1 ? "guest" : "guests"}
                                        </span>
                                    </div>
                                    <div className={styles.summary__item}>
                                        <span className={styles.summary__label}>Name</span>
                                        <span className={styles.summary__value}>{formData.name}</span>
                                    </div>
                                    <div className={styles.summary__item}>
                                        <span className={styles.summary__label}>Email</span>
                                        <span className={styles.summary__value}>{formData.email}</span>
                                    </div>
                                    <div className={styles.summary__item}>
                                        <span className={styles.summary__label}>Phone</span>
                                        <span className={styles.summary__value}>{formData.phone}</span>
                                    </div>
                                    {formData.dietary && (
                                        <div className={styles.summary__item}>
                                            <span className={styles.summary__label}>Dietary</span>
                                            <span className={styles.summary__value}>{formData.dietary}</span>
                                        </div>
                                    )}
                                    {formData.requests && (
                                        <div className={styles.summary__item}>
                                            <span className={styles.summary__label}>Requests</span>
                                            <span className={styles.summary__value}>{formData.requests}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.form__actions}>
                                <GlassButton onClick={() => setCurrentStep("details")}>
                                    Back
                                </GlassButton>
                                <GlassButton
                                    variant="accent"
                                    disabled={isSubmitting}
                                    onClick={handleSubmit}
                                >
                                    {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                                </GlassButton>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === "success" && (
                    <div className="glass-card">
                        <div className="glass-card__content">
                            <div className={styles.success}>
                                <div className={styles.success__icon}>✓</div>
                                <h2 className={styles.success__title}>Reservation Confirmed!</h2>
                                <p className={styles.success__message}>
                                    We&apos;ve sent a confirmation email to {formData.email}
                                </p>
                                <div className={styles.success__code}>{confirmationCode}</div>
                                <p className={styles.success__message}>
                                    Your table for {partySize} is reserved on{" "}
                                    {selectedDate && format(selectedDate, "MMMM d")} at {selectedTime}
                                </p>
                                <div style={{ marginTop: "40px" }}>
                                    <GlassButton variant="primary" onClick={() => (window.location.href = "/")}>
                                        Return Home
                                    </GlassButton>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
