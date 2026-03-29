import { CheckIcon, XIcon } from '@heroicons/react/solid';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RequestPrices } from 'renderer/functionsClasses/prices';
import { State } from 'renderer/interfaces/states';
import { moveToAddRemove } from 'renderer/store/actions/moveToActions';
import { RowCollections } from '../../Inventory/inventoryRows/collectionsRow';
import { RowFloat } from '../../Inventory/inventoryRows/floatRow';
import { RowPrice } from '../../Inventory/inventoryRows/priceRow';
import { RowQTY } from '../../Inventory/inventoryRows/QTYRow';
import { RowRarity } from '../../Inventory/inventoryRows/rarityRow';
import { RowProduct } from '../../Inventory/inventoryRows/rowName';
import { RowStickersPatches } from '../../Inventory/inventoryRows/stickerPatchesRow';
import { RowTradehold } from '../../Inventory/inventoryRows/tradeholdRow';
import { classNames } from '../../shared/filters/inventoryFunctions';

function content({ projectRow, index }: { projectRow: any; index: number }) {
  const dispatch = useDispatch();
  const toReducer = useSelector((state: State) => state.moveToReducer);
  const pricesResult = useSelector((state: State) => state.pricingReducer);
  const settingsData = useSelector((state: State) => state.settingsReducer);

  async function returnField(fieldValue) {
    if (toReducer.activeStorages.length == 0) {
      return;
    }
    fieldValue = parseInt(fieldValue);
    let totalToGo = 1000 - toReducer.activeStoragesAmount;
    for (const [, value] of Object.entries(toReducer.totalToMove)) {
      let valued = value as any;
      console.log(valued);
      if (valued[0] != projectRow.item_id) {
        totalToGo -= valued[2].length;
      }
    }

    let returnValue = 0;
    let totalMax = projectRow.combined_QTY;
    if (projectRow.combined_QTY > totalToGo) {
      totalMax = totalToGo;
    }
    if (fieldValue > totalMax) {
      returnValue = totalMax;
    } else if (fieldValue < 0) {
      returnValue = 0;
    } else {
      if (isNaN(fieldValue)) {
        returnValue = 0;
      } else {
        returnValue = fieldValue;
      }
    }

    let listToReturn = [] as any;
    if (returnValue > 0) {
      listToReturn = projectRow.combined_ids.slice(0, returnValue);
    }

    dispatch(
      moveToAddRemove(
        projectRow.storage_id,
        projectRow.item_id,
        listToReturn,
        projectRow.item_name
      )
    );
  }

  useEffect(() => {
    const pricingClass = new RequestPrices(
      dispatch,
      settingsData,
      pricesResult
    );
    pricingClass.handleRequested(projectRow);
  }, [dispatch, pricesResult, projectRow, settingsData]);

  const isEmpty =
    toReducer.totalToMove.filter((row) => row[0] == projectRow.item_id)
      .length == 0;

  let totalFieldValue = 0;
  if (isEmpty == false) {
    totalFieldValue = toReducer.totalToMove.filter(
      (row) => row[0] == projectRow.item_id
    )[0][2].length;
  }

  return (
    <>
      <RowProduct itemRow={projectRow} />
      <RowCollections itemRow={projectRow} settingsData={settingsData} />
      <RowPrice
        itemRow={projectRow}
        settingsData={settingsData}
        pricesReducer={pricesResult}
      />
      <RowStickersPatches itemRow={projectRow} settingsData={settingsData} />
      <RowFloat itemRow={projectRow} settingsData={settingsData} />
      <RowRarity itemRow={projectRow} settingsData={settingsData} />
      <RowTradehold itemRow={projectRow} settingsData={settingsData} />
      <RowQTY itemRow={projectRow} />
      <td className="table-cell px-6 py-3 whitespace-nowrap text-sm text-[var(--text-secondary)] text-right">
        <div className="flex justify-center rounded-full drop-shadow-lg">
          <div>
            <input
              type="text"
              name="postal-code"
              id="postal-code"
              autoComplete="off"
              value={
                isEmpty
                  ? ''
                  : toReducer.totalToMove.filter(
                      (row) => row[0] == projectRow.item_id
                    )[0][2].length
              }
              placeholder="0"
              onChange={(e) => returnField(e.target.value)}
              className="block w-full border rounded sm:text-sm text-[var(--text-primary)] text-center border-[var(--border-default)] bg-[var(--bg-level-two)]"
            />
          </div>
        </div>
      </td>
      <td className="table-cell px-6 py-3 text-sm text-[var(--text-secondary)] font-medium">
        <div className="flex justify-center">
          <button
            onClick={() => returnField(1000)}
            title="选择"
            id={`fire-${index}`}
            className={classNames(
              1000 -
                toReducer.activeStoragesAmount -
                toReducer.totalItemsToMove ==
                0 || totalFieldValue == projectRow.combined_QTY
                ? 'pointer-events-none hidden'
                : ''
            )}
          >
            <CheckIcon
              className={classNames(
                isEmpty ? 'h-5 w-5' : 'h-4 w-4',
                'text-[var(--text-tertiary)] hover:text-[var(--warning)]'
              )}
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => returnField(0)}
            title="取消"
            id={`removeX-${index}`}
            className={classNames(isEmpty ? 'pointer-events-none hidden' : '')}
          >
            <XIcon
              className={classNames(
                1000 -
                  toReducer.activeStoragesAmount -
                  toReducer.totalItemsToMove ==
                  0 || totalFieldValue == projectRow.combined_QTY
                  ? 'h-5 w-5'
                  : 'h-4 w-4',
                'text-[var(--text-tertiary)] hover:text-[var(--error)]'
              )}
              aria-hidden="true"
            />
          </button>
        </div>
      </td>
      <td className="hidden md:px-6 py-3 whitespace-nowrap text-right text-sm font-medium"></td>
    </>
  );
}
export default function StorageRow(projects) {
  return content(projects);
}
