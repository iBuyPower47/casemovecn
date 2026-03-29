import { useState } from 'react';
import { createCSGOImage } from '../../../../functionsClasses/createCSGOImage';
import { classNames } from '../../shared/filters/inventoryFunctions';

export function RowStickersPatches({ itemRow, settingsData }) {
  const [stickerHover, setStickerHover] = useState('');

  return (
    <>
      {settingsData.columns.includes('Stickers/patches') ? (
        <td className="hidden xl:table-cell px-6 py-3 text-sm text-[var(--text-secondary)] font-medium">
          <div className="flex items-center space-x-2 justify-center rounded-full drop-shadow-lg">
            <div className="flex flex-shrink-0 -space-x-1">
              {itemRow.stickers?.map((sticker, index) => (
                <a
                  key={index}
                  href={`https://steamcommunity.com/market/listings/730/${sticker.sticker_type} | ${sticker.sticker_name}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    key={index}
                    onMouseEnter={() =>
                      setStickerHover(index + itemRow.item_id)
                    }
                    onMouseLeave={() => setStickerHover('')}
                    className={classNames(
                      stickerHover == index + itemRow.item_id
                        ? 'transform-gpu hover:-translate-y-1 hover:scale-110'
                        : '',
                      'max-w-none h-8 w-8 rounded-full hover:shadow-sm transition duration-500 ease-in-out ring-2 object-cover ring-transparent bg-[var(--bg-level-three)]'
                    )}
                    src={createCSGOImage(sticker.sticker_url)}
                    alt={sticker.sticker_name}
                    title={sticker.sticker_name}
                  />
                </a>
              ))}
              {/* 显示 charm，样式和上面一致 */}
              {itemRow.keychain && (
                <a
                  href={`https://steamcommunity.com/market/listings/730/Charm | ${itemRow.keychain.keychain_name}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    onMouseEnter={() =>
                      setStickerHover('keychain-' + itemRow.item_id)
                    }
                    onMouseLeave={() => setStickerHover('')}
                    className={classNames(
                      stickerHover === 'keychain-' + itemRow.item_id
                        ? 'transform-gpu hover:-translate-y-1 hover:scale-110'
                        : '',
                      'max-w-none h-8 w-8 rounded-full hover:shadow-sm transition duration-500 ease-in-out ring-2 object-cover ring-transparent bg-[var(--bg-level-three)]'
                    )}
                    src={createCSGOImage(itemRow.keychain.keychain_url)} // 假设你能通过 ID 获取图片
                    alt={itemRow.keychain.keychain_name}
                    title={itemRow.keychain.keychain_name}
                  />
                </a>
              )}
            </div>
          </div>
        </td>
      ) : null}
    </>
  );
}
