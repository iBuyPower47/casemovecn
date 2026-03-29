/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  cancelModal,
  closeMoveModal,
  modalResetStorageIdsToClearFrom,
  moveModalAddToFail,
  moveModalResetPayload,
  moveModalUpdate,
} from 'renderer/store/actions/modalMove actions';
import {
  moveFromClearAll,
  moveFromReset,
} from 'renderer/store/actions/moveFromActions';
import { moveToClearAll } from 'renderer/store/actions/moveToActions';

export default function MoveModal() {
  const waitTime = 100;
  const refreshDelayMs = 250;
  const refreshFollowUpMs = 900;
  const processedPayloadRef = useRef('');
  const previousStorageRef = useRef('');
  const dispatch = useDispatch();
  const modalData = useSelector((state: any) => state.modalMoveReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);

  async function cancelMe() {
    window.electron.ipcRenderer.refreshInventory();
    dispatch(closeMoveModal());
    dispatch(cancelModal(modalData.modalPayload['key']));
    dispatch(closeMoveModal());

    if (modalData.modalPayload['type'] == 'to') {
      dispatch(moveToClearAll());
    }
    if (modalData.modalPayload['type'] == 'from') {
      dispatch(moveFromClearAll());
    }

    dispatch(modalResetStorageIdsToClearFrom());
    dispatch(moveModalResetPayload());
  }

  const fastMode = settingsData.fastMove;

  async function runModal() {
    if (!modalData.moveOpen) {
      return;
    }

    if (modalData.doCancel.includes(modalData.modalPayload['key'])) {
      return;
    }

    if (modalData.modalPayload['type'] == 'to') {
      if (fastMode && modalData.query.length > 1) {
        window.electron.ipcRenderer.moveToStorageUnit(
          modalData.modalPayload['storageID'],
          modalData.modalPayload['itemID'],
          true
        );
        await new Promise((r) => setTimeout(r, waitTime));
      } else {
        try {
          await window.electron.ipcRenderer.moveToStorageUnit(
            modalData.modalPayload['storageID'],
            modalData.modalPayload['itemID'],
            false
          );
        } catch {
          dispatch(moveModalAddToFail());
        }
      }

      dispatch(moveModalUpdate());
      if (modalData.modalPayload['isLast']) {
        dispatch(moveToClearAll());
      }
    }

    if (modalData.modalPayload['type'] == 'from') {
      if (fastMode) {
        window.electron.ipcRenderer.moveFromStorageUnit(
          modalData.modalPayload['storageID'],
          modalData.modalPayload['itemID'],
          true
        );
        await new Promise((r) => setTimeout(r, waitTime));
      } else {
        try {
          await window.electron.ipcRenderer.moveFromStorageUnit(
            modalData.modalPayload['storageID'],
            modalData.modalPayload['itemID'],
            false
          );
        } catch {
          dispatch(moveModalAddToFail());
        }
      }

      dispatch(moveModalUpdate());
    }

    if (modalData.modalPayload['isLast']) {
      await new Promise((resolve) => setTimeout(resolve, refreshDelayMs));
      window.electron.ipcRenderer.refreshInventory();
      setTimeout(() => {
        window.electron.ipcRenderer.refreshInventory();
      }, refreshFollowUpMs);
    }
  }

  useEffect(() => {
    const itemID = modalData.modalPayload?.itemID;
    const operationKey = modalData.modalPayload?.key || '';
    const payloadKey = itemID ? `${operationKey}:${itemID}` : '';

    if (!modalData.moveOpen || !itemID || payloadKey === processedPayloadRef.current) {
      return;
    }

    if (
      modalData.modalPayload?.type === 'from' &&
      modalData.modalPayload?.storageID !== previousStorageRef.current
    ) {
      dispatch(moveFromReset());
    }

    previousStorageRef.current = modalData.modalPayload?.storageID || '';
    processedPayloadRef.current = payloadKey;
    runModal();
  }, [dispatch, fastMode, modalData]);

  const devMode = false;

  return (
    <Transition.Root
      show={
        modalData.doCancel.includes(modalData.modalPayload['key'])
          ? false
          : Object.keys(modalData.modalPayload).length == 0
          ? devMode
          : modalData.moveOpen
      }
      as={Fragment}
    >
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => cancelMe()}
      >
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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

          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
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
            <div className="inline-block transform overflow-hidden rounded-xl foil-border noise-texture px-4 pt-5 pb-4 text-left align-bottom shadow-modal-foil transition-all sm:my-8 sm:w-full sm:max-w-sm sm:align-middle sm:p-6">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-primary)]">
                  <span className="absolute inline-flex h-14 w-14 animate-ping rounded-full opacity-75 bg-[var(--accent-primary)]"></span>
                  <span className="text-black font-semibold">
                    {modalData.modalPayload['number']}
                  </span>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-[var(--text-primary)]"
                  >
                    {modalData.modalPayload['name']}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-[var(--text-secondary)]">
                      请等待应用移动您的物品，
                      {fastMode == false
                        ? ' \n想要加快速度？请在设置中启用快速移动。'
                        : ' \n更多工具请加入QQ群！'}
                    </p>

                    {modalData.totalFailed == 0 ? (
                      ''
                    ) : (
                      <p className="text-sm text-[var(--error)]">
                        失败总数: {modalData.totalFailed}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-level-two)] px-4 py-2 text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-level-three)] hover:text-[var(--text-primary)] transition-colors duration-150 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => cancelMe()}
                >
                  取消
                </button>
              </div>
              <div className="mr-3 mt-2 flex flex-wrap content-center items-center justify-center text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]"></div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
