import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function AboutPage() {
    return (
        <main className={styles.about}>
            {/* Page Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>About The Silo</h1>
                <p className={styles.subtitle}>Fine dining in Clifton, Karachi</p>
            </div>

            {/* Story Section */}
            <div className={styles.story}>
                <GlassCard>
                    <div className={styles.storyGrid}>
                        <div className={styles.storyImage}>
                            <Image
                                src="/silo images/gallery section/img1.jpeg"
                                alt="The Silo outdoor dining"
                                fill
                                sizes="(max-width: 968px) 100vw, 50vw"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                        <div className={styles.storyText}>
                            <h2>Our Story</h2>
                            <p>
                                The Silo is a fine dining restaurant in Clifton, Karachi, serving exceptional
                                Continental and Japanese cuisine in an atmosphere of refined elegance.
                            </p>
                            <p>
                                Experience our exclusive rooftop Sky Domes—private dining rooms with air conditioning,
                                curated music, and stunning views of Karachi. Perfect for intimate celebrations,
                                business dinners, or special occasions.
                            </p>
                            <p>
                                We offer both outdoor seating and private dining options, ensuring every visit
                                is memorable. From our carefully crafted menu to our attentive service, The Silo
                                delivers an unparalleled dining experience.
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Info Cards Grid */}
            <div className={styles.infoGrid}>
                {/* Working Hours Card */}
                <GlassCard>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3>Working Hours</h3>
                        </div>
                        <div className={styles.hoursList}>
                            <div className={styles.hoursRow}>
                                <span className={styles.day}>Monday - Thursday</span>
                                <span className={styles.time}>12:00 PM - 12:00 AM</span>
                            </div>
                            <div className={styles.hoursRow}>
                                <span className={styles.day}>Friday & Saturday</span>
                                <span className={styles.time}>8:00 AM - 1:00 AM</span>
                            </div>
                            <div className={styles.hoursRow}>
                                <span className={styles.day}>Sunday</span>
                                <span className={styles.time}>8:00 AM - 12:00 AM</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Social Media Card */}
                <GlassCard>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <h3>Connect With Us</h3>
                        </div>
                        <div className={styles.socialLinks}>
                            <a href="https://www.facebook.com/TheSilo.pk" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <svg className={styles.socialIcon} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span>Facebook</span>
                            </a>
                            <a href="https://www.instagram.com/thesilo.pk/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <svg className={styles.socialIcon} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                <span>Instagram</span>
                            </a>
                            <a href="https://www.google.com/maps/place/The+Silo+Restaurant/@24.8044086,67.0305121,17z" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <svg className={styles.socialIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Google Maps</span>
                            </a>
                        </div>
                    </div>
                </GlassCard>

                {/* Location Card */}
                <GlassCard>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h3>Visit Us</h3>
                        </div>
                        <div className={styles.location}>
                            <p>
                                Block 4 E St, Block 4 Clifton<br />
                                Karachi, 75500<br />
                                Pakistan
                            </p>
                            <a href="https://www.google.com/maps/place/The+Silo+Restaurant/@24.8044086,67.0305121,17z" target="_blank" rel="noopener noreferrer">
                                <GlassButton variant="primary">Get Directions</GlassButton>
                            </a>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* CTA */}
            <div className={styles.cta}>
                <Link href="/reserve">
                    <GlassButton variant="accent" size="lg">Reserve Your Table</GlassButton>
                </Link>
            </div>
        </main>
    );
}
