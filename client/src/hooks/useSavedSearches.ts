import { useState, useEffect, useCallback } from 'react';

export interface SavedSearch {
  id: string;
  keyword: string;
  nicheId?: string;
  nicheName?: string;
  createdAt: string;
  notes?: string;
  collection?: string;
}

const STORAGE_KEY = 'niche-scout-saved-searches';

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever searches change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSearches));
    }
  }, [savedSearches, isLoading]);

  const addSearch = useCallback(
    (search: Omit<SavedSearch, 'id' | 'createdAt'>) => {
      const newSearch: SavedSearch = {
        ...search,
        id: `search-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setSavedSearches((prev) => [newSearch, ...prev]);
      return newSearch;
    },
    []
  );

  const removeSearch = useCallback((id: string) => {
    setSavedSearches((prev) => prev.filter((search) => search.id !== id));
  }, []);

  const updateSearch = useCallback(
    (id: string, updates: Partial<Omit<SavedSearch, 'id' | 'createdAt'>>) => {
      setSavedSearches((prev) =>
        prev.map((search) =>
          search.id === id ? { ...search, ...updates } : search
        )
      );
    },
    []
  );

  const getCollections = useCallback(() => {
    const collections = new Set<string>();
    savedSearches.forEach((search) => {
      if (search.collection) {
        collections.add(search.collection);
      }
    });
    return Array.from(collections);
  }, [savedSearches]);

  const getByCollection = useCallback(
    (collection: string) => {
      return savedSearches.filter((search) => search.collection === collection);
    },
    [savedSearches]
  );

  const clearAll = useCallback(() => {
    setSavedSearches([]);
  }, []);

  return {
    savedSearches,
    isLoading,
    addSearch,
    removeSearch,
    updateSearch,
    getCollections,
    getByCollection,
    clearAll,
  };
}
