import { motion } from 'motion/react';
import type { CSSProperties } from 'react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

type BorderBeamProps = {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  style?: CSSProperties;
  reverse?: boolean;
  initialOffset?: number;
  borderWidth?: number;
};

export function BorderBeam({
  className,
  size = 120,
  delay = 0,
  duration = 8,
  colorFrom = '#22d3ee',
  colorTo = '#38bdf8',
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      style={
        {
          '--border-beam-width': `${borderWidth}px`,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 rounded-[inherit] border border-white/10" />
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          padding: `var(--border-beam-width)`,
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      >
        <motion.div
          className={cn('absolute aspect-square rounded-full opacity-80 blur-xl', className)}
          style={
            {
              width: size,
              background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
              offsetPath: `rect(0 auto auto 0 round ${size}px)`,
              ...style,
            } as CSSProperties
          }
          initial={{ offsetDistance: `${initialOffset}%` }}
          animate={{
            offsetDistance: reverse
              ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
              : [`${initialOffset}%`, `${100 + initialOffset}%`],
          }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration,
            delay: -delay,
          }}
        />
      </div>
    </div>
  );
}
