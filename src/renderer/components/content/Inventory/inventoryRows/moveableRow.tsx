import { CheckCircleIcon } from '@heroicons/react/solid';
import { ShieldExclamationIcon } from '@heroicons/react/solid';

export function RowMoveable({ itemRow, settingsData }) {
  return (
    <>
      {settingsData.columns.includes('Moveable') ? (
        <td
          key={Math.random().toString(36).substr(2, 9)}
          className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-sm text-[var(--text-secondary)] text-right"
        >
          <div className="flex justify-center rounded-full drop-shadow-lg">
            {itemRow.item_moveable == true ? (
              <CheckCircleIcon
                className="h-5 w-5 text-[var(--success)]"
                aria-hidden="true"
              />
            ) : (
              <ShieldExclamationIcon
                className="h-5 w-5 text-[#F59E0B]"
                aria-hidden="true"
              />
            )}
          </div>
        </td>
      ) : (
        ''
      )}
    </>
  );
}
