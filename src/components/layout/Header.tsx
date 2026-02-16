"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlassButton } from "../ui/GlassButton";
import GlassSurface from "../ui/GlassSurface";
import styles from "./Header.module.css";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <header className={styles.header}>
            <GlassSurface
                borderRadius={0}
                borderWidth={0}
                blur={20}
                opacity={0.9}
                backgroundOpacity={0.12}
                distortionScale={-150}
                className={styles.header__glass}
            >
                <div className={styles.header__container}>
                    <Link href="/" className={styles.header__logo}>
                        Silo<span>.</span>
                    </Link>

                    <button
                        className={styles.header__hamburger}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={styles.header__hamburger__line} />
                        <span className={styles.header__hamburger__line} />
                        <span className={styles.header__hamburger__line} />
                    </button>

                    <nav
                        className={`${styles.header__nav} ${isMenuOpen ? styles["header__nav--open"] : ""
                            }`}
                    >
                        <Link
                            href="/"
                            className={`${styles.header__link} ${isActive("/") ? styles["header__link--active"] : ""
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            className={`${styles.header__link} ${isActive("/about") ? styles["header__link--active"] : ""
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/dashboard"
                            className={`${styles.header__link} ${isActive("/dashboard") ? styles["header__link--active"] : ""
                                }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            My Reservations
                        </Link>
                        <Link href="/reserve" onClick={() => setIsMenuOpen(false)}>
                            <GlassButton variant="accent">Reserve</GlassButton>
                        </Link>
                    </nav>
                </div>
            </GlassSurface>
        </header>
    );
}
