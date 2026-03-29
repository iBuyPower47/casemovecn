import { DatabaseIcon } from '@heroicons/react/solid';

export default function AccountAmount({ totalAmount, textToWrite = '剩余' }) {
  return (
    <span className="mr-3 flex items-center text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">
      <DatabaseIcon
        className="flex-none w-5 h-5 mr-2 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
        aria-hidden="true"
      />{' '}
      <span className="text-[var(--accent-primary)]">
        {totalAmount} {textToWrite}
      </span>
    </span>
  );
}
