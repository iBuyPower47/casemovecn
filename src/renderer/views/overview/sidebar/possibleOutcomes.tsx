import { CashIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { classNames } from 'renderer/components/content/shared/filters/inventoryFunctions';
import { tradeUpSetPossible } from 'renderer/store/actions/tradeUpActions';

const rarityShort = {
  'Factory New': 'FN',
  'Minimal Wear': 'MW',
  'Field-Tested': 'FT',
  'Well-Worn': 'WW',
  'Battle-Scarred': 'BS',
};

export default function PossibleOutcomes() {
  const pricesResult = useSelector((state: any) => state.pricingReducer);
  const tradeUpData = useSelector((state: any) => state.tradeUpReducer);
  const settingsData = useSelector((state: any) => state.settingsReducer);
  const [outcomesRequested, setOutcomesRequested] = useState(0);
  const dispatch = useDispatch();
  console.log(
    tradeUpData.possibleOutcomes.length,
    tradeUpData.tradeUpProducts.length
  );

  let totalPrice = 0;
  tradeUpData.tradeUpProducts.forEach((element) => {
    totalPrice +=
      pricesResult.prices[element.item_name + element.item_wear_name || '']?.[
        'steam_listing'
      ];
  });
  totalPrice;

  tradeUpData.possibleOutcomes.forEach((element) => {
    element['profit_cal'] =
      (100 / (totalPrice * 100)) *
      (pricesResult?.prices[element.item_name + element.item_wear_name || '']?.[
        'steam_listing'
      ] *
        100);
  });
  tradeUpData.possibleOutcomes.sort(function (a, b) {
    var keyA = a.profit_cal,
      keyB = b.profit_cal;
    if (keyA < keyB) return 1;
    if (keyA > keyB) return -1;
    return 0;
  });

  useEffect(() => {
    const requestedCount = tradeUpData.tradeUpProducts.length;

    if (outcomesRequested === requestedCount) {
      return;
    }

    setOutcomesRequested(requestedCount);

    if (requestedCount === 0) {
      return;
    }

    window.electron.ipcRenderer
      .getPossibleOutcomes(tradeUpData.tradeUpProducts)
      .then((messageValue) => {
        dispatch(tradeUpSetPossible(messageValue));
      });
  }, [dispatch, outcomesRequested, tradeUpData.tradeUpProducts]);

  return (
    <div>
      <h2 className="text-[var(--text-tertiary)] text-xs font-medium uppercase tracking-wide">
        Possible outcomes
      </h2>
      {tradeUpData.possibleOutcomes.length != 0 ? (
        <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 ">
          {tradeUpData.possibleOutcomes.map((project, index) => (
            <li key={index} className="col-span-1 flex shadow-sm rounded-md">
              <a
                href={
                  'https://steamcommunity.com/market/listings/730/' +
                  project.item_name +
                  ' (' +
                  project.item_wear_name +
                  ')'
                }
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex-shrink-0 h-full flex items-center justify-center w-16 text-[var(--text-primary)] border-t border-l border-b border-[var(--border-default)] rounded-l-md bg-[var(--bg-level-two)]">
                  <img
                    className="max-w-none h-11 w-11  object-cover"
                    src={project.image}
                  />
                </div>
              </a>
              <div className="flex-1 bg-[var(--bg-level-two)] flex items-center justify-between border-t border-r border-b border-[var(--border-default)] rounded-r-md truncate">
                <div className="flex-1 px-4 py-2 text-sm truncate">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-primary)] font-medium hover:text-[var(--text-secondary)]">
                      {project.item_name}
                    </span>
                    <span
                      className={classNames(
                        project?.profit_cal > 100
                          ? 'bg-[var(--success)]'
                          : 'bg-[var(--error)]',
                        'w-2.5 h-2.5 flex-shrink-0 rounded-full'
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[var(--text-tertiary)]">
                      {project.percentage} % |{' '}
                      {rarityShort[project.item_wear_name]} |{' '}
                      {project.float_chance.toString()?.substr(1, 8)}
                    </p>
                    <div className="flex items-center">
                      <p className="text-[var(--text-tertiary)]">
                        <CashIcon className="w-4 text-[var(--text-tertiary)] h-4 mr-1" />
                      </p>
                      <p className="text-[var(--text-tertiary)]">
                        {new Intl.NumberFormat(settingsData.locale, {
                          style: 'decimal',
                          maximumFractionDigits: 2,
                        }).format(project?.profit_cal)}{' '}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 ">
          <li key={9999} className="col-span-1 flex shadow-sm rounded-md">
            <div className="flex-shrink-0 h-full flex items-center justify-center w-16 text-[var(--text-primary)] border-t border-l border-b border-r border-[var(--border-default)] rounded-l-md border-dotted bg-[var(--bg-level-two)]">
              <div className="max-w-none h-11 w-11  object-cover" />
            </div>
            <div className="flex-1 bg-[var(--bg-level-two)] border-dotted flex items-center justify-between border-t border-r border-b border-[var(--border-default)] rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <div className="flex justify-between">
                  <span className="text-[var(--text-primary)] font-medium hover:text-[var(--text-secondary)]">
                    Add 1 to see the results
                  </span>
                </div>
                <div className="flex justify-start">
                  <p className="text-[var(--text-tertiary)]"></p>
                  <div className="flex items-center">
                    <p className="text-[var(--text-tertiary)]">
                      Prices are the SCM prices
                    </p>
                    <p className="text-[var(--text-tertiary)]"></p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
