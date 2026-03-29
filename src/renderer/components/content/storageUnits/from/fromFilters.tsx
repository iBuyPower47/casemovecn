import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import {
  ArchiveIcon,
  FilterIcon,
  SaveAsIcon,
  SearchIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  moveFromClearAll,
  moveFromsetSearchField,
} from 'renderer/store/actions/moveFromActions';
import MoveModal from '../../shared/modals & notifcations/modalMove';
import { moveModalQuerySet } from 'renderer/store/actions/modalMove actions';
import PricingAmount from '../../shared/filters/pricingAmount';
import { classNames } from '../../shared/filters/inventoryFunctions';

import StorageFilterDisclosure from './storageFilterDisclosure';
import { fromGetFilterManager } from './fromFilterSetup';
import { addMajorsFilters } from 'renderer/functionsClasses/filters/filters';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { ConvertPrices } from 'renderer/functionsClasses/prices';
const ClassFilters = fromGetFilterManager();

// ClassFilters.loadFilter(CharacteristicsFilter, true, 'Include');
// ClassFilters.loadFilter(CharacteristicsFilter, false, 'Exclude');
// ClassFilters.loadFilter(ContainerFilter, true);

function content() {
  const dispatch = useDispatch();
  const fromReducer = useSelector((state: any) => state.moveFromReducer);
  const inventory = useSelector((state: any) => state.inventoryReducer);
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const inventoryFilters = useSelector(
    (state: any) => state.inventoryFiltersReducer
  );

  async function moveItems() {
    let key = (Math.random() + 1).toString(36).substring(7);
    let totalCount = 0;
    let queryNew = [] as any;
    for (const [, element] of Object.entries(fromReducer.totalToMove)) {
      let elemental = element as any;
      for (const [, itemID] of Object.entries(elemental[2])) {
        queryNew.push({
          payload: {
            name: elemental[3],
            number: fromReducer.totalItemsToMove - totalCount,
            type: 'from',
            storageID: elemental[1],
            itemID: itemID,
            isLast: fromReducer.totalItemsToMove - totalCount == 1,
            key: key,
          },
        });
        totalCount++;
      }
    }
    dispatch(moveModalQuerySet(queryNew));
  }
  // Calculate storage amount prices
  let totalAmount = 0 as any;
  let storageDataToUse = inventoryFilters.storageFiltered;
  if (
    storageDataToUse.length == 0 &&
    inventoryFilters.storageFilter.length == 0
  ) {
    storageDataToUse = inventory.storageInventory;
  }
  let inventoryFilter = searchFilter(
    storageDataToUse,
    inventoryFilters,
    fromReducer
  );

  let totalHighlighted = 0 as any;
  let classConvert = new ConvertPrices(settingsData, pricesResult);

  inventoryFilter.forEach((projectRow) => {
    let filtered = fromReducer.totalToMove.filter(
      (row) => row[0] == projectRow.item_id
    );
    if (filtered.length > 0) {
      totalHighlighted +=
        (classConvert.getPrice(projectRow) ?? 0) * filtered[0][2].length;
    }
    totalAmount +=
      classConvert.getPrice(projectRow, true) * projectRow.combined_QTY;
  });
  totalHighlighted = totalHighlighted.toFixed(0);
  totalAmount = totalAmount.toFixed(0);
  // addMajorsFilters(inventoryFilter).then((returnValue) => {
  //   ClassFilters.loadFilter(returnValue, true);
  // });
  useEffect(() => {
    addMajorsFilters(inventoryFilter).then((returnValue) => {
      ClassFilters.loadFilter(returnValue, true);
    });
  }, [inventoryFilter]);

  return (
    <div className="bg-[var(--bg-level-one)]">
      {/* Filters */}

      <MoveModal />

      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="relative grid items-center border-b border-[var(--border-default)] bg-[var(--bg-level-one)]"
      >
        <div className="relative col-start-1 row-start-1 py-3 flex justify-between">
          <div className="max-w-7xl flex items-center space-x-6 divide-x divide-[var(--border-default)] text-sm px-4 sm:px-6 lg:px-8">
            <div>
              <Disclosure.Button className="group font-medium flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150">
                <FilterIcon
                  className="flex-none w-5 h-5 mr-2 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                  aria-hidden="true"
                />
                {inventoryFilters.storageFilter.length == 0
                  ? inventoryFilters.storageFilter.length + ' 个筛选'
                  : inventoryFilters.storageFilter.length + ' 个筛选'}
              </Disclosure.Button>
            </div>
            <div className="pl-6">
              <button
                type="button"
                className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors duration-150"
                onClick={() => dispatch(moveFromClearAll())}
              >
                清除全部
              </button>
            </div>

            <label htmlFor="search" className="sr-only">
              搜索物品
            </label>
            <div className="relative rounded-md focus:outline-none focus:outline-none">
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
                value={fromReducer.searchInput}
                className="block w-full pb-0.5 focus:outline-none text-[var(--text-primary)] pl-9 sm:text-sm h-7 bg-transparent placeholder:text-[var(--text-tertiary)]"
                placeholder="搜索物品"
                spellCheck="false"
                onChange={(e) =>
                  dispatch(moveFromsetSearchField(e.target.value))
                }
              />
            </div>
          </div>
          <div className="flex justify-end justify-items-end max-w-7xl px-4 sm:px-6 lg:px-8 ">
            <div className="flex items-center divide-x divide-[var(--border-default)]">
              <div className="pl-3">
                <PricingAmount
                  totalAmount={new Intl.NumberFormat(settingsData.locale, {
                    style: 'currency',
                    currency: settingsData.currency,
                  }).format(totalAmount)}
                  pricingAmount={totalHighlighted}
                />
              </div>
              <div className="pl-3">
                <span className="mr-3 flex items-center text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">
                  <ArchiveIcon
                    className="flex-none w-5 h-5 mr-2 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                    aria-hidden="true"
                  />{' '}
                  <span className="text-[var(--success)]">
                    {1000 -
                      inventory.inventory.length -
                      fromReducer.totalItemsToMove}{' '}
                    剩余
                  </span>
                </span>
              </div>
              <div className="pl-3">
                <span className="mr-3 flex items-center text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">
                  <SwitchHorizontalIcon
                    className="flex-none w-5 h-5 mr-2 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                    aria-hidden="true"
                  />{' '}
                  <span className="text-[var(--accent-primary)]">
                    {fromReducer.totalItemsToMove} 件物品
                  </span>
                </span>
              </div>
              <div className="pl-3">
                <Link
                  to=""
                  type="button"
                  onClick={() => moveItems()}
                  className={classNames(
                    fromReducer.totalItemsToMove == 0
                      ? 'pointer-events-none bg-[var(--bg-level-two)] text-[var(--text-disabled)]'
                      : 'bg-[var(--bg-level-three)] hover:bg-[var(--bg-level-four)] text-[var(--text-primary)]',
                    'order-1 ml-3 inline-flex items-center px-4 py-2 border-none text-sm font-medium rounded-md sm:order-0 sm:ml-0'
                  )}
                >
                  取出
                  <SaveAsIcon
                    className="ml-3 h-4 w-4 text-current"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <StorageFilterDisclosure ClassFilters={ClassFilters} />
      </Disclosure>
    </div>
  );
}

export default function StorageFilter() {
  return content();
}
