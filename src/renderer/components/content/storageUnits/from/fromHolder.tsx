import StorageFilter from './fromFilters';
import StorageRow from './fromStorageRow';
import StorageSelectorContent from './fromSelector';
import { useSelector } from 'react-redux';
import { classNames } from '../../shared/filters/inventoryFunctions';
import { BanIcon, PlusCircleIcon } from '@heroicons/react/solid';
import {
  RowHeader,
  RowHeaderCondition,
  RowHeaderPlain,
} from '../../Inventory/inventoryRows/headerRows';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { State } from 'renderer/interfaces/states';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';

function StorageUnits() {
  const ReducerClass = new ReducerManager(useSelector);
  const currentState: State = ReducerClass.getStorage();
  const inventory = currentState.inventoryReducer;
  const inventoryFilters = currentState.inventoryFiltersReducer;
  const fromReducer = currentState.moveFromReducer;
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

  let storageToUse = inventoryFilters.storageFiltered;
  if (storageToUse.length == 0 && inventoryFilters.storageFilter.length == 0) {
    storageToUse = inventory.storageInventory;
  }

  let storageFiltered = searchFilter(
    storageToUse,
    inventoryFilters,
    fromReducer
  );

  if (fromReducer.sortBack) {
    storageFiltered.reverse();
  }

  return (
    <div className="flex flex-col">
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
                    headerName="存储"
                    sortName="StorageName"
                    condition="Storage"
                  />
                  <RowHeaderCondition
                    headerName="交易冷却"
                    sortName="tradehold"
                    condition="Tradehold"
                  />
                  <RowHeader headerName="数量" sortName="QTY" />
                  <RowHeaderPlain headerName="取出" />
                  <th className="table-cell px-6 py-2 border-b border-[var(--border-default)] bg-[var(--bg-level-two)] text-center text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                    <span className="md:hidden">取出</span>
                    <div className="flex">
                      <button
                        onClick={() => ultimateFire()}
                        title="全选"
                        className={classNames(
                          (1000 -
                            inventory.inventory.length -
                            fromReducer.totalItemsToMove ==
                            0 &&
                            storageFiltered.length != 0) ||
                            storageFiltered.length == 0 ||
                            storageFiltered.length ==
                              fromReducer.totalToMove.length
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
                        title="清空"
                        className={classNames(
                          fromReducer.totalToMove.length == 0
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
                  </th>
                  <th className="md:hidden table-cell px-6 py-2 border-b border-[var(--border-default)] bg-[var(--bg-level-two)] text-center text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                    <span className="md:hidden"></span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[var(--bg-level-one)] text-[var(--text-secondary)]">
                {storageFiltered.map((project, index) => (
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

export default function FromMainComponent() {
  return <StorageUnits />;
}
