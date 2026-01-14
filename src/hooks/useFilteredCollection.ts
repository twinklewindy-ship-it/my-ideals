import { useMemo } from 'react';
import { useActiveProfileStore } from '@/stores/activeProfileStore';
import { debugLog } from '@/utils/debug';

export function useFilteredCollections(selectedMembers: Set<string>, searchQuery: string) {
  const collections = useActiveProfileStore(state => state.template?.collections);
  return useMemo(() => {
    if (!collections) return [];

    debugLog.store.log('Apply filter');

    const query = searchQuery.trim().toLowerCase();

    if (selectedMembers.size === 0 && !searchQuery) return collections;

    return collections.reduce<typeof collections>((acc, collection) => {
      if (query && !collection.name.toLowerCase().includes(query)) {
        return acc;
      }

      const items =
        selectedMembers.size === 0
          ? collection.items
          : collection.items.filter(item => selectedMembers.has(item.member));

      if (items.length > 0) {
        acc.push({ ...collection, items });
      }

      return acc;
    }, []);
  }, [collections, selectedMembers, searchQuery]);
}
