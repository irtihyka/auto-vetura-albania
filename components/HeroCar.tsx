"use client";

import { motion } from "framer-motion";

interface HeroCarProps {
  /** 0-1 range, 0.5 = center */
  mouseX: number;
  mouseY: number;
}

export default function HeroCar({ mouseX, mouseY }: HeroCarProps) {
  // 3D perspective tilt based on mouse
  const rotateY = (mouseX - 0.5) * 12;   // left-right tilt
  const rotateX = (mouseY - 0.5) * -6;   // up-down tilt
  const translateX = (mouseX - 0.5) * 30;
  const translateY = (mouseY - 0.5) * 15;

  // headlight beam angle follows mouse
  const beamSkew = (mouseX - 0.5) * 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none flex justify-center"
    >
      <motion.div
        animate={{ rotateY, rotateX, x: translateX, y: translateY }}
        transition={{ type: "spring", stiffness: 80, damping: 30, mass: 0.8 }}
        style={{ perspective: 1200, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-4xl px-8"
      >
        {/* ── Headlight beam LEFT ── */}
        <motion.div
          animate={{ skewX: beamSkew - 15, opacity: [0.12, 0.2, 0.12] }}
          transition={{
            skewX: { type: "spring", stiffness: 60, damping: 20 },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -top-24 left-[14%] w-28 h-40 origin-bottom"
          style={{
            background: "linear-gradient(to top, rgba(255,200,60,0.25), rgba(255,200,60,0.03) 60%, transparent)",
            borderRadius: "50% 50% 0 0",
            filter: "blur(8px)",
          }}
        />
        {/* ── Headlight beam RIGHT ── */}
        <motion.div
          animate={{ skewX: beamSkew + 15, opacity: [0.12, 0.2, 0.12] }}
          transition={{
            skewX: { type: "spring", stiffness: 60, damping: 20 },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
          className="absolute -top-24 left-[22%] w-28 h-40 origin-bottom"
          style={{
            background: "linear-gradient(to top, rgba(255,200,60,0.25), rgba(255,200,60,0.03) 60%, transparent)",
            borderRadius: "50% 50% 0 0",
            filter: "blur(8px)",
          }}
        />

        {/* ── Tail-light glow LEFT ── */}
        <motion.div
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 right-[14%] w-8 h-4 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.8), transparent 70%)", filter: "blur(6px)" }}
        />
        {/* ── Tail-light glow RIGHT ── */}
        <motion.div
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute -top-4 right-[10%] w-8 h-4 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.8), transparent 70%)", filter: "blur(6px)" }}
        />

        {/* ── The car SVG ── */}
        <svg
          viewBox="0 0 900 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-2xl"
        >
          <defs>
            {/* Neon glow filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Gradient for body */}
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(249,115,22,0.15)" />
              <stop offset="100%" stopColor="rgba(249,115,22,0.03)" />
            </linearGradient>
            {/* Gradient for glass */}
            <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(147,197,253,0.15)" />
              <stop offset="100%" stopColor="rgba(147,197,253,0.05)" />
            </linearGradient>
            {/* Reflection gradient */}
            <linearGradient id="reflectGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(249,115,22,0.06)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* ── Car body outline ── sport sedan silhouette ── */}
          <path
            d="M120 200 
               C120 200, 130 168, 180 155 
               L280 140 
               C310 125, 340 95, 380 80 
               L520 72 
               C560 72, 600 80, 620 95 
               L700 140 
               L780 155 
               C820 165, 830 200, 830 200
               Z"
            fill="url(#bodyGrad)"
            stroke="rgba(249,115,22,0.35)"
            strokeWidth="1.5"
            filter="url(#neonGlow)"
          />

          {/* ── Windshield ── */}
          <path
            d="M345 138 L390 82 L520 76 L555 82 L520 138 Z"
            fill="url(#glassGrad)"
            stroke="rgba(147,197,253,0.2)"
            strokeWidth="1"
          />
          {/* ── Rear window ── */}
          <path
            d="M560 138 L565 85 L620 98 L660 138 Z"
            fill="url(#glassGrad)"
            stroke="rgba(147,197,253,0.2)"
            strokeWidth="1"
          />

          {/* ── Body lines (detail) ── */}
          <path
            d="M180 170 Q450 155, 780 170"
            stroke="rgba(249,115,22,0.15)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M200 185 Q450 175, 770 185"
            stroke="rgba(249,115,22,0.08)"
            strokeWidth="0.8"
            fill="none"
          />

          {/* ── Door line ── */}
          <path
            d="M530 85 L528 200"
            stroke="rgba(249,115,22,0.12)"
            strokeWidth="0.8"
          />

          {/* ── Headlight ── */}
          <ellipse cx="195" cy="168" rx="22" ry="10"
            fill="rgba(255,200,60,0.3)"
            stroke="rgba(255,200,60,0.5)"
            strokeWidth="1"
          />
          <ellipse cx="195" cy="168" rx="10" ry="5"
            fill="rgba(255,255,255,0.4)"
          />

          {/* ── Tail light ── */}
          <rect x="790" y="163" width="22" height="10" rx="3"
            fill="rgba(239,68,68,0.4)"
            stroke="rgba(239,68,68,0.6)"
            strokeWidth="1"
          />

          {/* ── Front wheel ── */}
          <circle cx="255" cy="210" r="36" fill="rgba(30,30,50,0.6)" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5" />
          <circle cx="255" cy="210" r="24" fill="none" stroke="rgba(249,115,22,0.12)" strokeWidth="1" />
          <circle cx="255" cy="210" r="12" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.2)" strokeWidth="1" />
          {/* spoke lines */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line
              key={`fw-${angle}`}
              x1={255 + Math.cos((angle * Math.PI) / 180) * 12}
              y1={210 + Math.sin((angle * Math.PI) / 180) * 12}
              x2={255 + Math.cos((angle * Math.PI) / 180) * 24}
              y2={210 + Math.sin((angle * Math.PI) / 180) * 24}
              stroke="rgba(249,115,22,0.15)"
              strokeWidth="0.8"
            />
          ))}

          {/* ── Rear wheel ── */}
          <circle cx="695" cy="210" r="36" fill="rgba(30,30,50,0.6)" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5" />
          <circle cx="695" cy="210" r="24" fill="none" stroke="rgba(249,115,22,0.12)" strokeWidth="1" />
          <circle cx="695" cy="210" r="12" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.2)" strokeWidth="1" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line
              key={`rw-${angle}`}
              x1={695 + Math.cos((angle * Math.PI) / 180) * 12}
              y1={210 + Math.sin((angle * Math.PI) / 180) * 12}
              x2={695 + Math.cos((angle * Math.PI) / 180) * 24}
              y2={210 + Math.sin((angle * Math.PI) / 180) * 24}
              stroke="rgba(249,115,22,0.15)"
              strokeWidth="0.8"
            />
          ))}

          {/* ── Ground line / shadow ── */}
          <ellipse cx="450" cy="248" rx="360" ry="6"
            fill="url(#reflectGrad)"
          />
          <line x1="90" y1="248" x2="860" y2="248"
            stroke="rgba(249,115,22,0.08)"
            strokeWidth="0.5"
          />
        </svg>

        {/* ── Ground reflection (mirrored, faded) ── */}
        <div className="relative w-full overflow-hidden" style={{ height: 60 }}>
          <svg
            viewBox="0 0 900 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto absolute top-0"
            style={{
              transform: "scaleY(-1)",
              opacity: 0.06,
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          >
            <path
              d="M120 200 C120 200, 130 168, 180 155 L280 140 C310 125, 340 95, 380 80 L520 72 C560 72, 600 80, 620 95 L700 140 L780 155 C820 165, 830 200, 830 200 Z"
              fill="rgba(249,115,22,0.2)"
              stroke="rgba(249,115,22,0.15)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}
