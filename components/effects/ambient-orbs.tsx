'use client';

import { motion } from 'framer-motion';

interface OrbProps {
  color: string;
  size: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  blur?: string;
  opacity?: number;
  duration?: number;
  delay?: number;
}

function Orb({ color, size, top, bottom, left, right, blur = '100px', opacity = 0.04, duration = 10, delay = 0 }: OrbProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        bottom,
        left,
        right,
        background: color,
        filter: `blur(${blur})`,
      }}
      animate={{ scale: [1, 1.08, 1], opacity: [opacity, opacity * 1.6, opacity] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

export function AmbientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary cyan orb — top right (behind sidebar area) */}
      <Orb
        color="rgba(0,212,255,1)"
        size="600px"
        top="5%"
        right="-5%"
        blur="130px"
        opacity={0.032}
        duration={12}
        delay={0}
      />

      {/* Purple orb — bottom left */}
      <Orb
        color="rgba(124,58,237,1)"
        size="500px"
        bottom="10%"
        left="5%"
        blur="120px"
        opacity={0.038}
        duration={14}
        delay={3}
      />

      {/* Blue mid accent */}
      <Orb
        color="rgba(0,102,255,1)"
        size="350px"
        top="45%"
        left="35%"
        blur="90px"
        opacity={0.028}
        duration={16}
        delay={6}
      />

      {/* Teal subtle accent — bottom right */}
      <Orb
        color="rgba(20,184,166,1)"
        size="280px"
        bottom="20%"
        right="20%"
        blur="80px"
        opacity={0.03}
        duration={11}
        delay={2}
      />
    </div>
  );
}
