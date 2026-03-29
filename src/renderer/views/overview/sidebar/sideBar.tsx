import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { classNames } from 'renderer/components/content/shared/filters/inventoryFunctions';
import { tradeUpAddRemove } from 'renderer/store/actions/tradeUpActions';
import { createCSGOImage } from '../../../functionsClasses/createCSGOImage';
import PossibleOutcomes from './possibleOutcomes';

export default function TradeUpSideBar() {
  const tradeUpData = useSelector((state: any) => state.tradeUpReducer);
  const [itemHover, setItemHover] = useState('');
  const dispatch = useDispatch();

  let totalFloat = 0;
  tradeUpData.tradeUpProducts.forEach((element) => {
    totalFloat += element.item_paint_wear;
  });
  totalFloat = totalFloat / tradeUpData.tradeUpProducts.length;

  let productsToUse = [...tradeUpData.tradeUpProducts];

  while (true) {
    if (productsToUse.length != 10) {
      productsToUse.push({ item_name: 'EMPTY' });
    } else {
      break;
    }
  }

  return (
    <div>
      <div className="px-4 py-5 border-b border-[var(--border-default)] sm:px-6 bg-[var(--bg-level-two)] items-center">
        <div className="flex justify-center items-center">
          <div className="">
            <div className="flex items-center flex-nowrap">
              {productsToUse.map((projectRow) => (
                <div
                  className="flex flex-shrink-0 -space-x-1"
                  key={projectRow.item_id}
                >
                  {projectRow.item_name == 'EMPTY' ? (
                    <div
                      className={classNames(
                        'max-w-none h-8 w-8 rounded-full object-cover border border-[var(--border-default)] border-dashed'
                      )}
                    />
                  ) : (
                    <button
                      title={projectRow.item_paint_wear
                        ?.toString()
                        ?.substr(0, 9)}
                      onClick={() => dispatch(tradeUpAddRemove(projectRow))}
                    >
                      <img
                        onMouseEnter={() => setItemHover(projectRow.item_id)}
                        onMouseLeave={() => setItemHover('')}
                        className={classNames(
                          itemHover == projectRow.item_id
                            ? 'transform-gpu hover:-translate-y-1 hover:scale-110'
                            : '',
                          'max-w-none h-8 w-8 transition duration-500 ease-in-out rounded-full ring-2 ring-transparent object-cover bg-[var(--bg-level-two)]'
                        )}
                        src={createCSGOImage(projectRow.item_url)}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-5">
        <PossibleOutcomes />
      </div>
    </div>
  );
}
