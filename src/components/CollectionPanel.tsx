import { memo } from 'react';
import { type TemplateCollection } from '@/domain/template';
import { ImageCheckCard } from './ImageCheckCard';
import { debugLog } from '@/utils/debug';

type CollectionPanelProps = {
  collection: TemplateCollection;
};

export const CollectionPanel = memo(function CollectionPanel({ collection }: CollectionPanelProps) {
  debugLog.render.log(`CollectionPanel render: ${collection.id}`);

  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-800">{collection.name}</h2>
        {/* <p className="text-sm text-gray-500">
          {collection.items.filter(i => i.status).length} / {items.length} 収集済み
        </p> */}
      </div>

      {/* Grid of cards */}
      <div className="p-4">
        <div
          className="mx-auto grid max-w-[360px] grid-cols-3 gap-2 lg:max-w-[960px] lg:grid-cols-6
            lg:gap-4"
        >
          {collection.items.map(item => (
            <ImageCheckCard key={item.id} collectionId={collection.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
});
