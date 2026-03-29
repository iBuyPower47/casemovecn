import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  /** one=root, two=default card, three=elevated, four=interactive, foil=premium border, holographic=compat alias */
  level?: 'one' | 'two' | 'three' | 'four' | 'foil' | 'holographic';
  className?: string;
  animated?: boolean;
  /** 启用 hover 光扫效果 */
  interactive?: boolean;
}

export function Card({
  children,
  level = 'two',
  className = '',
  animated = false,
  interactive = false,
}: CardProps) {
  const Component = animated ? motion.div : 'div';

  const animationProps = animated
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
      }
    : {};

  const levelStyles: Record<string, string> = {
    one: 'bg-[var(--bg-level-one)]',
    two: 'bg-[var(--bg-level-two)]',
    three: 'bg-[var(--bg-level-three)]',
    four: 'bg-[var(--bg-level-four)]',
    /* 箔面边框卡片：渐变描边 + glow */
    foil: 'foil-border shadow-foil',
    /* 旧版 holographic 映射到 foil */
    holographic: 'foil-border shadow-foil',
  };

  const baseCard =
    'rounded-lg p-4 border border-[var(--border-default)] shadow-emboss';
  const foilLevels = level === 'foil' || level === 'holographic';
  /* foil 变体不重复 border（已包含在 foil-border 中） */
  const borderOverride = foilLevels ? 'border-0' : '';

  const interactiveClass = interactive
    ? 'cursor-pointer transition-all duration-[200ms] hover:border-[var(--border-hover)] hover:shadow-emboss-foil noise-texture foil-sweep'
    : '';

  return (
    <Component
      className={`${baseCard} ${levelStyles[level]} ${borderOverride} ${interactiveClass} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  );
}
