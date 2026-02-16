'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, MotionValue, SpringOptions } from 'motion/react';
import { Children, cloneElement, useEffect, useMemo, useRef, useState, ReactElement, ReactNode } from 'react';

import GlassSurface from './GlassSurface';
import './Dock.css';

interface DockItemProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    mouseX: MotionValue<number>;
    spring: SpringOptions;
    distance: number;
    magnification: number;
    baseItemSize: number;
}

function DockItem({
    children,
    className = '',
    onClick,
    mouseX,
    spring,
    distance,
    magnification,
    baseItemSize
}: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseX, val => {
        const rect = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            width: baseItemSize
        };
        return val - rect.x - baseItemSize / 2;
    });

    const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
    const size = useSpring(targetSize, spring);

    return (
        <motion.div
            ref={ref}
            style={{
                width: size,
                height: size
            }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={`dock-item ${className}`}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
        >
            {Children.map(children, child => {
                if (typeof child === 'object' && child !== null && 'type' in child) {
                    return cloneElement(child as ReactElement<any>, { isHovered });
                }
                return child;
            })}
        </motion.div>
    );
}

interface DockLabelProps {
    children: ReactNode;
    className?: string;
    isHovered?: MotionValue<number>;
}

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isHovered) return;
        const unsubscribe = isHovered.on('change', latest => {
            setIsVisible(latest === 1);
        });
        return () => unsubscribe();
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -10 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`dock-label ${className}`}
                    role="tooltip"
                    style={{ x: '-50%' }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DockIcon({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`dock-icon ${className}`}>{children}</div>;
}

interface DockProps {
    items: {
        icon: ReactNode;
        label: string;
        onClick?: () => void;
        className?: string;
    }[];
    className?: string;
    spring?: SpringOptions;
    magnification?: number;
    distance?: number;
    panelHeight?: number;
    dockHeight?: number;
    baseItemSize?: number;
}


export default function Dock({
    items,
    className = '',
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 28,
    distance = 200,
    panelHeight = 34,
    dockHeight = 100,
    baseItemSize = 22
}: DockProps) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);

    const maxHeight = useMemo(
        () => Math.max(dockHeight, magnification + magnification / 2 + 4),
        [magnification, dockHeight]
    );
    const heightRow = useTransform(isHovered, [0, 1], [panelHeight, panelHeight + 2]); // Ultra-subtle growth
    const height = useSpring(heightRow, spring);

    return (
        <motion.div style={{ height: maxHeight, scrollbarWidth: 'none' }} className="dock-outer">
            <GlassSurface
                borderRadius={17}
                borderWidth={0}
                blur={20}
                opacity={0.9}
                backgroundOpacity={0.12}
                distortionScale={-150}
                className={`dock-panel ${className}`}
                style={{ height: height }}
            >
                <motion.div
                    onMouseMove={({ pageX }) => {
                        isHovered.set(1);
                        mouseX.set(pageX);
                    }}
                    onMouseLeave={() => {
                        isHovered.set(0);
                        mouseX.set(Infinity);
                    }}
                    className="dock-panel__content"
                    role="toolbar"
                    aria-label="Application dock"
                >
                    {items.map((item, index) => (
                        <DockItem
                            key={index}
                            onClick={item.onClick}
                            className={item.className}
                            mouseX={mouseX}
                            spring={spring}
                            distance={distance}
                            magnification={magnification}
                            baseItemSize={baseItemSize}
                        >
                            <DockIcon>{item.icon}</DockIcon>
                            <DockLabel>{item.label}</DockLabel>
                        </DockItem>
                    ))}
                </motion.div>
            </GlassSurface>
        </motion.div>
    );
}
