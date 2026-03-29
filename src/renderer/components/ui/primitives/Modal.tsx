import { motion, AnimatePresence } from 'motion/react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /** 启用箔面边框（精选/高价值操作） */
  holographic?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  holographic = false,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Backdrop — 深黑 OLED */}
          <motion.div
            className="absolute inset-0 bg-black/88 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            className={`relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-xl ${
              holographic
                ? 'foil-border shadow-modal-foil noise-texture'
                : 'bg-[var(--bg-level-two)] border border-[var(--border-default)] shadow-emboss'
            } ${className}`}
            style={holographic ? { background: 'var(--bg-level-two)' } : {}}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="px-6 py-4 border-b border-[var(--border-default)]">
                <h2
                  id="modal-title"
                  className="text-base font-semibold text-[var(--text-primary)]"
                >
                  {title}
                </h2>
              </div>
            )}
            <div className="px-6 py-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
