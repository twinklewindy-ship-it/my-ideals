import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { type TemplateCollection } from '@/domain/template';
import { ImageCheckCard } from './ImageCheckCard';
import { debugLog } from '@/utils/debug';
import { useActiveProfileStore } from '@/stores/activeProfileStore';

type CollectionPanelProps = {
  collection: TemplateCollection;
};

export const CollectionPanel = memo(function CollectionPanel({ collection }: CollectionPanelProps) {
  debugLog.render.log(`CollectionPanel render: ${collection.id}`);

  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const layout = collection.layout ?? useActiveProfileStore.getState().template?.layout;

  const statusMap = useActiveProfileStore(state => state.profile?.collections[collection.id]);
  const stats = useMemo(() => {
    let checked = 0;
    for (const item of collection.items) {
      if (statusMap?.[item.id]) {
        checked++;
      }
    }
    return { total: collection.items.length, checked };
  }, [collection.items, statusMap]);

  const handleCopy = () => {
    // 复制标题文本到剪贴板
    navigator.clipboard.writeText(collection.name).then(() => {
      // 变身！显示打钩
      setCopied(true);
      // 3秒后变回原样
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }).catch(err => {
      console.error('复制失败:', err);
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-md font-semibold text-gray-800 sm:text-lg">{collection.name}</h2>
          
          {/* G老师新增：复制按钮 */}
          <button
            onClick={handleCopy}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none transition-colors"
            title="复制标题"
          >
            {copied ? (
              <CheckIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ClipboardDocumentIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <p className="text-sm text-gray-500">
          {t('collection.collected', { count: stats.checked, total: stats.total })}
        </p>
      </div>

      {/* Grid of cards */}
      <div className="p-4">
        <div
          className="mx-auto grid max-w-[480px] grid-cols-[repeat(var(--cols),minmax(0,1fr))]
            gap-[var(--gap)] [--cols:var(--cols-sm)] [--gap:calc(6*var(--spacing)/var(--cols))]
            lg:max-w-[960px] lg:[--cols:var(--cols-lg)]
            lg:[--gap:calc(24*var(--spacing)/var(--cols))]"
          style={
            {
              '--cols-sm': layout?.columns?.[0] ?? 3,
              '--cols-lg': layout?.columns?.[1] ?? 6,
            } as React.CSSProperties
          }
        >
          {collection.items.map(item => (
            <ImageCheckCard
              key={`${collection.id}-${item.id}`}
              collectionId={collection.id}
              item={item}
              aspectRatio={layout?.aspectRatio}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
