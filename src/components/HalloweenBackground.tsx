import { motion } from 'framer-motion';

const orbs = [
  { x: '10%', y: '20%', size: 280, color: 'rgba(168,85,247,0.35)' },
  { x: '70%', y: '10%', size: 220, color: 'rgba(255,122,24,0.28)' },
  { x: '50%', y: '60%', size: 360, color: 'rgba(94,234,212,0.12)' },
];

export function HalloweenBackground() {
  return (
    <div className="bg-layer" aria-hidden>
      <div className="bg-gradient" />
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="bg-orb"
          style={{ left: o.x, top: o.y, width: o.size, height: o.size, background: o.color }}
          animate={{ x: [0, 24, -12, 0], y: [0, -18, 10, 0] }}
          transition={{ duration: 14 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div className="bg-grid" />
    </div>
  );
}
