"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════════════════
   FADE UP – reveals element by fading in + sliding up
   Uses GSAP ScrollTrigger (GPU-optimized transforms)
═══════════════════════════════════════════════════════════ */
export function FadeUp({
  children,
  delay = 0,
  duration = 0.7,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 40 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power2.out",
        });
      },
      once: true,
    });

    return () => trigger.kill();
  }, [delay, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDE IN – from left or right
═══════════════════════════════════════════════════════════ */
export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  direction?: "left" | "right";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = direction === "left" ? -80 : 80;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, x });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay,
          ease: "power2.out",
        });
      },
      once: true,
    });

    return () => trigger.kill();
  }, [delay, x]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCALE UP – zoom in on scroll
═══════════════════════════════════════════════════════════ */
export function ScaleUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, scale: 0.85 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay,
          ease: "power2.out",
        });
      },
      once: true,
    });

    return () => trigger.kill();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAGGER CONTAINER + ITEM
   Parent uses ScrollTrigger, children stagger in
═══════════════════════════════════════════════════════════ */
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll("[data-gsap-item]");
    if (!items.length) return;

    gsap.set(items, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: staggerDelay,
          ease: "power2.out",
        });
      },
      once: true,
    });

    return () => trigger.kill();
  }, [staggerDelay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-gsap-item className={className}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTER – counts up when scrolled into view
═══════════════════════════════════════════════════════════ */
export function AnimatedCounter({
  target,
  suffix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const countRef = useRef({ value: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: () => {
        gsap.to(countRef.current, {
          value: target,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            if (el) {
              el.textContent =
                Math.round(countRef.current.value).toLocaleString() + suffix;
            }
          },
        });
      },
      once: true,
    });

    return () => trigger.kill();
  }, [target, suffix, duration]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════
   FLOAT – continuous floating (pure CSS, zero JS per frame)
═══════════════════════════════════════════════════════════ */
export function Float({
  children,
  className = "",
  y = 12,
  duration = 3,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
}) {
  return (
    <div
      className={className}
      style={{
        animation: `gsapFloat ${duration}s ease-in-out infinite`,
        ["--float-y" as string]: `${y}px`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHIMMER TEXT – gradient text with moving shine (pure CSS)
═══════════════════════════════════════════════════════════ */
export function ShimmerText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-[length:200%_auto] ${className}`}
      style={{ animation: "gsapShimmer 4s linear infinite" }}
    >
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   PARALLAX – scroll-based parallax via GSAP ScrollTrigger
═══════════════════════════════════════════════════════════ */
export function Parallax({
  children,
  className = "",
  speed = 0.3,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const st = gsap.to(el, {
      y: speed * -100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      if (st.scrollTrigger) st.scrollTrigger.kill();
      st.kill();
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
