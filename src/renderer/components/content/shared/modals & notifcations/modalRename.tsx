/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { closeRenameModal } from 'renderer/store/actions/modalMove actions';
import { classNames } from '../filters/inventoryFunctions';
import { createCSGOImage } from '../../../../functionsClasses/createCSGOImage';

export default function RenameModal() {

  const dispatch = useDispatch();
  const modalData = useSelector((state: any) => state.modalRenameReducer);

  async function renameStorageUnit(newName) {
    console.log(modalData.modalPayload.casketID, newName);
    await window.electron.ipcRenderer.renameStorageUnit(
      modalData.modalPayload.itemID,
      newName
    );
    dispatch(closeRenameModal());
  }
  renameStorageUnit


  const [inputState, setInputState] = useState('');
  return (
    <Transition.Root show={modalData.renameOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => dispatch(closeRenameModal())}
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
                <div className="mx-auto flex items-center justify-center h-16 w-16">
                  <img
                    className="w-16 text-[var(--accent-primary)]"
                    src={
                      createCSGOImage("econ/tools/casket")
                    }
                  ></img>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-[var(--text-primary)]"
                  ></Dialog.Title>
                  <div className="pl-20 pr-20 mt-2">
                    <div className="relative border border-[var(--border-default)] rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-[var(--accent-primary)] focus-within:border-[var(--accent-primary)]">
                      <label
                        htmlFor="name"
                        className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-[var(--bg-level-two)] text-xs font-medium text-[var(--text-secondary)]"
                      >
                        新名称
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block w-full border-0 p-0 focus:outline-none bg-[var(--bg-level-two)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:ring-0 sm:text-sm"
                        placeholder={modalData.modalPayload.itemName}
                        onChange={(e) => setInputState(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className={classNames(
                    inputState.length == 0
                      ? 'pointer-events-none bg-[var(--bg-level-three)] text-[var(--text-disabled)]'
                      : 'bg-[var(--accent-primary)] text-black hover:opacity-90',
                    'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium transition-all duration-150 sm:col-start-2 sm:text-sm'
                  )}
                  onClick={() => renameStorageUnit(inputState)}
                >
                  确认
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-[var(--border-default)] shadow-sm px-4 py-2 bg-[var(--bg-level-two)] text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-level-three)] hover:text-[var(--text-primary)] transition-colors duration-150 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => dispatch(closeRenameModal())}
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
