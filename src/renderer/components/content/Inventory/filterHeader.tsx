import { Disclosure } from '@headlessui/react';
import { FilterIcon, SearchIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  filterInventoryClearAll,
  inventoryFilterSetSearch,
} from 'renderer/store/actions/filtersInventoryActions';
import PricingAmount from '../shared/filters/pricingAmount';
import MoveLeft from '../shared/filters/inventoryAmount';
import AccountAmount from '../shared/filters/accountAmount';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { ConvertPrices } from 'renderer/functionsClasses/prices';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import InventoryFiltersDisclosure from './filtersDisclosure';
import { addMajorsFilters } from 'renderer/functionsClasses/filters/filters';
import { InventoryGetFilterManager } from './inventoryFilterSetup';
import { Card } from 'renderer/components/ui';

const ClassFilters = InventoryGetFilterManager();

// ClassFilters.loadFilter(CharacteristicsFilter, true)
// ClassFilters.loadFilter(ContainerFilter, true)

function Content() {
  const dispatch = useDispatch();
  const ReducerClass = new ReducerManager(useSelector);
  const inventoryFilters = ReducerClass.getStorage(
    ReducerClass.names.inventoryFilters
  );
  const inventory = ReducerClass.getStorage(ReducerClass.names.inventory);
  const pricesResult = ReducerClass.getStorage(ReducerClass.names.pricing);
  const settingsData = ReducerClass.getStorage(ReducerClass.names.settings);

  async function clear_all() {
    dispatch(filterInventoryClearAll());
  }

  let inventoryToUse = [] as any;

  if (
    inventoryFilters.inventoryFiltered.length == 0 &&
    inventoryFilters.inventoryFilter.length == 0
  ) {
    inventoryToUse = inventory.combinedInventory;
  } else {
    inventoryToUse = inventoryFilters.inventoryFiltered;
  }

  // Calculate inventory amount prices
  let totalAmount = 0 as any;
  let inventoryFilter = searchFilter(
    inventoryToUse,
    inventoryFilters,
    inventoryFilters
  );
  const PricesClass = new ConvertPrices(settingsData, pricesResult);
  inventoryFilter.forEach((projectRow) => {
    let itemRowPricing = PricesClass.getPrice(projectRow);
    if (itemRowPricing) {
      let individualPrice =
        (projectRow.combined_QTY as number) * itemRowPricing;
      totalAmount += individualPrice = individualPrice ? individualPrice : 0;
    }
  });
  totalAmount = totalAmount.toFixed(0);
  addMajorsFilters(inventory.combinedInventory).then((returnValue) => {
    ClassFilters.loadFilter(returnValue, true);
  });

  return (
    <Card level="one">
      {/* Filters */}

      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="relative grid items-center border-b border-[var(--border-default)]"
      >
        <h2 id="filter-heading" className="sr-only">
          筛选
        </h2>
        <div className="relative col-start-1 row-start-1 py-4 flex justify-between">
          <div className="max-w-7xl flex items-center space-x-6 divide-x divide-[var(--border-default)] text-sm">
            <div>
              <Disclosure.Button className="group font-medium flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150">
                <FilterIcon
                  className="flex-none w-5 h-5 mr-2 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                  aria-hidden="true"
                />
                {inventoryFilters.inventoryFilter.length} 个筛选
              </Disclosure.Button>
            </div>
            <div className="pl-6">
              <button
                type="button"
                className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors duration-150"
                onClick={() => clear_all()}
              >
                清除全部
              </button>
            </div>
            <label htmlFor="search" className="sr-only">
              搜索物品
            </label>
            <div className="relative rounded-md focus:outline-none">
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
                value={inventoryFilters.searchInput}
                className="block w-full pb-0.5 focus:outline-none text-[var(--text-primary)] bg-transparent pl-9 sm:text-sm h-7 rounded-md placeholder:text-[var(--text-tertiary)]"
                placeholder="搜索物品"
                spellCheck="false"
                onChange={(e) =>
                  dispatch(inventoryFilterSetSearch(e.target.value))
                }
              />
            </div>
          </div>
          <div className="flex justify-end justify-items-end max-w-7xl">
            <div className="flex items-center divide-x divide-[var(--border-default)]">
              <div className="pl-3">
                <PricingAmount
                  totalAmount={new Intl.NumberFormat(settingsData.locale, {
                    style: 'currency',
                    currency: settingsData.currency,
                  }).format(totalAmount)}
                />
              </div>
              <div className="pl-3">
                <MoveLeft
                  totalAmount={inventory.inventory.length}
                  textToWrite="库存总计"
                />
              </div>
              <div className="pl-3">
                <AccountAmount
                  totalAmount={inventory.totalAccountItems}
                  textToWrite="账号总计"
                />
              </div>
            </div>
          </div>
        </div>
        <InventoryFiltersDisclosure ClassFilters={ClassFilters} />
      </Disclosure>
    </Card>
  );
}

export default function InventoryFilters() {
  return <Content />;
}
