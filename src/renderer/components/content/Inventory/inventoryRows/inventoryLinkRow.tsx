import { ExternalLinkIcon } from '@heroicons/react/solid';

export function RowLinkInventory({ itemRow, settingsData, userDetails }) {
  const inventoryLinkId = itemRow?.combined_ids?.[0];
  const steamId = userDetails?.steamID;

  return (
    <>
      {settingsData.columns.includes('Inventory link') &&
      inventoryLinkId &&
      steamId ? (
        <td
          key={Math.random().toString(36).substr(2, 9)}
          className="table-cell px-6 py-3 whitespace-nowrap text-sm text-[var(--text-secondary)] text-right"
        >
          <div className="flex justify-center rounded-full drop-shadow-lg">
            <a
              href={`https://steamcommunity.com/profiles/${steamId}/inventory/#730_2_${inventoryLinkId}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLinkIcon
                className="h-5 w-5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]"
                aria-hidden="true"
              />
            </a>
          </div>
        </td>
      ) : (
        ''
      )}
    </>
  );
}
