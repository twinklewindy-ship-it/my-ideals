import { useMemo, useState, useDeferredValue } from 'react';
import { useActiveProfileStore } from '@/stores/activeProfileStore';
import { debugLog } from '@/utils/debug';
import { normalizeStatus } from '@/utils/utils';

function useFilteredCollections(searchQuery: string, hideCompleted: boolean, selectedCategory: string | null) {
  const collections = useActiveProfileStore(state => state.template?.collections);
  const selectedMembers = useActiveProfileStore(state => state.profile?.selectedMembers);

  return useMemo(() => {
    if (!collections) return [];

    const selected = new Set(selectedMembers);
    const query = searchQuery.trim().toLowerCase();
    // 如果没有任何筛选条件，直接返回
    if (selected.size === 0 && !searchQuery && !hideCompleted && !selectedCategory) {
      return collections;
    }

    debugLog.store.log('Apply filter');
    debugLog.store.time('filter');

    const cachedStatus = hideCompleted
      ? useActiveProfileStore.getState().profile?.collections
      : null;

    const result = collections.reduce<typeof collections>((acc, collection) => {
      // 1.关键词筛选
      if (query && !collection.name.toLowerCase().includes(query)) {
        return acc;
      }
      // 2.分类筛选
      if (selectedCategory && collection.category !== selectedCategory) {
        return acc;
      }

      const items =
        selected.size === 0
          ? collection.items
          : collection.items.filter(item =>
              typeof item.member === 'string'
                ? selected.has(item.member)
                : item.member.some(m => selected.has(m))
            );

      if (items.length == 0) {
        return acc;
      }

      if (hideCompleted && cachedStatus) {
        const status = cachedStatus[collection.id] ?? {};
        if (items.every(item => normalizeStatus(status[item.id]) === true)) {
          return acc;
        }
      }

      acc.push({ ...collection, items });
      return acc;
    }, []);

    debugLog.store.timeEnd('filter');
    return result;
  }, [collections, selectedMembers, searchQuery, hideCompleted, selectedCategory]);
}

export function useCollectionFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(searchQuery);
  const filteredCollections = useFilteredCollections(deferredQuery, hideCompleted, selectedCategory);

  return {
    filterProps: {
      searchQuery,
      setSearchQuery,
      hideCompleted,
      setHideCompleted,
      selectedCategory,   
      setSelectedCategory, 
    },
    filteredCollections,
  };
}
