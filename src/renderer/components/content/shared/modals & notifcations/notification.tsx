/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { classNames } from '../filters/inventoryFunctions';

export default function NotificationElement({
  success,
  titleToDisplay,
  textToDisplay,
  doShow,
  setShow,
}) {
  const settingsData = useSelector((state: any) => state.settingsReducer);
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="fixed inset-0 z-[100] flex items-end px-4 py-6 pointer-events-none sm:items-start sm:p-6"
      >
        <div className={classNames(settingsData.os == 'win32' ? 'pt-7' : '', "w-full flex flex-col items-center space-y-4 sm:items-end")}>
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={doShow}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="max-w-sm foil-border noise-texture w-full shadow-modal-foil rounded-lg pointer-events-auto mt-0 lg:mt-0 md:mt-12 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {success ? (
                      <CheckCircleIcon
                        className="h-6 w-6 text-[var(--success)]"
                        aria-hidden="true"
                      />
                    ) : (
                      <XCircleIcon
                        className="h-6 w-6 text-[var(--error)]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {titleToDisplay}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {textToDisplay}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="bg-transparent rounded-md inline-flex text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors duration-150"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <span className="sr-only">关闭</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
