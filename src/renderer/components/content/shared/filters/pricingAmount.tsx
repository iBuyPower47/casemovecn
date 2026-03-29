import { CashIcon } from '@heroicons/react/solid';
import { classNames } from './inventoryFunctions';

export default function PricingAmount({
  totalAmount,
  pricingAmount = 0,
  IconToUse = CashIcon,
  colorOf = 'text-[var(--warning)]',
}) {
  return (
    <span className="mr-3 flex items-center text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">
      <IconToUse
        className="flex-none w-5 h-5 mr-2 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
        aria-hidden="true"
      />{' '}
      <span className={classNames(colorOf)}>{totalAmount} </span>
      {pricingAmount == 0 ? (
        ''
      ) : (
        <span className="text-[var(--text-tertiary)]">
          &nbsp; ( {pricingAmount} ){' '}
        </span>
      )}
    </span>
  );
}
