import { motion } from 'motion/react';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  error?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, disabled = false, className = '', ...props }, ref) => {
    const baseStyles =
      'w-full px-3 py-2 rounded-lg bg-[#0A0A0A] text-[var(--text-primary)] transition-all duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-[var(--text-tertiary)] text-sm';

    /* 默认态：细边框 | Focus 态：箔面渐变描边 + 微弱 glow */
    const stateStyles = error
      ? 'border border-[rgba(239,68,68,0.5)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
      : 'border border-[var(--border-default)] hover:border-[var(--border-hover)] focus:foil-border focus:shadow-[0_0_0_1px_rgba(0,191,165,0.1),0_0_12px_rgba(0,191,165,0.08)]';

    const { onAnimationStart, onDrag, onDragEnd, onDragStart, ...restProps } = props;

    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`${baseStyles} ${stateStyles} ${className}`}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
          {...restProps}
        />
        {error && (
          <motion.p
            id="input-error"
            role="alert"
            aria-live="polite"
            className="mt-1.5 text-xs text-[var(--error)]"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
