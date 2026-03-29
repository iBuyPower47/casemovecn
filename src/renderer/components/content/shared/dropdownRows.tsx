import { Fragment, useState } from 'react';
import { Menu, Transition, Popover } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { setColumns } from 'renderer/store/actions/settings';
import { classNames } from './filters/inventoryFunctions';
import { moveFromReset } from 'renderer/store/actions/moveFromActions';

const columns = [
  { id: 1, name: 'Price' },
  { id: 2, name: 'Float' },
  { id: 3, name: 'Stickers/patches' },
  { id: 4, name: 'Storage' },
  { id: 5, name: 'Tradehold' },
  { id: 6, name: 'Rarity' },
  { id: 7, name: 'Collections' },
];
const inventoryColumns = [
  { id: 8, name: 'Moveable' },
  { id: 9, name: 'Inventory link' },
];
const columnLabels: Record<string, string> = {
  Price: '价格',
  Float: '磨损值',
  'Stickers/patches': '贴纸/布章',
  Storage: '存储',
  Tradehold: '交易冷却',
  Rarity: '稀有度',
  Collections: '收藏品',
  Moveable: '可移动',
  'Inventory link': '库存链接',
};
export default function ColumnsDropDown() {
  const settingsData = useSelector((state: any) => state.settingsReducer);

  const [activeColumns, setActiveColums] = useState(settingsData.columns);
  const dispatch = useDispatch();

  async function handleCheck(nameToUse) {
    const chosenActiveCopy = activeColumns.filter((id) => id != nameToUse);
    if (activeColumns.includes(nameToUse) == false) {
      chosenActiveCopy.push(nameToUse);
    }
    setActiveColums(chosenActiveCopy);
    dispatch(setColumns(chosenActiveCopy));
    window.electron.store.set('columns', chosenActiveCopy);

    window.electron.ipcRenderer.refreshInventory();
    dispatch(moveFromReset());

    console.log('Here');
  }
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
        <Popover className="pl-4 relative inline-block text-left">
          <Popover.Button
            className={classNames(
              'inline-flex justify-center w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-level-two)] shadow-sm px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-level-three)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]'
            )}
          >
            已选 {activeColumns.length} 项
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="origin-top-right absolute right-0 mt-2 z-20 bg-[var(--bg-level-three)] rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.6)] p-4 border border-[var(--border-default)] focus:outline-none">
              <form className="space-y-4">
                {columns.map((column, _optionIdx) => (
                  <div key={column.id} className="flex items-center">
                    <input
                      id={`person-${column.id}`}
                      name={`person-${column.id}`}
                      type="checkbox"
                      checked={activeColumns.includes(column.name)}
                      onClick={() => handleCheck(column.name)}
                      className="h-4 w-4 rounded border-[var(--border-default)] bg-[var(--bg-level-two)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                    />
                    <label
                      htmlFor={`person-${column.id}`}
                      className="ml-3 pr-6 text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap"
                    >
                      {columnLabels[column.name] || column.name}
                    </label>
                  </div>
                ))}
              </form>
              <div className="mt-3 relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-[var(--bg-level-three)] text-sm text-[var(--text-tertiary)]">
                    仅库存
                  </span>
                </div>
              </div>
              <form className="space-y-4 mt-2">
                {inventoryColumns.map((column, _optionIdx) => (
                  <div key={column.id} className="flex items-center">
                    <input
                      id={`person-${column.id}`}
                      name={`person-${column.id}`}
                      type="checkbox"
                      checked={activeColumns.includes(column.name)}
                      onClick={() => handleCheck(column.name)}
                      className="h-4 w-4 rounded border-[var(--border-default)] bg-[var(--bg-level-two)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                    />
                    <label
                      htmlFor={`person-${column.id}`}
                      className="ml-3 pr-6 text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap"
                    >
                      {columnLabels[column.name] || column.name}
                    </label>
                  </div>
                ))}
              </form>
            </Popover.Panel>
          </Transition>
        </Popover>
      </Popover.Group>
    </Menu>
  );
}
