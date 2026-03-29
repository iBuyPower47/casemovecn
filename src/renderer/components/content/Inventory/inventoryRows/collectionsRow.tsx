export function RowCollections({ itemRow, settingsData }) {
  return (
    <>
      {settingsData.columns.includes('Collections') ? (
        <td className="hidden xl:table-cell px-6 py-3 max-w-0 w-full whitespace-nowrap overflow-hidden text-sm font-normal text-[var(--text-primary)]">
          <div className="flex items-center">
            <span>
              <span className="flex text-[var(--text-primary)]">
                {itemRow?.collection
                  ?.replace('The ', '')
                  ?.replace(' Collection', '')}
              </span>
            </span>
          </div>
        </td>
      ) : null}
    </>
  );
}
