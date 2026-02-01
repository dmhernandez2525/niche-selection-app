import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { SavedSearch } from '@/hooks/useSavedSearches';
import {
  demoNicheResults,
  demoNiches,
  demoAnalyses,
  demoSavedSearches,
  getDemoTopNiches,
  getDemoLatestAnalyses,
  filterDemoNicheResults,
} from './data';
import type { NicheResult, Niche, Analysis } from '@/lib/api';

interface DemoContextValue {
  isDemo: boolean;
  // Niche results for Niche Finder
  nicheResults: NicheResult[];
  filterNicheResults: (searchTerm: string) => void;
  // Niches
  niches: Niche[];
  // Analyses
  analyses: Analysis[];
  topNiches: Analysis[];
  latestAnalyses: Analysis[];
  getAnalysisById: (id: string) => Analysis | undefined;
  // Saved searches
  savedSearches: SavedSearch[];
  addSavedSearch: (search: Omit<SavedSearch, 'id' | 'createdAt'>) => SavedSearch;
  removeSavedSearch: (id: string) => void;
  getCollections: () => string[];
  // Demo state
  savedKeywords: Set<string>;
  addSavedKeyword: (keyword: string) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [nicheResults, setNicheResults] = useState<NicheResult[]>(demoNicheResults);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(demoSavedSearches);
  const [savedKeywords, setSavedKeywords] = useState<Set<string>>(new Set());

  const filterNicheResults = useCallback((searchTerm: string) => {
    setNicheResults(filterDemoNicheResults(searchTerm));
  }, []);

  const getAnalysisById = useCallback((id: string): Analysis | undefined => {
    return demoAnalyses.find((a) => a.id === id);
  }, []);

  const addSavedSearch = useCallback(
    (search: Omit<SavedSearch, 'id' | 'createdAt'>): SavedSearch => {
      const newSearch: SavedSearch = {
        ...search,
        id: `demo-saved-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setSavedSearches((prev) => [newSearch, ...prev]);
      return newSearch;
    },
    []
  );

  const removeSavedSearch = useCallback((id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getCollections = useCallback(() => {
    const collections = new Set<string>();
    savedSearches.forEach((search) => {
      if (search.collection) {
        collections.add(search.collection);
      }
    });
    return Array.from(collections);
  }, [savedSearches]);

  const addSavedKeyword = useCallback((keyword: string) => {
    setSavedKeywords((prev) => new Set([...prev, keyword]));
  }, []);

  const value: DemoContextValue = {
    isDemo: true,
    nicheResults,
    filterNicheResults,
    niches: demoNiches,
    analyses: demoAnalyses,
    topNiches: getDemoTopNiches(),
    latestAnalyses: getDemoLatestAnalyses(),
    getAnalysisById,
    savedSearches,
    addSavedSearch,
    removeSavedSearch,
    getCollections,
    savedKeywords,
    addSavedKeyword,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoContext() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
}

export function useOptionalDemoContext() {
  return useContext(DemoContext);
}
