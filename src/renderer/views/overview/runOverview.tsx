import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  ArchiveIcon,
  CollectionIcon,
  DatabaseIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
  TagIcon,
} from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { State } from 'renderer/interfaces/states';
import { ConvertPrices, RequestPrices } from 'renderer/functionsClasses/prices';
import { LoadButton } from 'renderer/components/content/loadStorageUnitsButton';
import { Card } from 'renderer/components/ui';
import ListBoxOptions from './overviewOptionsDropdown';
import {
  OverviewLeftCharts,
  OverviewRightCharts,
  OveviewBy,
} from 'renderer/variables/overviewOptions';
import RightGraph from './rightGraph';
import LeftGraph from './leftGraph';

function Content() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  let ReducerClass = new ReducerManager(useSelector);
  let currentState: State = ReducerClass.getStorage();
  const userDetails = currentState.authReducer;
  const settingsData = currentState.settingsReducer;
  const inventory = currentState.inventoryReducer;
  let hr = new Date().getHours();
  let goodMessage: string = '晚上好';

  if (hr >= 4 && hr < 12) {
    goodMessage = '早上好';
  } else if (hr == 12) {
    goodMessage = '中午好';
  } else if (hr >= 12 && hr <= 17) {
    goodMessage = '下午好';
  } else if (hr >= 0 && hr <= 3) {
    goodMessage = '夜深了';
  }
  const dispatch = useDispatch();

  let PricingRequest = new RequestPrices(
    dispatch,
    settingsData,
    currentState.pricingReducer
  );
  PricingRequest.handleRequestArray(currentState.inventoryReducer.inventory);

  // Inventory prices
  const PricingClass = new ConvertPrices(
    settingsData,
    currentState.pricingReducer
  );
  let inventoryValue = 0;
  inventory.combinedInventory.forEach((element) => {
    const itemPrice = PricingClass.getPrice(element);
    if (itemPrice !== undefined && !isNaN(itemPrice)) {
      inventoryValue += itemPrice * element.combined_QTY;
    }
  });

  let storageUnitsValue = 0;
  inventory.storageInventory.forEach((element) => {
    const itemPrice = PricingClass.getPrice(element);
    if (itemPrice !== undefined && !isNaN(itemPrice)) {
      storageUnitsValue += itemPrice * element.combined_QTY;
    }
  });

  return (
    <>
      <div className="h-screen bg-[var(--bg-level-one)]">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex z-40">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              ></Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="">
          <main className="flex-1 pb-8 bg-[var(--bg-level-one)]">
            {/* Page header */}
            <div className="bg-[var(--bg-level-one)] border-b border-[var(--border-default)]">
              <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                <div className="py-6 md:flex md:items-center md:justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Profile */}
                    <div className="flex items-center">
                      <img
                        className="hidden h-16 w-16 rounded-full sm:block"
                        src={userDetails.userProfilePicture as string}
                        alt=""
                      />
                      <div>
                        <div className="flex items-center">
                          <img
                            className="h-16 w-16 rounded-full sm:hidden"
                            src={userDetails.userProfilePicture as string}
                            alt=""
                          />
                          <h1 className="ml-3 text-2xl font-bold leading-7 text-[var(--text-primary)] sm:leading-9 sm:truncate">
                            {goodMessage}, {userDetails.displayName}.
                          </h1>
                        </div>
                        <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                          <dd className="mt-3 flex items-center mb-2 text-sm text-[var(--text-secondary)] font-medium sm:mr-6 sm:mt-0 capitalize">
                            <TagIcon
                              className="flex-shrink-0 mr-1.5 h-5 w- text-[var(--text-tertiary)]"
                              aria-hidden="true"
                            />

                            <ListBoxOptions
                              optionsObject={OveviewBy}
                              keyToUse={'by'}
                            />
                          </dd>
                          <dd className="flex mb-2 items-center text-sm text-[var(--text-secondary)] font-medium capitalize sm:mr-6">
                            <PresentationChartBarIcon
                              className="flex-shrink-0 mr-1.5 h-5 w- text-[var(--text-tertiary)]"
                              aria-hidden="true"
                            />
                            <ListBoxOptions
                              optionsObject={OverviewLeftCharts}
                              keyToUse={'chartleft'}
                            />
                          </dd>
                          <dd className="flex mb-2 items-center text-sm text-[var(--text-secondary)] font-medium capitalize sm:mr-3">
                            <PresentationChartLineIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-[var(--text-tertiary)]"
                              aria-hidden="true"
                            />
                            <ListBoxOptions
                              optionsObject={OverviewRightCharts}
                              keyToUse={'chartRight'}
                            />
                          </dd>
                          <dt className="sr-only">账户状态</dt>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                    <LoadButton />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-[var(--bg-level-one)]">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Card — Total (featured foil) */}
                  <Card
                    level="foil"
                    interactive
                    className="noise-texture overflow-hidden"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <DatabaseIcon
                          className="h-6 w-6 text-[var(--text-tertiary)]"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-[var(--text-secondary)] truncate">
                            总计
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-[var(--success)]">
                              {new Intl.NumberFormat(settingsData.locale, {
                                style: 'currency',
                                currency: settingsData.currency,
                                maximumFractionDigits: 0,
                              }).format(inventoryValue + storageUnitsValue)}
                            </div>
                            <div className="text-sm text-[var(--text-tertiary)]">
                              /{' '}
                              {new Intl.NumberFormat('en-US').format(
                                inventory.totalAccountItems
                              )}{' '}
                              件物品
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </Card>
                  <Card
                    level="two"
                    interactive
                    className="noise-texture overflow-hidden"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CollectionIcon
                          className="h-6 w-6 text-[var(--text-tertiary)]"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-[var(--text-secondary)] truncate">
                            存储单元
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-[var(--success)]">
                              {new Intl.NumberFormat(settingsData.locale, {
                                style: 'currency',
                                currency: settingsData.currency,
                                maximumFractionDigits: 0,
                              }).format(storageUnitsValue)}
                            </div>
                            <div className="text-sm text-[var(--text-tertiary)]">
                              /{' '}
                              {new Intl.NumberFormat('en-US').format(
                                inventory.totalAccountItems -
                                  inventory.inventory.length
                              )}{' '}
                              件物品
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </Card>
                  <Card
                    level="two"
                    interactive
                    className="noise-texture overflow-hidden"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ArchiveIcon
                          className="h-6 w-6 text-[var(--text-tertiary)]"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-[var(--text-secondary)] truncate">
                            库存
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-[var(--success)]">
                              {new Intl.NumberFormat(settingsData.locale, {
                                style: 'currency',
                                currency: settingsData.currency,
                                maximumFractionDigits: 0,
                              }).format(inventoryValue)}
                            </div>
                            <div className="text-sm text-[var(--text-tertiary)]">
                              /{' '}
                              {new Intl.NumberFormat('en-US').format(
                                inventory.inventory.length
                              )}{' '}
                              件物品
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Activity table (small breakpoint and up) */}
              <div className="hidden sm:block">
                <div className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-rows-3 grid-flow-col gap-4 mt-2">
                    <Card
                      level="three"
                      className="align-middle mw-5 overflow-x-auto row-span-3 overflow-hidden shadow"
                    >
                      <LeftGraph />
                    </Card>
                    <Card
                      level="three"
                      className="align-middle mw-5 overflow-x-auto row-span-3 shadow overflow-hidden"
                    >
                      <RightGraph />
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
export default function App() {
  return <Content />;
}
