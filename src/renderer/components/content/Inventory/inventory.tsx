import InventoryFilters from './filterHeader';
import InventoryRowsComponent from './inventoryRows';
import { useState } from 'react';
import { LoadingButton } from '../shared/animations';
import { RefreshIcon } from '@heroicons/react/solid';
import { Card } from 'renderer/components/ui';

function Content() {
  const [getLoadingButton, setLoadingButton] = useState(false);
  setLoadingButton;

  // Get the inventory
  async function refreshInventory() {
    window.electron.ipcRenderer.refreshInventory();
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Page title & actions */}
      <Card
        level="two"
        className="shrink-0 border-b border-[var(--border-default)]"
      >
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-[var(--text-primary)] sm:truncate">
              库存
            </h1>
          </div>
          <div className="mt-4 flex sm:mt-0 sm:ml-4">
            <button
              type="button"
              onClick={() => refreshInventory()}
              className="focus:outline-none order-1 ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-level-three)] hover:text-[var(--text-primary)] transition-colors duration-150 sm:order-0 sm:ml-0"
            >
              {getLoadingButton ? (
                <LoadingButton />
              ) : (
                <RefreshIcon
                  className="h-4 w-4 text-[var(--text-secondary)]"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
      </Card>

      {/* Pinned projects */}
      <InventoryFilters />

      {/* Projects list (only on smallest breakpoint) */}
      <div className="mt-10 sm:hidden">
        <div className="px-4 sm:px-6">
          <h2 className="text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">
            存储单元
          </h2>
        </div>
      </div>

      {/* Projects table (small breakpoint and up) */}
      <div className="hidden sm:block">
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto content-scrollbar border-b border-[var(--border-default)]">
          <div className="align-middle inline-block min-w-full pb-4">
            <InventoryRowsComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
export default function InventoryContent() {
  return <Content />;
}
