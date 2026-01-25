import { useState, memo } from 'react';
import { urlFromBaseUrl, type TemplateCollectionItem } from '@/domain/template';
import { useActiveProfileStore } from '@/stores/activeProfileStore';
import { debugLog } from '@/utils/debug';

type ImageCheckCardProps = {
  collectionId: string;
  item: TemplateCollectionItem;
};

export const ImageCheckCard = memo(function ImageCheckCard({
  collectionId,
  item,
}: ImageCheckCardProps) {
  debugLog.render.log(`ImageCheckCard render: ${collectionId} ${item.id}`);

  const baseUrlConfig = useActiveProfileStore(state => state.template!.imageBaseUrl);
  const fallbackSrc = baseUrlConfig?.fallback;
  const isChecked = useActiveProfileStore(
    state => state.profile?.collections[collectionId]?.[item.id] ?? false
  );
  const toggleStatus = useActiveProfileStore(state => state.toggleStatus);

  const [imgSrc, setImgSrc] = useState(
    item.image ?? urlFromBaseUrl(`${collectionId}/${item.id}`, baseUrlConfig!)
  );
  const [showAlt, setShowAlt] = useState(false);

  return (
    <label className="relative block w-full cursor-pointer select-none">
      {/* Hidden controlling checkbox */}
      <input
        id={`${collectionId}-${item.id}`}
        type="checkbox"
        className="peer sr-only"
        checked={isChecked}
        onChange={() => toggleStatus(collectionId, item.id)}
      />

      {/* Image */}
      {showAlt ? (
        <div
          className="flex aspect-[7/10] w-full items-center justify-center rounded-md bg-gray-200
            p-2 text-center text-sm whitespace-pre-line text-gray-600 transition
            peer-not-checked:opacity-50"
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
          className="aspect-[7/10] w-full rounded-md object-cover transition
            peer-not-checked:opacity-50"
        />
      )}

      {/* Bottom bar */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-between rounded-b-md
          bg-black/50 px-1.5 py-0.5 text-[10px] text-white sm:px-2 sm:py-1 sm:text-xs"
      >
        <span className="truncate">{item.name}</span>
        {/* Visual checkbox (mirrors state) */}
        <input
          id={`dummy-${collectionId}-${item.id}`}
          readOnly
          type="checkbox"
          checked={isChecked}
          className="pointer-events-none accent-blue-600"
        />
      </div>
    </label>
  );
});
