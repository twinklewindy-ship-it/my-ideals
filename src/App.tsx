import { useWorkingProfile } from './hooks/useWorkingProfile';

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
      <div className="p-6 space-y-8">
        <h1 className="text-xl font-bold">{working.profile.name}</h1>

        {working.collections.map(collection => (
          <section key={collection.id}>
            <h2 className="text-lg font-semibold">
              {collection.name}
            </h2>

            <ul className="space-y-1">
              {collection.items.map((item, index) => (
                <li key={index} className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={item.status}
                    onChange={() => toggleItemStatus(collection.id, index)}
                  />
                  {item.title}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
