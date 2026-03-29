import { useEffect, useRef } from 'react';
import { Disclosure } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { filterInventoryAddOption } from 'renderer/store/actions/filtersInventoryActions';
import { searchFilter } from 'renderer/functionsClasses/filters/search';
import { ConvertPrices } from 'renderer/functionsClasses/prices';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { Filter, Filters } from 'renderer/interfaces/filters';
import _ from 'lodash';
import { State } from 'renderer/interfaces/states';

export default function InventoryFiltersDisclosure({ ClassFilters }) {
  const dispatch = useDispatch();
  const ReducerClass = new ReducerManager(useSelector);
  const currentState: State = ReducerClass.getStorage();

  const inventoryFilters = currentState.inventoryFiltersReducer;
  const inventory = currentState.inventoryReducer;
  const pricesResult = currentState.pricingReducer;
  const settingsData = currentState.settingsReducer;

  // Update selected filter
  async function addRemoveFilter(filterValue: Filter) {
    dispatch(await filterInventoryAddOption(currentState, filterValue));
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

  // Keep a ref to the latest state to avoid stale closures without
  // adding currentState as an effect dependency (which would cause the
  // cleanup to re-run on every state change and race with user actions).
  const latestStateRef = useRef(currentState);
  latestStateRef.current = currentState;

  // Detect stale filters that no longer exist in ClassFilters and clean them up
  const cleanupDone = useRef(false);
  useEffect(() => {
    const latestState = latestStateRef.current;
    const activeFilters = latestState.inventoryFiltersReducer.inventoryFilter;

    let totalSeen = 0;
    const ignoreCategories: Array<Filter> = [];

    Object.entries(ClassFilters.filters as Filters).forEach(
      ([_key, filterObject]) => {
        filterObject.forEach((filter) => {
          if (
            activeFilters.filter((filt) => _.isEqual(filt, filter)).length > 0
          ) {
            totalSeen += 1;
            ignoreCategories.push(filter);
          }
        });
      }
    );

    if (activeFilters.length > totalSeen && !cleanupDone.current) {
      const categoriesToRemove: Array<Filter> = [];
      activeFilters.forEach((element) => {
        if (!_.some(ignoreCategories, element)) {
          categoriesToRemove.push(element);
        }
      });
      if (categoriesToRemove.length > 0) {
        cleanupDone.current = true;
        (async () => {
          let stateSnapshot = latestStateRef.current;
          for (const element of categoriesToRemove) {
            const action = await filterInventoryAddOption(
              stateSnapshot,
              element
            );
            dispatch(action);
            // Update snapshot so next iteration sees the updated filter list
            stateSnapshot = {
              ...stateSnapshot,
              inventoryFiltersReducer: {
                ...stateSnapshot.inventoryFiltersReducer,
                inventoryFilter:
                  stateSnapshot.inventoryFiltersReducer.inventoryFilter.filter(
                    (f) => !_.isEqual(f, element)
                  ),
              },
            };
          }
        })();
      }
    } else {
      cleanupDone.current = false;
    }
  }, [inventoryFilters.inventoryFilter, ClassFilters.filters, dispatch]);

  return (
    <Disclosure.Panel className="border-t border-[var(--border-default)] py-10">
      <div className="mx-auto grid grid-cols-1 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8 ">
        <div className="grid grid-cols-1 gap-y-10 auto-rows-min md:grid-cols-3 md:gap-x-6">
          {Object.entries(ClassFilters.filters as Filters).map(
            ([key, filterObject]) => (
              <fieldset key={key}>
                <legend className="block font-medium text-[var(--text-primary)]">
                  {key}
                </legend>
                <div className="pt-6 space-y-6 sm:pt-4 sm:space-y-4">
                  {filterObject.map((filter, optionIdx) => (
                    <div
                      key={filter.label + filter.include}
                      className="flex items-center text-base sm:text-sm"
                    >
                      <input
                        id={`${filter.label + filter.include}-${optionIdx}`}
                        name="price[]"
                        type="checkbox"
                        className="flex-shrink-0 h-4 w-4 border-[var(--border-default)] rounded text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] bg-[var(--bg-level-two)]"
                        onClick={() => addRemoveFilter(filter)}
                        checked={
                          inventoryFilters.inventoryFilter.filter((filt) =>
                            _.isEqual(filt, filter)
                          ).length > 0
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          e;
                        }}
                      />
                      <label
                        htmlFor={`${
                          filter.label + filter.include
                        }-${optionIdx}`}
                        className="ml-3 min-w-0 flex-1 text-[var(--text-secondary)]"
                      >
                        {filter.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            )
          )}
        </div>
      </div>
    </Disclosure.Panel>
  );
}
