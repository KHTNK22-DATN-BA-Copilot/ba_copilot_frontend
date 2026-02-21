"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "zoom" | "none";

interface ScrollRevealProps {
    children: ReactNode;
    direction?: RevealDirection;
    delay?: number;
    duration?: number;
    className?: string;
    once?: boolean;
    threshold?: number;
}

const directionMap: Record<RevealDirection, string> = {
    up: "translate-y-12",
    down: "-translate-y-12",
    left: "translate-x-12",
    right: "-translate-x-12",
    zoom: "scale-90",
    none: "",
};

export default function ScrollReveal({
    children,
    direction = "up",
    delay = 0,
    duration = 700,
    className = "",
    once = true,
    threshold = 0.15,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.transitionDelay = `${delay}ms`;
                    el.classList.add("scroll-revealed");
                    el.classList.remove("scroll-hidden");
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    el.classList.remove("scroll-revealed");
                    el.classList.add("scroll-hidden");
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay, once, threshold]);

    return (
        <div
            ref={ref}
            className={`scroll-hidden ${directionMap[direction]} ${className}`}
            style={{
                transitionProperty: "opacity, transform",
                transitionDuration: `${duration}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
        >
            {children}
        </div>
    );
}
