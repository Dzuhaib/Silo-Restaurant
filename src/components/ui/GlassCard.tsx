"use client";

import { motion, HTMLMotionProps } from "motion/react";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "animate"> {
    children: React.ReactNode;
    disableAnimation?: boolean;
}

export function GlassCard({
    children,
    className = "",
    disableAnimation = false,
    ...props
}: GlassCardProps) {
    if (disableAnimation) {
        return (
            <div className={`glass-card ${className}`.trim()} {...(props as any)}>
                <div className="glass-card__content">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className={`glass-card ${className}`.trim()}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            {...props}
        >
            <div className="glass-card__content">
                {children}
            </div>
        </motion.div>
    );
}
