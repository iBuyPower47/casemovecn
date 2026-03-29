import { useMemo } from 'react';
import StorageFilter from './toFilters';
import StorageRow from './toStorageRow';
import StorageSelectorContent from './toSelector';
import { useSelector } from 'react-redux';
import {
  classNames,
  sortDataFunctionTwo,
} from '../../shared/filters/inventoryFunctions';
import { BanIcon, PlusCircleIcon } from '@heroicons/react/solid';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { State } from 'renderer/interfaces/states';
import {
  RowHeader,
  RowHeaderCondition,
  RowHeaderPlain,
} from '../../Inventory/inventoryRows/headerRows';

function StorageUnits() {
  const inventory = useSelector((state: State) => state.inventoryReducer);
  const inventoryFilter = useSelector(
    (state: State) => state.inventoryFiltersReducer
  );
  const toReducer = useSelector((state: State) => state.moveToReducer);
  const pricesResult = useSelector((state: State) => state.pricingReducer);
  const settingsData = useSelector((state: State) => state.settingsReducer);
  const inventoryFilters = useSelector(
    (state: any) => state.inventoryFiltersReducer
  );
  const inventoryTouse = useMemo(() => {
    if (inventoryFilters.inventoryFilter?.length === 0) {
      return inventory.combinedInventory || [];
    }
    return inventoryFilter.inventoryFiltered || [];
  }, [
    inventory.combinedInventory,
    inventoryFilter.inventoryFiltered,
    inventoryFilters.inventoryFilter,
  ]);

  const getStorage = useMemo(() => {
    const sorted = sortDataFunctionTwo(
      toReducer.sortValue,
      [...inventoryTouse],
      pricesResult.prices,
      settingsData?.source?.title
    );
    const safeResult = Array.isArray(sorted) ? [...sorted] : [];
    if (toReducer.sortBack === true) {
      safeResult.reverse();
    }
    return safeResult;
  }, [
    inventoryTouse,
    pricesResult.prices,
    settingsData?.source?.title,
    toReducer.sortBack,
    toReducer.sortValue,
  ]);

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  async function ultimateFire() {
    const runIndex = [] as any;
    const relevantRows = document.getElementsByClassName(`findRow`);
    Array.from(relevantRows).forEach(function (element, index) {
      if (!element.classList.contains('hidden')) {
        runIndex.push(index);
      }
    });

    for (let index = 0; index < runIndex.length; index++) {
      const indexToRun = runIndex[index];

      // Actual run
      const htmlElement = document.getElementById(`fire-${indexToRun}`);
      if (htmlElement != undefined) {
        if (!htmlElement.classList.contains('hidden')) {
          htmlElement.click();
          await sleep(25);
        }
      }
    }
  }

  async function removeFire() {
    let i = 0;
    const htmlElements = document.getElementsByClassName('removeXButton');
    Array.from(htmlElements).forEach(function (element) {
      console.log(element);
    });
    while (true) {
      const htmlElement = document.getElementById(`removeX-${i}`);
      console.log(htmlElement);
      if (htmlElement != undefined) {
        htmlElement.click();
      } else {
        break;
      }
      i++;
    }
  }

  let inventoryMoveable = useMemo(() => {
    const filteredInventory = searchFilter(
      getStorage,
      inventoryFilter,
      toReducer
    );

    return filteredInventory.filter(function (item) {
      return item.item_moveable == true;
    });
  }, [getStorage, inventoryFilter, toReducer]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Page title & actions */}
      <div className="shrink-0 border-b border-[var(--border-default)] bg-[var(--bg-level-one)] px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium text-[var(--text-primary)] leading-6 sm:truncate">
            存入存储组件
          </h1>
        </div>
      </div>
      {/* Storage units */}
      <StorageSelectorContent />

      <StorageFilter />

      {/* Projects table (small breakpoint and up) */}

      <div className="hidden sm:block">
        <div className="max-h-[calc(100vh-285px)] overflow-y-auto content-scrollbar border-b border-[var(--border-default)]">
          <div className="align-middle inline-block min-w-full">
            <table className="min-w-full">
              <thead className="inv-thead">
                <tr>
                  <RowHeader headerName="物品" sortName="Product name" />
                  <RowHeaderCondition
                    headerName="收藏品"
                    sortName="Collection"
                    condition="Collections"
                  />
                  <RowHeaderCondition
                    headerName="价格"
                    sortName="Price"
                    condition="Price"
                  />
                  <RowHeaderCondition
                    headerName="贴纸/布章"
                    sortName="Stickers"
                    condition="Stickers/patches"
                  />
                  <RowHeaderCondition
                    headerName="磨损值"
                    sortName="wearValue"
                    condition="Float"
                  />
                  <RowHeaderCondition
                    headerName="稀有度"
                    sortName="Rarity"
                    condition="Rarity"
                  />
                  <RowHeaderCondition
                    headerName="交易冷却"
                    sortName="tradehold"
                    condition="Tradehold"
                  />
                  <RowHeader headerName="数量" sortName="QTY" />
                  <RowHeaderPlain headerName="移动" />
                  <th className="table-cell px-6 py-2 border-b border-[var(--border-default)] bg-[var(--bg-level-two)] text-center text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                    <div className="flex">
                      <button
                        onClick={() => ultimateFire()}
                        title="全选"
                        className={classNames(
                          1000 -
                            toReducer.activeStoragesAmount -
                            toReducer.totalItemsToMove ==
                            0 ||
                            toReducer.totalToMove.length ==
                              inventoryFilters.inventoryFiltered.length
                            ? 'pointer-events-none text-[var(--text-disabled)]'
                            : 'text-[var(--text-secondary)]'
                        )}
                      >
                        <PlusCircleIcon
                          className={classNames(
                            ' h-4 w-4 text-current text-current hover:text-[var(--warning)]'
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        onClick={() => removeFire()}
                        title="取消"
                        className={classNames(
                          toReducer.totalToMove.length == 0
                            ? 'pointer-events-none text-[var(--text-disabled)]'
                            : 'text-[var(--text-secondary)]'
                        )}
                      >
                        <BanIcon
                          className={classNames(
                            ' h-4 w-4 text-current text-current hover:text-[var(--error)]'
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <span className="md:hidden">移动</span>
                  </th>
                  <th className="md:hidden table-cell px-6 py-2 border-b border-[var(--border-default)] bg-[var(--bg-level-two)] text-center text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                    <span className="md:hidden"></span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[var(--bg-level-one)] text-[var(--text-secondary)]">
                {inventoryMoveable.map((project, index) => (
                  <tr key={project.item_id} className="inv-row findRow">
                    <StorageRow projectRow={project} index={index} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToContent() {
  return <StorageUnits />;
}
