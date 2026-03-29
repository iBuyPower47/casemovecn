import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { tradeUpOptionsAddRemove } from 'renderer/store/actions/tradeUpActions';

let optionsAvailable = ['Hide equipped'];

export default function TradeUpOptionsDropDown() {
  const tradeUpData = useSelector((state: any) => state.tradeUpReducer);
  const dispatch = useDispatch();

  return (
    <Popover.Group className="-mx-4 flex items-center divide-x divide-[var(--border-default)]">
      <Popover className="pl-4 relative inline-block text-left">
        <Popover.Button className="group inline-flex justify-center text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          Options
          <span className="mr-1.5 ml-1.5 rounded py-0.5 px-1.5 bg-[var(--bg-level-three)] text-[var(--text-tertiary)] text-xs font-semibold tabular-nums">
            {tradeUpData.options.length}
          </span>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Popover.Panel className="origin-top-right absolute right-0 mt-2 z-20 bg-[var(--bg-level-three)] rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-[var(--border-default)] p-4 focus:outline-none">
            <form className="space-y-4">
              {optionsAvailable.map((option, optionIdx) => (
                <div key={option} className="flex items-center">
                  <input
                    id={`filter-${option}-${optionIdx}`}
                    name={`${option}[]`}
                    defaultValue={option}
                    type="checkbox"
                    checked={tradeUpData.options.includes(option)}
                    className="h-4 w-4 border-[var(--border-default)] rounded bg-[var(--bg-level-two)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                    onClick={() => dispatch(tradeUpOptionsAddRemove(option))}
                  />
                  <label
                    htmlFor={`filter-${option}-${optionIdx}`}
                    className="ml-3 pr-6 text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap"
                  >
                    {option.replace('The ', '').replace(' Collection', '')}
                  </label>
                </div>
              ))}
            </form>
          </Popover.Panel>
        </Transition>
      </Popover>
    </Popover.Group>
  );
}
