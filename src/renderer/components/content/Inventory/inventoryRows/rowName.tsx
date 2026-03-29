import { PencilIcon, TagIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setRenameModal } from 'renderer/store/actions/modalMove actions';
import { createCSGOImage } from '../../../../functionsClasses/createCSGOImage';
import { classNames } from '../../shared/filters/inventoryFunctions';

export function RowProduct({ itemRow }) {
  const dispatch = useDispatch();
  const [itemHover, setItemHover] = useState(false);
  const itemUrl = itemRow?.item_url || '';
  let marketHashName = itemRow.item_name;
  if (itemRow.item_paint_wear != undefined) {
    marketHashName = itemRow.item_name + ' (' + itemRow.item_wear_name + ')';
  }

  return (
    <>
      <td className="table-cell px-6 py-3 max-w-0 w-full whitespace-nowrap overflow-hidden text-sm font-normal text-[var(--text-primary)]">
        <div className="flex items-center space-x-3 lg:pl-2">
          <div
            className={classNames(
              itemRow.bgColorClass,
              'flex-shrink-0 w-2.5 h-2.5 rounded-full'
            )}
            aria-hidden="true"
          />
          <a
            href={`https://steamcommunity.com/market/listings/730/${marketHashName.replaceAll(
              'Holo/Foil',
              'Holo-Foil'
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex flex-shrink-0 -space-x-1">
              <img
                onMouseEnter={() => setItemHover(true)}
                onMouseLeave={() => setItemHover(false)}
                className={classNames(
                  itemHover
                    ? 'transform-gpu hover:-translate-y-1 hover:scale-110'
                    : '',
                  'max-w-none h-11 w-11 transition duration-500 ease-in-out rounded-full ring-2 ring-transparent object-cover bg-[var(--bg-level-three)]'
                )}
                src={createCSGOImage(itemUrl)}
              />
            </div>
          </a>

          <span>
            <span className="flex">
              {itemRow.item_name !== '' ? (
                itemRow.item_customname !== null ? (
                  itemRow.item_customname
                ) : (
                  itemRow.item_chinese_name || itemRow.item_name
                )
              ) : (
                <span>
                  <a
                    href="https://forms.gle/6qZ8N2ES8CdeavcVA"
                    target="_blank"
                    className="font-medium text-[var(--accent-primary)] hover:opacity-90"
                  >
                    发生错误，请点击此处反馈。
                  </a>
                  <br />
                  <button
                    className="px-2.5 py-1.5 border border-[var(--border-default)] shadow-sm text-xs font-medium rounded text-[var(--text-secondary)] bg-[var(--bg-level-two)] hover:bg-[var(--bg-level-three)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]"
                    onClick={() =>
                      navigator.clipboard.writeText(JSON.stringify(itemRow))
                    }
                  >
                    {' '}
                    复制引用
                  </button>
                </span>
              )}
              {itemRow.item_name !== '' &&
              itemRow.item_customname !== null &&
              !itemUrl.includes('casket') ? (
                <TagIcon className="h-3 w-3  ml-1" />
              ) : (
                ''
              )}
              {itemRow.equipped_t ? (
                <span className="ml-1 h-3 leading-3 pl-1 pr-1 text-[var(--text-primary)] text-center font-medium bg-[var(--bg-level-four)] rounded-full text-xs">
                  {' '}
                  T{' '}
                </span>
              ) : (
                ''
              )}
              {itemRow.equipped_ct ? (
                <span className="ml-1 h-3 leading-3 pl-1 pr-1 text-center text-[var(--text-primary)] font-medium bg-[var(--bg-level-four)] rounded-full text-xs">
                  {' '}
                  CT{' '}
                </span>
              ) : (
                ''
              )}

              {itemUrl.includes('casket') ? (
                <Link
                  to=""
                  className="text-[var(--text-tertiary)]"
                  onClick={() =>
                    dispatch(
                      setRenameModal(
                        itemRow.item_id,
                        itemRow.item_customname !== null
                          ? itemRow.item_customname
                          : itemRow.item_name
                      )
                    )
                  }
                >
                  <PencilIcon className="h-4 w-5 pb-1" />
                </Link>
              ) : (
                ''
              )}
            </span>
            <span
              className="text-[var(--text-tertiary)]"
              title={itemRow.item_paint_wear}
            >
              {itemRow.item_customname !== null ? itemRow.item_name : ''}
              {itemRow.item_customname !== null &&
              itemRow.item_paint_wear !== undefined
                ? ' - '
                : ''}
              {itemRow.item_paint_wear !== undefined
                ? itemRow.item_wear_chinese_name
                : null}
            </span>
          </span>
        </div>
      </td>
    </>
  );
}
