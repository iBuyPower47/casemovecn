import { Menu, Transition, Switch } from '@headlessui/react';
import {
  DotsVerticalIcon,
  RefreshIcon,
  SearchIcon,
} from '@heroicons/react/solid';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRenameModal } from 'renderer/store/actions/modalMove actions';
import {
  moveToAddCasketToStorages,
  moveToClearAll,
  moveToSetFull,
  moveToSetHide,
  moveTosetSearchFieldStorage,
} from 'renderer/store/actions/moveToActions';
import { createCSGOImage } from '../../../../functionsClasses/createCSGOImage';
import EmptyComponent from '../../shared/emptyState';
import { classNames } from '../../shared/filters/inventoryFunctions';
import RenameModal from '../../shared/modals & notifcations/modalRename';
moveToClearAll;

function content() {
  const dispatch = useDispatch();

  const inventory = useSelector((state: any) => state.inventoryReducer);
  const toSelector = useSelector((state: any) => state.moveToReducer);

  // Clear all filters

  // This will return and convert a specific units data
  async function getStorageData(storageID, casketVolume) {
    dispatch(moveToAddCasketToStorages(storageID, casketVolume));
    // dispatch(moveToClearAll());
  }

  // Get the inventory
  async function refreshInventory() {
    window.electron.ipcRenderer.refreshInventory();
  }

  // Sort run
  function sortRun(valueOne, ValueTwo, useNaN = false) {
    if (valueOne < ValueTwo) {
      return -1;
    }
    if (valueOne > ValueTwo) {
      return 1;
    }

    if (useNaN && isNaN(valueOne)) {
      return -1;
    }
    return 0;
  }

  let inventoryToUse = inventory.inventory;

  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-[var(--bg-level-one)]">
      <RenameModal />
      <div className="border-[var(--border-default)] px-4 py-4 sm:flex sm:items-center sm:justify-between ">
        <div className="flex items-center">
          <h2 className="text-[var(--text-tertiary)] text-xs font-medium uppercase mr-3 tracking-wide">
            存储单元
          </h2>
          <label htmlFor="search" className="sr-only">
            搜索存储单元
          </label>
          <div className="relative rounded-md border-[var(--border-default)] border-l-2 focus:outline-none focus:outline-none">
            <div
              className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              aria-hidden="true"
            >
              <SearchIcon
                className="mr-3 h-4 w-4 text-[var(--text-tertiary)]"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={toSelector.searchInputStorage}
              className="block w-full pb-0.5 focus:outline-none text-[var(--text-primary)] pl-9 sm:text-sm h-7 bg-transparent placeholder:text-[var(--text-tertiary)]"
              placeholder="搜索存储单元"
              spellCheck="false"
              onChange={(e) =>
                dispatch(moveTosetSearchFieldStorage(e.target.value))
              }
            />
          </div>
        </div>
        <div className="mt-4 flex items-center sm:mt-0 sm:ml-4">
          <button
            type="button"
            className="focus:outline-none order-1 ml-3 inline-flex items-center px-4 py-2 hover:bg-[var(--bg-level-two)] text-sm font-medium rounded-md text-[var(--text-secondary)] sm:order-0 sm:ml-0"
            onClick={() => refreshInventory()}
          >
            <RefreshIcon
              className="h-4 w-4 text-[var(--text-secondary)]"
              aria-hidden="true"
            />
          </button>
          <span className="mr-3 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">
            隐藏空箱
          </span>
          <Switch
            checked={toSelector.doHide}
            onChange={() => dispatch(moveToSetHide())}
            className={classNames(
              toSelector.doHide
                ? 'bg-[var(--accent-primary)]'
                : 'bg-[var(--bg-level-three)]',
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
            )}
          >
            <span
              className={classNames(
                toSelector.doHide ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow transform ring-0 transition ease-in-out duration-200'
              )}
            >
              <span
                className={classNames(
                  toSelector.doHide
                    ? 'opacity-0 ease-out duration-100'
                    : 'opacity-100 ease-in duration-200',
                  'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-[var(--text-tertiary)]"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className={classNames(
                  toSelector.doHide
                    ? 'opacity-100 ease-in duration-200'
                    : 'opacity-0 ease-out duration-100',
                  'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-[var(--accent-primary)]"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
              </span>
            </span>
          </Switch>
          <span className="mr-3 ml-3 text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">
            隐藏已满
          </span>
          <Switch
            checked={toSelector.hideFull}
            onChange={() => dispatch(moveToSetFull())}
            className={classNames(
              toSelector.hideFull
                ? 'bg-[var(--accent-primary)]'
                : 'bg-[var(--bg-level-three)]',
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
            )}
          >
            <span
              className={classNames(
                toSelector.hideFull ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-[var(--text-primary)] shadow transform ring-0 transition ease-in-out duration-200'
              )}
            >
              <span
                className={classNames(
                  toSelector.hideFull
                    ? 'opacity-0 ease-out duration-100'
                    : 'opacity-100 ease-in duration-200',
                  'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-[var(--text-tertiary)]"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className={classNames(
                  toSelector.hideFull
                    ? 'opacity-100 ease-in duration-200'
                    : 'opacity-0 ease-out duration-100',
                  'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-[var(--accent-primary)]"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
              </span>
            </span>
          </Switch>
        </div>
      </div>
      {inventoryToUse.filter(function (row) {
        if (!row.item_url?.includes('casket')) {
          return false; // skip
        }
        if (row.item_storage_total == 0 && toSelector.doHide) {
          return false; // skip
        }
        if (
          toSelector.searchInputStorage != '' &&
          !row?.item_customname
            ?.toLowerCase()
            ?.includes(toSelector.searchInputStorage)
        ) {
          return false; // skip
        }
        if (row.item_storage_total == 1000 && toSelector.hideFull) {
          return false; // skip
        }
        return true;
      }).length != 0 ? (
        <ul
          role="list"
          className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3"
        >
          {inventoryToUse
            .filter(function (row) {
              if (!row.item_url.includes('casket')) {
                return false; // skip
              }
              if (
                toSelector.searchInputStorage != '' &&
                !row?.item_customname
                  ?.toLowerCase()
                  ?.includes(toSelector.searchInputStorage)
              ) {
                return false; // skip
              }
              if (row.item_storage_total == 0 && toSelector.doHide) {
                return false; // skip
              }
              if (row.item_storage_total == 1000 && toSelector.hideFull) {
                return false; // skip
              }
              return true;
            })
            .sort(function (a, b) {
              let a_customName = a.item_customname;
              let b_customName = b.item_customname;
              if (a_customName == undefined) {
                a_customName = '0000';
              }
              if (b_customName == undefined) {
                b_customName = '0000';
              }
              return sortRun(a_customName, b_customName);
            })
            .map((project) => (
              <li
                key={project.item_id}
                className={classNames(
                  'pointer-events-auto relative col-span-1 flex shadow-sm rounded-md'
                )}
              >
                <button
                  type="button"
                  className={classNames(
                    project.item_customname != null ? '' : 'pointer-events-none'
                  )}
                  onClick={() =>
                    getStorageData(project.item_id, project.item_storage_total)
                  }
                  key={project.item_id}
                >
                  <div
                    className={classNames(
                      toSelector.activeStorages.includes(project.item_id)
                        ? 'border-[#A855F7] '
                        : 'border-[var(--border-default)] ',
                      'flex-shrink-0 h-full flex items-center justify-center w-16 text-white border-t border-l border-b rounded-l-md bg-[var(--bg-level-two)] transition-colors duration-150'
                    )}
                  >
                    <img
                      className={classNames(
                        toSelector.activeStorages.includes(project.item_id)
                          ? ''
                          : 'opacity-50',
                        'max-w-none h-11 w-11  object-cover'
                      )}
                      src={createCSGOImage(project.item_url)}
                    />
                  </div>
                </button>
                <div
                  className={classNames(
                    toSelector.activeStorages.includes(project.item_id)
                      ? 'border-[#A855F7]'
                      : 'border-[var(--border-default)]',
                    'flex-1 bg-[var(--bg-level-two)] flex items-center justify-between border-t border-r border-b rounded-r-md truncate transition-colors duration-150'
                  )}
                >
                  {project.item_customname != null ? (
                    <button
                      type="button"
                      onClick={() =>
                        getStorageData(
                          project.item_id,
                          project.item_storage_total
                        )
                      }
                      className=""
                      key={project.item_id}
                    >
                      <div className="flex-1 px-4 py-2 text-sm truncate text-[var(--text-primary)]">
                        {project.item_customname}
                        <p className="text-[var(--text-secondary)]">
                          {project.item_storage_total} 件物品
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="flex-1 px-4 py-2 text-sm truncate text-[var(--text-primary)]">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            setRenameModal(
                              project.item_id,
                              project.item_customname !== null
                                ? project.item_customname
                                : project.item_name
                            )
                          )
                        }
                        className={classNames(
                          'block text-sm text-[var(--accent-primary)] pointer-events-auto'
                        )}
                      >
                        激活
                      </button>
                      <p className="text-[var(--text-secondary)]">
                        {project.item_storage_total} 件物品
                      </p>
                    </div>
                  )}
                  <Menu as="div" className="flex-shrink-0 pr-2">
                    <Menu.Button className="w-8 h-8 inline-flex items-center justify-center text-[var(--text-tertiary)] rounded-full hover:text-[var(--text-secondary)]">
                      <span className="sr-only">打开选项</span>
                      <DotsVerticalIcon
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="z-10 mx-3 origin-top-right absolute bg-[var(--bg-level-three)] border border-[var(--border-default)] right-10 top-3 w-48 mt-1 rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.6)] divide-y divide-[var(--border-default)] focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                type="button"
                                onClick={() =>
                                  dispatch(
                                    setRenameModal(
                                      project.item_id,
                                      project.item_customname !== null
                                        ? project.item_customname
                                        : project.item_name
                                    )
                                  )
                                }
                                className={classNames(
                                  active
                                    ? 'bg-[var(--bg-level-four)] text-[var(--text-primary)]'
                                    : 'text-[var(--text-secondary)]',
                                  'block px-4 py-2 text-sm'
                                )}
                              >
                                {' '}
                                重命名
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <EmptyComponent />
      )}
    </div>
  );
}

export default function StorageSelectorContent() {
  return content();
}
