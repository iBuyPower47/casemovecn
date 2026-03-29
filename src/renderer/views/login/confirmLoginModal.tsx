/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { LoginIcon } from '@heroicons/react/solid';
import { handleSuccess } from './HandleSuccess';
import {
  LoginCommand,
  LoginCommandReturnPackage,
} from 'shared/Interfaces.tsx/store';
import { useDispatch, useSelector } from 'react-redux';
import { State } from 'renderer/interfaces/states';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';

export default function ConfirmModal({ open, setOpen, setLoadingButton }) {
  const dispatch = useDispatch();
  const currentState: State = new ReducerManager(useSelector).getStorage();
  async function confirm() {
    setLoadingButton(true);
    setOpen(false);
    window.electron.ipcRenderer.forceLogin();
    let responseStatus: LoginCommand =
      await window.electron.ipcRenderer.forceLoginReply();
    handleSuccess(
      responseStatus.returnPackage as LoginCommandReturnPackage,
      dispatch,
      currentState
    );
  }

  async function cancel() {
    window.electron.ipcRenderer.logUserOut();
    setLoadingButton(false);
    setOpen(false);
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => cancel()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative foil-border noise-texture rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-modal-foil transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                    onClick={() => cancel()}
                  >
                    <span className="sr-only">关闭</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-[#FFD700] via-[#A855F7] to-[#38BDF8] sm:mx-0 sm:h-10 sm:w-10">
                    <LoginIcon
                      className="h-6 w-6 text-black"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-[var(--text-primary)]"
                    >
                      确认登录
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-[var(--text-secondary)]">
                        您的账号当前正在其他地方游戏中。是否要在此处登录？这将注销另一个实例。
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-[8px] bg-gradient-to-r from-[#FFD700] via-[#A855F7] to-[#38BDF8] text-black shadow-foil hover:brightness-[1.08] px-4 py-2 text-base font-semibold sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => confirm()}
                  >
                    登录
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-[8px] border border-[var(--border-default)] hover:bg-[var(--bg-level-four)] text-[var(--text-secondary)] shadow-sm px-4 py-2 bg-[var(--bg-level-two)] text-base font-medium transition-colors duration-150 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => cancel()}
                  >
                    取消
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
