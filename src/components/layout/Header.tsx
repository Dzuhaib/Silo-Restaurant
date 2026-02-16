"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlassButton } from "../ui/GlassButton";
import styles from "./Header.module.css";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <header className={styles.header}>
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
        </header>
    );
}
