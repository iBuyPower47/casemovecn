/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { useDispatch } from 'react-redux';
import { setSteamLoginShow } from '../../store/actions/settings';
// import { LoginIcon } from '@heroicons/react/solid'

export default function SteamCloseModal({
  open,
  setOpen,
  loginWithouClosingSteam,
  setLoadingButton,
}) {
  const [isCheck, setIsCheck] = useState(false);
  console.log('isCheck', isCheck);
  const dispatch = useDispatch();

  async function setSetting() {
    if (!isCheck) {
      return;
    }
    await window.electron.store.set('steamLogin', false);
    dispatch(setSteamLoginShow(false));
  }
  async function confirm() {
    setSetting();
    setOpen(false);
    await window.electron.ipcRenderer.closeSteam();
    loginWithouClosingSteam();
  }

  async function cancel() {
    setSetting();

    setLoadingButton(false);
    setOpen(false);
  }

  console.log('open', open);

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
                    className="rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] focus:outline-none focus:ring-0"
                    onClick={() => cancel()}
                  >
                    <span className="sr-only">关闭</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  {/* <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12  sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationCircleIcon className="h-12 w-12 text-yellow-500" aria-hidden="true" />
                  </div> */}
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-[var(--text-primary)]"
                    >
                      Steam 正在运行
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-[var(--text-secondary)]">
                        您可以继续使用应用，但建议先关闭 Steam，否则 Valve
                        可能要求您重启电脑才能连接 VAC 安全服务器。
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
                    关闭并登录
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full ml-2 mr-2 inline-flex justify-center rounded-[8px] hover:bg-[var(--bg-level-four)] text-[var(--text-secondary)] shadow-sm px-4 py-2 bg-[var(--bg-level-two)] text-base font-medium border border-[var(--border-default)] transition-colors duration-150 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setSetting();
                      loginWithouClosingSteam();
                      setOpen(false);
                    }}
                  >
                    不关闭直接登录
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-[8px] hover:bg-[var(--bg-level-four)] text-[var(--text-secondary)] shadow-sm px-4 py-2 bg-[var(--bg-level-two)] text-base font-medium border border-[var(--border-default)] transition-colors duration-150 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => cancel()}
                  >
                    取消
                  </button>
                </div>
                <div className="relative mt-3 flex place-content-end">
                  <div className="mr-3 text-sm">
                    <label
                      htmlFor="comments"
                      className="font-medium text-[var(--text-tertiary)]"
                    >
                      不再显示此提示
                    </label>
                  </div>
                  <div className="flex h-5 items-center">
                    <input
                      id="comments"
                      checked={isCheck}
                      onChange={() => setIsCheck(!isCheck)}
                      name="comments"
                      type="checkbox"
                      className="h-4 w-4 rounded border-[var(--border-default)] bg-[var(--bg-level-two)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
