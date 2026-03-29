import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { setTradeMoveResult } from 'renderer/store/actions/modalTrade';
import { tradeUpResetPossible } from 'renderer/store/actions/tradeUpActions';
import { createCSGOImage } from '../../../../functionsClasses/createCSGOImage';

export default function TradeResultModal() {
  const dispatch = useDispatch();
  const modalData = useSelector((state: any) => state.modalTradeReducer);

  let devMode = false;

  async function setDone() {
    dispatch(setTradeMoveResult())
    dispatch(tradeUpResetPossible())
  }


  return (
    <Transition.Root show={devMode ? true : modalData.openResult} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => dispatch(setTradeMoveResult())}
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
                <div className='flex items-center justify-center'>
              <img
                          className="max-w-none h-16 w-16 rounded-full ring-2 ring-[var(--border-default)] object-cover bg-[var(--bg-level-three)]"
                          src={
                            createCSGOImage(modalData.rowToMatch?.item_url)
                          }
                        /></div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-[var(--text-primary)]">
                    {modalData.rowToMatch.item_name}
                  </Dialog.Title>
                  <div className="mt-2 text-[var(--text-secondary)] text-lg">
                   汰换合同奖励
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--border-default)] shadow-sm px-4 py-2 bg-[var(--bg-level-two)] text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-level-three)] hover:text-[var(--text-primary)] transition-colors duration-150 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setDone()}
                >
                  完成
                </button>
              </div>
              </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
