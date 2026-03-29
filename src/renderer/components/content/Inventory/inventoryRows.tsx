import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { RequestPrices } from 'renderer/functionsClasses/prices';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { State } from 'renderer/interfaces/states';
import {
  classNames,
  sortDataFunction,
} from '../shared/filters/inventoryFunctions';
import RenameModal from '../shared/modals & notifcations/modalRename';
import { RowCollections } from './inventoryRows/collectionsRow';
import { RowFloat } from './inventoryRows/floatRow';
import {
  RowHeader,
  RowHeaderCondition,
  RowHeaderConditionNoSort,
} from './inventoryRows/headerRows';
import { RowLinkInventory } from './inventoryRows/inventoryLinkRow';
import { RowMoveable } from './inventoryRows/moveableRow';
import { RowPrice } from './inventoryRows/priceRow';
import { RowQTY } from './inventoryRows/QTYRow';
import { RowRarity } from './inventoryRows/rarityRow';
import { RowProduct } from './inventoryRows/rowName';
import { RowStickersPatches } from './inventoryRows/stickerPatchesRow';
import { RowStorage } from './inventoryRows/storageRow';
import { RowTradehold } from './inventoryRows/tradeholdRow';

function content() {
  const [getInventory, setInventory] = useState([] as any);
  const ReducerClass = new ReducerManager(useSelector);
  const currentState: State = ReducerClass.getStorage();
  const inventory = currentState.inventoryReducer;
  const inventoryFilters = currentState.inventoryFiltersReducer;
  const pricesResult = currentState.pricingReducer;
  const settingsData = currentState.settingsReducer;

  const dispatch = useDispatch();

  const inventoryToUse = useMemo(() => {
    if (
      inventoryFilters.inventoryFiltered.length === 0 &&
      inventoryFilters.inventoryFilter.length === 0
    ) {
      return inventory.combinedInventory || [];
    }

    return inventoryFilters.inventoryFiltered || [];
  }, [
    inventory.combinedInventory,
    inventoryFilters.inventoryFiltered,
    inventoryFilters.inventoryFilter,
  ]);

  useEffect(() => {
    const pricingRequest = new RequestPrices(
      dispatch,
      settingsData,
      pricesResult
    );
    pricingRequest.handleRequestArray(inventoryToUse);
  }, [dispatch, inventoryToUse, pricesResult, settingsData]);

  useEffect(() => {
    let disposed = false;

    async function updateSortedInventory() {
      const inventorySource = Array.isArray(inventoryToUse)
        ? [...inventoryToUse]
        : [];

      const storageResult = await sortDataFunction(
        inventoryFilters.sortValue,
        inventorySource,
        pricesResult.prices,
        settingsData?.source?.title
      );

      const safeResult = Array.isArray(storageResult) ? [...storageResult] : [];
      if (inventoryFilters.sortBack === true) {
        safeResult.reverse();
      }

      if (!disposed) {
        setInventory(safeResult);
      }
    }

    updateSortedInventory();

    return () => {
      disposed = true;
    };
  }, [
    inventoryFilters.sortBack,
    inventoryFilters.sortValue,
    inventoryToUse,
    pricesResult.prices,
    settingsData?.source?.title,
  ]);

  const finalToUse = useMemo(
    () => searchFilter(getInventory || [], inventoryFilters, inventoryFilters),
    [getInventory, inventoryFilters]
  );

  return (
    <>
      <RenameModal />

      {/* Projects list (only on smallest breakpoint) */}
      <div className="mt-10 sm:hidden">
        <div className="px-4 sm:px-6">
          <h2 className="text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">
            物品详情
          </h2>
        </div>
        <ul
          role="list"
          className="mt-3 border-t border-[var(--border-default)] divide-y divide-[var(--border-default)]"
        >
          {getInventory.map((project) => (
            <li key={project.item_id}>
              <a
                href="#"
                className="group flex items-center justify-between px-4 py-4 hover:bg-[var(--bg-level-two)] sm:px-6"
              >
                <span className="flex items-center truncate space-x-3">
                  <span
                    className={classNames(
                      project.bgColorClass,
                      'w-2.5 h-2.5 flex-shrink-0 rounded-full'
                    )}
                    aria-hidden="true"
                  />
                  <span className="font-medium truncate text-sm leading-6">
                    {project.item_name}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <table className="min-w-full">
        <thead className="inv-thead">
          <tr className="border-[var(--border-default)]">
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
            <RowHeaderConditionNoSort
              headerName="可移动"
              condition="Moveable"
            />
            <RowHeaderConditionNoSort
              headerName="链接"
              condition="Inventory link"
            />
          </tr>
        </thead>
        <tbody className="bg-[var(--bg-level-one)] text-[var(--text-secondary)]">
          {finalToUse.map((projectRow) => (
            <tr key={projectRow.item_id} className="inv-row">
              <RowProduct itemRow={projectRow} />
              <RowCollections
                itemRow={projectRow}
                settingsData={settingsData}
              />
              <RowPrice
                itemRow={projectRow}
                settingsData={settingsData}
                pricesReducer={pricesResult}
              />
              <RowStickersPatches
                itemRow={projectRow}
                settingsData={settingsData}
              />
              <RowFloat itemRow={projectRow} settingsData={settingsData} />
              <RowRarity itemRow={projectRow} settingsData={settingsData} />
              <RowStorage itemRow={projectRow} settingsData={settingsData} />
              <RowTradehold itemRow={projectRow} settingsData={settingsData} />
              <RowQTY itemRow={projectRow} />
              <RowMoveable itemRow={projectRow} settingsData={settingsData} />
              <RowLinkInventory
                itemRow={projectRow}
                settingsData={settingsData}
                userDetails={currentState.authReducer}
              />
              <td
                key={Math.random().toString(36).substr(2, 9)}
                className="hidden md:px-6 py-3 whitespace-nowrap text-right text-sm font-medium"
              ></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default function InventoryRowsComponent() {
  return content();
}
