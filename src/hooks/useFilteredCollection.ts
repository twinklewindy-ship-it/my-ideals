import { useMemo, useState, useDeferredValue } from 'react';
import { useActiveProfileStore } from '@/stores/activeProfileStore';
import { debugLog } from '@/utils/debug';

function useFilteredCollections(searchQuery: string, hideCompleted: boolean) {
  const collections = useActiveProfileStore(state => state.template?.collections);
  const selectedMembers = useActiveProfileStore(state => state.profile?.selectedMembers);

  return useMemo(() => {
    if (!collections) return [];

    const selected = new Set(selectedMembers);
    const query = searchQuery.trim().toLowerCase();

    if (selected.size === 0 && !searchQuery) return collections;

    debugLog.store.log('Apply filter');
    debugLog.store.time('filter');

    const cachedStatus = hideCompleted
      ? useActiveProfileStore.getState().profile?.collections
      : null;

    const result = collections.reduce<typeof collections>((acc, collection) => {
      if (query && !collection.name.toLowerCase().includes(query)) {
        return acc;
      }

      const items =
        selected.size === 0
          ? collection.items
          : collection.items.filter(item => selected.has(item.member));

      if (items.length == 0) {
        return acc;
      }

      if (hideCompleted && cachedStatus) {
        const status = cachedStatus[collection.id] ?? {};
        if (items.every(item => status[item.id] === true)) {
          return acc;
        }
      }

      acc.push({ ...collection, items });
      return acc;
    }, []);

    debugLog.store.timeEnd('filter');
    return result;
  }, [collections, selectedMembers, searchQuery, hideCompleted]);
}

export function useCollectionFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  const deferredQuery = useDeferredValue(searchQuery);
  const filteredCollections = useFilteredCollections(deferredQuery, hideCompleted);

  return {
    filterProps: {
      searchQuery,
      setSearchQuery,
      hideCompleted,
      setHideCompleted,
    },
    filteredCollections,
  };
}
