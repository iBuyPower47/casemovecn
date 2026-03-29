import { motion } from 'motion/react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children: ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost'
    | 'foil'
    | 'holographic';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'group relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-level-one)] disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const variantStyles: Record<string, string> = {
    /* 箔面主按钮 — 金属渐变背景 + 光扫 */
    foil: 'overflow-hidden bg-gradient-to-r from-[#FFD700] via-[#A855F7] to-[#38BDF8] text-black font-bold shadow-foil hover:brightness-110 active:translate-y-px active:brightness-100',
    /* 原 primary 映射到 foil 风格（向下兼容） */
    primary:
      'overflow-hidden bg-gradient-to-r from-[#FFD700] via-[#A855F7] to-[#38BDF8] text-black font-bold shadow-foil hover:brightness-110 active:translate-y-px',
    /* 次要按钮 — 深色背景 + 金属描边 */
    secondary:
      'bg-[var(--bg-level-three)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-level-four)] active:translate-y-px',
    /* 危险按钮 */
    danger:
      'bg-[rgba(239,68,68,0.15)] text-[#FCA5A5] border border-[rgba(239,68,68,0.35)] hover:bg-[rgba(239,68,68,0.25)] hover:border-[rgba(239,68,68,0.6)] active:translate-y-px',
    /* 幽灵按钮 */
    ghost:
      'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-level-three)] hover:text-[var(--text-primary)] active:translate-y-px',
    /* 旧版 holographic 映射到 foil */
    holographic:
      'overflow-hidden bg-gradient-to-r from-[#FFD700] via-[#A855F7] to-[#38BDF8] text-black font-bold shadow-foil hover:brightness-110 active:translate-y-px',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2',
  };

  const isFoilVariant =
    variant === 'foil' || variant === 'primary' || variant === 'holographic';

  const { onAnimationStart, onDrag, onDragEnd, onDragStart, ...restProps } =
    props;

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
      {...restProps}
    >
      {/* 箔面按钮光扫层 */}
      {isFoilVariant && !disabled && (
        <span
          className="pointer-events-none absolute inset-0 translate-x-[-150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-200 ease-out group-hover:translate-x-[200%]"
          aria-hidden="true"
        />
      )}
      {children}
    </motion.button>
  );
}
