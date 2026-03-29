import { motion, AnimatePresence } from 'motion/react';
import { ReactNode, useState, useRef, useEffect, useCallback } from 'react';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  align = 'left',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      switch (event.key) {
        case 'Escape':
          close();
          break;
        case 'ArrowDown': {
          event.preventDefault();
          const next = Math.min(focusedIndex + 1, items.length - 1);
          setFocusedIndex(next);
          itemRefs.current[next]?.focus();
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prev = Math.max(focusedIndex - 1, 0);
          setFocusedIndex(prev);
          itemRefs.current[prev]?.focus();
          break;
        }
        case 'Tab':
          close();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, focusedIndex, items.length, close]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      close();
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute z-50 mt-1.5 min-w-[12rem] bg-[var(--bg-level-three)] rounded-lg shadow-dropdown-panel border border-[var(--border-default)] py-1 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
            role="menu"
            aria-orientation="vertical"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            {items.map((item, index) => (
              <button
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                role="menuitem"
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors duration-100 focus:outline-none relative ${
                  item.disabled
                    ? 'text-[var(--text-disabled)] cursor-not-allowed'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-level-four)] focus:bg-[var(--bg-level-four)]'
                }`}
                onClick={() => handleItemClick(item)}
                onFocus={() => setFocusedIndex(index)}
              >
                {item.icon && (
                  <span className="flex-shrink-0 text-[var(--text-secondary)]">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
