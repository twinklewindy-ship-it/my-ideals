import { ImageCheckCard } from './ImageCheckCard';

type CollectionItem = {
  member: string;
  title: string;
  status: boolean;
};

type CollectionPanelProps = {
  id: string;
  name: string;
  items: CollectionItem[];
  onToggle: (itemIndex: number) => void;
};

export function CollectionPanel({ id, name, items, onToggle }: CollectionPanelProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-500">
          {items.filter(i => i.status).length} / {items.length} 収集済み
        </p>
      </div>

      {/* Grid of cards - 6 columns */}
      <div className="p-4">
        <div
          className="
            grid grid-cols-3 lg:grid-cols-6 
            gap-2 lg:gap-4
            max-w-[360px] lg:max-w-[960px]
            mx-auto
          "
        >
          {items.map((item, index) => (
            <ImageCheckCard
              key={`${item.member}-${item.title}`}
              src={`${window.location.origin}/sample/sample_photo.png`}
              text={item.title}
              checked={item.status}
              onChange={() => onToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
