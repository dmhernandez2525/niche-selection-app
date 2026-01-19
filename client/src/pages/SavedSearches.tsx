import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSavedSearches, type SavedSearch } from '@/hooks/useSavedSearches';
import { useNiches } from '@/hooks/useNiches';
import { useToastContext } from '@/context/ToastContext';
import {
  Bookmark,
  BookmarkX,
  Search,
  Folder,
  FolderPlus,
  Calendar,
  Trash2,
  Edit2,
  Filter,
  Download,
  Plus
} from 'lucide-react';

function SearchCard({
  search,
  onDelete,
  onEdit
}: {
  search: SavedSearch;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="relative p-4 rounded-lg border hover:border-primary/50 transition-all group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary shrink-0" />
            <h4 className="font-medium truncate">{search.keyword}</h4>
          </div>
          {search.nicheName && (
            <p className="text-sm text-muted-foreground mt-1">
              Niche: {search.nicheName}
            </p>
          )}
          {search.notes && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {search.notes}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(search.createdAt).toLocaleDateString()}
            </span>
            {search.collection && (
              <Badge variant="outline" className="text-xs">
                <Folder className="h-3 w-3 mr-1" />
                {search.collection}
              </Badge>
            )}
          </div>
        </div>
        <div
          className={`flex items-center gap-1 transition-opacity ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Button variant="ghost" size="icon-sm" onClick={onEdit} title="Edit">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {search.nicheId && (
        <Link
          to={`/analysis/${search.nicheId}`}
          className="absolute inset-0 z-0"
          aria-label={`View analysis for ${search.keyword}`}
        />
      )}
    </div>
  );
}

function CollectionCard({
  name,
  count,
  isActive,
  onClick
}: {
  name: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-lg border transition-all w-full text-left ${
        isActive ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
      }`}
    >
      <div className="flex items-center gap-2">
        <Folder className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
        <span className={isActive ? 'font-medium' : ''}>{name}</span>
      </div>
      <Badge variant="secondary">{count}</Badge>
    </button>
  );
}

export function SavedSearches() {
  const { savedSearches, isLoading, removeSearch, addSearch, getCollections } =
    useSavedSearches();
  const { data: niches } = useNiches();
  const toast = useToastContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSearchKeyword, setNewSearchKeyword] = useState('');
  const [newSearchCollection, setNewSearchCollection] = useState('');

  // Combine saved searches with niches data
  const enrichedSearches = useMemo(() => {
    return savedSearches.map((search) => {
      const niche = niches?.find((n) => n.id === search.nicheId);
      return {
        ...search,
        nicheName: niche?.name ?? search.nicheName
      };
    });
  }, [savedSearches, niches]);

  // Get unique collections
  const collections = useMemo(() => {
    const cols = getCollections();
    return [
      { name: 'All', count: savedSearches.length },
      ...cols.map((name) => ({
        name,
        count: savedSearches.filter((s) => s.collection === name).length
      }))
    ];
  }, [savedSearches, getCollections]);

  // Filter searches
  const filteredSearches = useMemo(() => {
    return enrichedSearches.filter((search) => {
      const matchesSearch = searchTerm
        ? search.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
          search.nicheName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          search.notes?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesCollection =
        selectedCollection === null || selectedCollection === 'All'
          ? true
          : search.collection === selectedCollection;

      return matchesSearch && matchesCollection;
    });
  }, [enrichedSearches, searchTerm, selectedCollection]);

  const handleDelete = (id: string, keyword: string) => {
    removeSearch(id);
    toast.success(`"${keyword}" removed from saved searches`);
  };

  const handleEdit = (search: SavedSearch) => {
    // For now, just show a toast - in a real app this would open an edit modal
    toast.info(`Editing "${search.keyword}"...`);
  };

  const handleAddSearch = () => {
    if (!newSearchKeyword.trim()) {
      toast.warning('Please enter a keyword');
      return;
    }

    addSearch({
      keyword: newSearchKeyword.trim(),
      collection: newSearchCollection.trim() || undefined
    });

    toast.success(`"${newSearchKeyword}" saved!`);
    setNewSearchKeyword('');
    setNewSearchCollection('');
    setShowAddModal(false);
  };

  const handleExportAll = () => {
    const data = filteredSearches
      .map((s) => `${s.keyword},${s.collection || ''},${s.createdAt}`)
      .join('\n');
    const header = 'keyword,collection,created_at\n';
    const blob = new Blob([header + data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved-searches.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Saved searches exported!');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
          <Skeleton className="h-[300px]" />
          <div className="lg:col-span-3 space-y-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Saved Searches</h2>
          <p className="text-muted-foreground">
            Organize and manage your bookmarked niches and keywords.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Search
          </Button>
        </div>
      </div>

      {/* Add Search Modal */}
      {showAddModal && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Search</CardTitle>
            <CardDescription>Save a keyword to your collection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Keyword</label>
              <Input
                placeholder="Enter a keyword..."
                value={newSearchKeyword}
                onChange={(e) => setNewSearchKeyword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Collection (optional)</label>
              <Input
                placeholder="e.g., Tech, Gaming, Lifestyle..."
                value={newSearchCollection}
                onChange={(e) => setNewSearchCollection(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSearch}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        {/* Sidebar - Collections */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Folder className="h-4 w-4" />
                Collections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.name}
                  name={collection.name}
                  count={collection.count}
                  isActive={
                    selectedCollection === collection.name ||
                    (selectedCollection === null && collection.name === 'All')
                  }
                  onClick={() =>
                    setSelectedCollection(collection.name === 'All' ? null : collection.name)
                  }
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const name = prompt('Enter collection name:');
                  if (name) {
                    toast.success(`Collection "${name}" created!`);
                  }
                }}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Search List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filteredSearches.length} saved search{filteredSearches.length !== 1 ? 'es' : ''}
            </span>
            {selectedCollection && selectedCollection !== 'All' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCollection(null)}
              >
                Clear filter
              </Button>
            )}
          </div>

          {/* Search List */}
          {filteredSearches.length > 0 ? (
            <div className="space-y-3">
              {filteredSearches.map((search) => (
                <SearchCard
                  key={search.id}
                  search={search}
                  onDelete={() => handleDelete(search.id, search.keyword)}
                  onEdit={() => handleEdit(search)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                {searchTerm || selectedCollection ? (
                  <>
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-1">No matches found</h3>
                    <p className="text-muted-foreground text-sm">
                      Try adjusting your search or filter criteria.
                    </p>
                  </>
                ) : (
                  <>
                    <BookmarkX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-1">No saved searches yet</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Save keywords from the Niche Finder to track them here.
                    </p>
                    <Link to="/niche-finder">
                      <Button>
                        <Search className="h-4 w-4 mr-2" />
                        Find Niches
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
