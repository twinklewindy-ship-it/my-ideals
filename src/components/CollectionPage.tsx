import { useState, useMemo } from 'react';
import { useActiveProfileStore } from '@/stores/activeProfileStore';
import type { Template } from '@/domain/template';
import { CollectionPanel } from './CollectionPanel';
import { LoadingPage } from './ui/LoadingPage';
import { ErrorPage } from './ui/ErrorPage';
import { CollectionFilter } from './CollectionFilter';
import { ProfileInfo } from './ProfileInfo';
import { debugLog } from '@/utils/debug';

function useFilteredCollections(
  template: Template | null,
  selectedMembers: Set<string>,
  searchQuery: string
) {
  return useMemo(() => {
    if (!template) return [];

    debugLog.store.log('Apply filter');

    const query = searchQuery.trim().toLowerCase();

    if (selectedMembers.size === 0 && !searchQuery) return template.collections;

    return template.collections
      .filter(collection => {
        if (!query) return true;
        return collection.name.toLowerCase().includes(query);
      })
      .map(collection => ({
        ...collection,
        items:
          selectedMembers.size === 0
            ? collection.items
            : collection.items.filter(item => selectedMembers.has(item.member)),
      }))
      .filter(collection => collection.items.length > 0);
  }, [template, selectedMembers, searchQuery]);
}

export function CollectionPage() {
  const profile = useActiveProfileStore(state => state.profile);
  const template = useActiveProfileStore(state => state.template);
  const isLoading = useActiveProfileStore(state => state.isLoading);
  const error = useActiveProfileStore(state => state.error);

  // const changes = useWorkingProfileStore(state => state.changes);
  // const hasChanges = changes && (changes.added.length > 0 || changes.removed.length > 0);

  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const filteredCollections = useFilteredCollections(template, selectedMembers, searchQuery);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (!template || !profile) {
    return; // This should never reached
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <ProfileInfo />
        <div className="my-4 border-t border-gray-200" />
        <CollectionFilter
          members={template.members}
          selectedMembers={selectedMembers}
          onMemberChange={setSelectedMembers}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Collections */}
      {filteredCollections.map(collection => (
        <CollectionPanel key={collection.id} collection={collection} />
      ))}

      {/* Diff Dialog */}
      {/* {createPortal(
        <ConfirmDialog
          isOpen={!!hasChanges}
          title="Template Updated"
          message={<ProfileTemplateDiffContent working={working} changes={changes} />}
          options={[{ label: 'Got it', value: 'ok', variant: 'primary' }]}
          showCancel={false}
          onSelect={() => useWorkingProfileStore.setState({ changes: null })}
          onCancel={() => useWorkingProfileStore.setState({ changes: null })}
        />,
        document.body
      )} */}
    </main>
  );
}
