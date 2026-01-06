import { Navbar } from './components/Navbar';
import { CollectionPage } from './components/CollectionPage';
import { useProfileManager } from './hooks/useProfileManager';

export default function App() {
  const { profileIndex, setActiveProfile } = useProfileManager();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar profileIndex={profileIndex} onSelectProfile={setActiveProfile} />

      <main>
        {profileIndex.active ? (
          <CollectionPage profileId={profileIndex.active} />
        ) : (
          <div className="flex h-[calc(100vh-56px)] items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">No Profile Selected</h2>
              <p className="mt-2 text-gray-500">Create or import a profile to get started</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
