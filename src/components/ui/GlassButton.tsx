"use client";

import { motion, HTMLMotionProps } from "motion/react";

interface GlassButtonProps extends HTMLMotionProps<"button"> {
    variant?: "default" | "primary" | "accent";
    size?: "default" | "lg";
    fullWidth?: boolean;
}

export function GlassButton({
    children,
    variant = "default",
    size = "default",
    fullWidth = false,
    className = "",
    ...props
}: GlassButtonProps) {
    const variantClass = variant !== "default" ? `glass-btn--${variant}` : "";
    const sizeClass = size !== "default" ? `glass-btn--${size}` : "";
    const fullWidthClass = fullWidth ? "w-full" : "";

    return (
        <motion.button
            className={`glass-btn ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`.trim()}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            {...props}
        >
            {children}
        </motion.button>
    );
}
