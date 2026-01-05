import { useWorkingProfile } from './hooks/useWorkingProfile';
import { CollectionPanel } from './components/CollectionPanel';

export default function App() {
  const { working, isLoading, error, toggleItemStatus } = useWorkingProfile('development-profile00');

  if (isLoading) {
    return <div className="p-4">Loading…</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!working) {
    return <div className="p-4 text-red-600">No working profile loaded.</div>;
  }

  console.log('Active Working Profile:', working);

  return (
    <div>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">
          My Ideals - Idol Namashashin Tracking App
        </h1>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {working.collections.map(collection => (
          <CollectionPanel
            key={collection.id}
            id={collection.id}
            name={collection.name}
            items={collection.items}
            onToggle={(itemIndex) => toggleItemStatus(collection.id, itemIndex)}
          />
        ))}
      </main>
    </div>
  );
}
