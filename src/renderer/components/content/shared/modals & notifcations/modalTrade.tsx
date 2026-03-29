const rarityShort = {
  'Factory New': 'FN',
  'Minimal Wear': 'MW',
  'Field-Tested': 'FT',
  'Well-Worn': 'WW',
  'Battle-Scarred': 'BS',
};

/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { BeakerIcon, XIcon } from '@heroicons/react/solid';
import { classNames } from '../filters/inventoryFunctions';
import {
  setTradeConfirm,
  setTradeMove,
} from 'renderer/store/actions/modalTrade';
import { tradeUpAddRemove } from 'renderer/store/actions/tradeUpActions';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { State } from 'renderer/interfaces/states';
import { moveFromReset } from 'renderer/store/actions/moveFromActions';
import { ConvertPricesFormatted } from 'renderer/functionsClasses/prices';
import { createCSGOImage } from '../../../../functionsClasses/createCSGOImage';
setTradeConfirm;
export default function TradeModal() {
  let currentState: State = new ReducerManager(useSelector).getStorage();
  const tradeUpData = currentState.tradeUpReducer;
  const settingsData = currentState.settingsReducer;
  const modalData = currentState.modalTradeReducer;
  const pricesResult = currentState.pricingReducer;
  const inventory = currentState.inventoryReducer;

  const pricesFormat = new ConvertPricesFormatted(settingsData, pricesResult);

  const dispatch = useDispatch();
  async function moveItems() {
    let hasRun = false;
    tradeUpData.tradeUpProducts.forEach((element) => {
      if (element.storage_id) {
        hasRun = true;
        window.electron.ipcRenderer.moveFromStorageUnit(
          element.storage_id,
          element.item_id,
          false
        );
      }
    });
    if (hasRun) {
      dispatch(moveFromReset());
    }
    return;
  }

  let doTransferFirst = false;
  tradeUpData.tradeUpProducts.forEach((element) => {
    if (element.storage_id) {
      doTransferFirst = true;
    }
  });

  async function confirmContract() {
    moveItems().then(() => {
      let rarityToUse = (tradeUpData.tradeUpProducts[0]?.rarity as any) - 1;
      if (tradeUpData.tradeUpProducts[0]?.stattrak) {
        rarityToUse += 10;
      }
      let idsToGet = [...tradeUpData.tradeUpProductsIDS] as any;
      inventory.inventory.forEach((element) => {
        idsToGet.push(element.item_id);
      });
      dispatch(setTradeConfirm(idsToGet));
      rarityToUse;
      window.electron.ipcRenderer.tradeOrder(
        tradeUpData.tradeUpProductsIDS,
        rarityToUse
      );
      window.electron.ipcRenderer.refreshInventory();
    });
  }

  const [activeHover, setActiveHover] = useState('');

  async function handleOver(itemID) {
    if (activeHover != itemID) {
      setActiveHover(itemID);
    }
  }

  return (
    <Transition.Root show={modalData.moveOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => dispatch(setTradeMove())}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/88 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom foil-border noise-texture rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-modal-foil transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[var(--bg-level-three)] border border-[var(--border-default)]">
                  <BeakerIcon
                    className="h-6 w-6 text-[var(--accent-primary)]"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-[var(--text-primary)]"
                  >
                    确认汰换合同
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-[var(--text-secondary)]">
                      确认合同后，以下物品将从您的库存中移除。请注意，
                      价格基于 Steam 市场 7 天均价，与您的定价设置无关。
                    </p>
                  </div>
                  <ul role="list" className="mt-3 grid grid-cols-2 gap-2 ">
                    {tradeUpData.tradeUpProducts.map((project, index) => (
                      <li
                        key={index}
                        className="col-span-1 flex shadow-sm rounded-md"
                      >
                        <div className="relative">
                          <div
                            onMouseEnter={() => setActiveHover(project.item_id)}
                            onMouseLeave={() => setActiveHover('')}
                            onMouseOver={() => handleOver(project.item_id)}
                            className="flex-shrink-0 h-full flex items-center justify-center w-10 border-t border-l border-b border-[var(--border-default)] rounded-l-md bg-[var(--bg-level-three)]"
                          >
                            {project.item_id == activeHover ? (
                              <button
                                onClick={() =>
                                  dispatch(tradeUpAddRemove(project))
                                }
                                className="w-full absolute justify-items-center h-full flex items-center justify-center z-10 "
                              >
                                {' '}
                                <XIcon className="h-4 w-4 text-[var(--text-secondary)]" />{' '}
                              </button>
                            ) : (
                              <img
                                className="max-w-none h-7 w-7  object-cover z-10 absolute"
                                src={
                                  createCSGOImage(
                                    project.item_url
                                  )
                                }
                              />
                            )}
                            {project.storage_name != undefined &&
                            project.item_id != activeHover ? (
                              <img
                                className="max-w-none h-7 w-7  object-cover absolute z-0 opacity-50 "
                                src={createCSGOImage('econ/tools/casket')}
                              />
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                        <div className="flex-1 bg-[var(--bg-level-two)] flex items-center justify-between border-t border-r border-b border-[var(--border-default)] rounded-r-md truncate">
                          <div className="flex-1 px-4 py-2 text-sm truncate">
                            <div className="flex justify-between">
                              <span className="text-xs font-light text-[var(--text-secondary)]">
                                {project.item_name} -{' '}
                                {rarityShort[project.item_wear_name as string]}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <p className="text-[var(--text-tertiary)]">
                                {pricesFormat.getFormattedPrice(project)}
                              </p>
                              <p className="text-[var(--text-tertiary)]">
                                {project.item_paint_wear
                                  ?.toString()
                                  ?.substr(0, 9)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                {doTransferFirst ? (
                  <button
                    type="button"
                    className={classNames(
                      tradeUpData.tradeUpProducts.length != 10
                        ? 'pointer-events-none bg-[var(--bg-level-three)] text-[var(--text-disabled)]'
                        : 'bg-[var(--accent-primary)] text-black hover:opacity-90',
                      'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium transition-all duration-150 sm:col-start-2 sm:text-sm'
                    )}
                    onClick={() => confirmContract()}
                  >
                    转移并确认
                  </button>
                ) : (
                  <button
                    type="button"
                    className={classNames(
                      tradeUpData.tradeUpProducts.length != 10
                        ? 'pointer-events-none bg-[var(--bg-level-three)] text-[var(--text-disabled)]'
                        : 'bg-[var(--accent-primary)] text-black hover:opacity-90',
                      'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium transition-all duration-150 sm:col-start-2 sm:text-sm'
                    )}
                    onClick={() => confirmContract()}
                  >
                    确认合同
                  </button>
                )}

                <button
                  type="button"
                  className={classNames(
                    'mt-3 w-full inline-flex justify-center rounded-md border border-[var(--border-default)] shadow-sm px-4 py-2 bg-[var(--bg-level-two)] text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-level-three)] hover:text-[var(--text-primary)] transition-colors duration-150 sm:mt-0 sm:col-start-1 sm:text-sm'
                  )}
                  onClick={() => dispatch(setTradeMove())}
                >
                  取消
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
