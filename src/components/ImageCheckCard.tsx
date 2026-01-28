import { useState, memo } from 'react';
import { urlFromBaseUrl, type TemplateCollectionItem } from '@/domain/template';
import { useActiveProfileStore } from '@/stores/activeProfileStore';
import { debugLog } from '@/utils/debug';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ProfileFlags, profileHasFlag } from '@/domain/profile';
import { normalizeStatus } from '@/utils/utils';

type ImageCheckCardProps = {
  collectionId: string;
  item: TemplateCollectionItem;
};

export const ImageCheckCard = memo(function ImageCheckCard({
  collectionId,
  item,
}: ImageCheckCardProps) {
  debugLog.render.log(`ImageCheckCard render: ${collectionId} ${item.id}`);

  const enableCount = useActiveProfileStore(state =>
    profileHasFlag(state.profile!, ProfileFlags.ENABLE_COUNT)
  );

  const baseUrlConfig = useActiveProfileStore(state => state.template!.imageBaseUrl);
  const fallbackSrc = baseUrlConfig?.fallback;

  const status = useActiveProfileStore(
    state => state.profile?.collections[collectionId]?.[item.id] ?? (enableCount ? 0 : false)
  );
  const toggleStatus = useActiveProfileStore(state => state.toggleStatus);
  const setCount = useActiveProfileStore(state => state.setCount);

  const [imgSrc, setImgSrc] = useState(
    item.image ?? urlFromBaseUrl(`${collectionId}/${item.id}`, baseUrlConfig!)
  );
  const [showAlt, setShowAlt] = useState(false);

  return (
    <div
      className={`flex w-full flex-col overflow-hidden rounded-md
        ${!enableCount ? 'cursor-pointer' : ''}`}
      onClick={() => {
        if (!enableCount) toggleStatus(collectionId, item.id);
      }}
    >
      {/* Image */}
      <div className="relative">
        {showAlt ? (
          <div
            className={`flex aspect-[7/10] w-full items-center justify-center bg-gray-200 p-2
              text-center text-sm whitespace-pre-line text-gray-600 transition ${
                !normalizeStatus(status) && 'opacity-50'
              }`}
          >
            {item.name.split(' ').join('\n')}
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={item.name}
            loading="lazy"
            decoding="async"
            onError={() =>
              fallbackSrc && imgSrc !== fallbackSrc ? setImgSrc(fallbackSrc) : setShowAlt(true)
            }
            className={`aspect-[7/10] w-full object-cover transition
              ${!normalizeStatus(status) && 'opacity-50'}`}
          />
        )}

        {/* Bottom bar */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/50
            px-1.5 py-0.5 text-[10px] text-white sm:px-2 sm:py-1 sm:text-xs"
        >
          <span className="truncate">{item.name}</span>
          {!enableCount && (
            <input
              id={`dummy-${collectionId}-${item.id}`}
              readOnly
              type="checkbox"
              checked={normalizeStatus(status)}
              className="pointer-events-none accent-blue-600"
            />
          )}
        </div>
      </div>

      {/* Counter */}
      {enableCount && typeof status === 'number' && (
        <div className="flex items-center justify-between bg-gray-100 px-1 py-1 sm:px-1.5">
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded text-gray-500 transition
              hover:bg-gray-200 active:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-30
              sm:h-7 sm:w-7"
            onClick={e => {
              e.stopPropagation();
              setCount(collectionId, item.id, status - 1);
            }}
            disabled={status === 0}
          >
            <MinusIcon className="h-4 w-4" />
          </button>

          <span
            className="min-w-[2rem] text-center text-sm font-semibold text-gray-700 tabular-nums
              sm:text-base"
          >
            {status}
          </span>

          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded text-gray-500 transition
              hover:bg-gray-200 active:bg-gray-300 sm:h-7 sm:w-7"
            onClick={e => {
              e.stopPropagation();
              setCount(collectionId, item.id, status + 1);
            }}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
});
