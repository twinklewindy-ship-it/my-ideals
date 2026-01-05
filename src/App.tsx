import { useProfiles } from './hooks/useProfile';

export default function App() {
  const { profile, template, isLoading, error } = useProfiles('development-profile00');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile || !template) {
    return <div>Invalid state</div>;
  }

  console.log("Profile:", profile);
  console.log("Template:", template);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        My Ideals - Idol Namashashin Tracking App
      </h1>
    </div>
  );
}
