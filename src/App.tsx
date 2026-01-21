import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/Navbar';
import { CollectionPage } from '@/components/CollectionPage';
import { useProfileListStore } from './stores/profileListStore';
import { useActiveProfileStore } from './stores/activeProfileStore';
import { LoadingPage } from './components/ui/LoadingPage';
import { EmptyPage } from './components/EmptyPage';
import { GlobalDialogs } from './components/GlobalDialogs';

export default function App() {
  const { t } = useTranslation();

  const isInitialized = useProfileListStore(state => state.isInitialized);
  const activeProfileId = useProfileListStore(state => state.activeId);

  useEffect(() => {
    document.title = `${t('app.name')} - ${t('app.tagline')}`;
  }, [t]);

  useEffect(() => {
    useProfileListStore.getState().initialize();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      useActiveProfileStore.getState().flush();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!isInitialized) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {activeProfileId ? <CollectionPage /> : <EmptyPage />}

      <GlobalDialogs />
    </div>
  );
}
