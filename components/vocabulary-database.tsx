'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import FilterPanel from '@/components/filter-panel';
import VocabularyTable from '@/components/vocabulary-table';
import Pagination from '@/components/pagination';
import { VocabularyItem, FilterState } from '@/lib/types';
import { 
  getBookInfo, 
  getLessonInfo, 
  getPartOfSpeechInfo,
  filterVocabulary,
  sortVocabulary,
  paginateVocabulary
} from '@/lib/vocabulary-utils';

interface VocabularyDatabaseProps {
  vocabulary: VocabularyItem[];
}

export default function VocabularyDatabase({ vocabulary }: VocabularyDatabaseProps) {
  const [filters, setFilters] = useState<FilterState>({
    books: [],
    lessons: [],
    partsOfSpeech: [],
    textSearch: '',
    searchFields: ['japanese', 'reading', 'meaning'],
    sortColumn: 'japanese',
    sortDirection: 'asc',
    selectedRows: [],
    currentPage: 1,
    pageSize: 50,
  });

  const [bookmarkedRows, setBookmarkedRows] = useState<string[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vocabulary-bookmarks');
      if (saved) {
        try {
          setBookmarkedRows(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load bookmarks:', e);
        }
      }
    }
  }, []);

  // Save bookmarks to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vocabulary-bookmarks', JSON.stringify(bookmarkedRows));
    }
  }, [bookmarkedRows]);

  // Compute filter data
  const bookInfo = useMemo(() => getBookInfo(vocabulary), [vocabulary]);
  const lessonInfo = useMemo(() => getLessonInfo(vocabulary), [vocabulary]);
  const partOfSpeechInfo = useMemo(() => getPartOfSpeechInfo(vocabulary), [vocabulary]);

  // Apply filters and sorting
  const filteredVocabulary = useMemo(() => {
    const filtered = filterVocabulary(vocabulary, {
      books: filters.books,
      lessons: filters.lessons,
      partsOfSpeech: filters.partsOfSpeech,
      textSearch: filters.textSearch,
      searchFields: filters.searchFields,
    });

    return sortVocabulary(filtered, filters.sortColumn, filters.sortDirection);
  }, [vocabulary, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredVocabulary.length / filters.pageSize);
  const paginatedVocabulary = useMemo(() => {
    return paginateVocabulary(filteredVocabulary, filters.currentPage, filters.pageSize);
  }, [filteredVocabulary, filters.currentPage, filters.pageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setFilters(prev => ({ ...prev, currentPage: 1 }));
  }, [filters.books, filters.lessons, filters.partsOfSpeech, filters.textSearch, filters.searchFields]);

  const handleRowSelect = (rowId: string, selected: boolean) => {
    if (selected) {
      setFilters(prev => ({
        ...prev,
        selectedRows: [...prev.selectedRows, rowId]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        selectedRows: prev.selectedRows.filter(id => id !== rowId)
      }));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allRowIds = paginatedVocabulary.map(item => item._id);
      setFilters(prev => ({
        ...prev,
        selectedRows: [...new Set([...prev.selectedRows, ...allRowIds])]
      }));
    } else {
      const currentRowIds = paginatedVocabulary.map(item => item._id);
      setFilters(prev => ({
        ...prev,
        selectedRows: prev.selectedRows.filter(id => !currentRowIds.includes(id))
      }));
    }
  };

  const handleSort = (column: string) => {
    setFilters(prev => ({
      ...prev,
      sortColumn: column,
      sortDirection: prev.sortColumn === column && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleBookmark = (rowId: string) => {
    if (bookmarkedRows.includes(rowId)) {
      setBookmarkedRows(prev => prev.filter(id => id !== rowId));
    } else {
      setBookmarkedRows(prev => [...prev, rowId]);
    }
  };

  const clearSelection = () => {
    setFilters(prev => ({ ...prev, selectedRows: [] }));
  };

  const exportSelected = () => {
    const selectedItems = vocabulary.filter(item => 
      filters.selectedRows.includes(item._id)
    );
    
    const dataStr = JSON.stringify(selectedItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selected-vocabulary.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-medium text-gray-900">標準日本語</h1>
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                Vocabulary
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                <span className="font-medium">{filteredVocabulary.length.toLocaleString()}</span>
                {' '}of{' '}
                <span className="text-gray-400">{vocabulary.length.toLocaleString()}</span>
              </span>
              {filters.selectedRows.length > 0 && (
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Practice ({filters.selectedRows.length})
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportSelected}
                disabled={filters.selectedRows.length === 0}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Filter Panel */}
        <FilterPanel
          books={bookInfo}
          lessons={lessonInfo}
          partsOfSpeech={partOfSpeechInfo}
          selectedBooks={filters.books}
          selectedLessons={filters.lessons}
          selectedPartsOfSpeech={filters.partsOfSpeech}
          textSearch={filters.textSearch}
          searchFields={filters.searchFields}
          onBooksChange={(books) => setFilters(prev => ({ ...prev, books }))}
          onLessonsChange={(lessons) => setFilters(prev => ({ ...prev, lessons }))}
          onPartsOfSpeechChange={(partsOfSpeech) => setFilters(prev => ({ ...prev, partsOfSpeech }))}
          onTextSearchChange={(textSearch) => setFilters(prev => ({ ...prev, textSearch }))}
          onSearchFieldsChange={(searchFields) => setFilters(prev => ({ ...prev, searchFields }))}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Table Controls */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={paginatedVocabulary.length > 0 && 
                    paginatedVocabulary.every(item => 
                      filters.selectedRows.includes(item._id)
                    )}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all on page"
                />
                <Label className="text-sm text-gray-600">Select all</Label>
              </div>
              {filters.selectedRows.length > 0 && (
                <>
                  <span className="text-sm text-gray-400">
                    {filters.selectedRows.length} selected
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearSelection}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <VocabularyTable
              vocabulary={paginatedVocabulary}
              selectedRows={filters.selectedRows}
              sortColumn={filters.sortColumn}
              sortDirection={filters.sortDirection}
              onRowSelect={handleRowSelect}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              onBookmark={handleBookmark}
              bookmarkedRows={bookmarkedRows}
            />
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={filters.currentPage}
            totalPages={totalPages}
            pageSize={filters.pageSize}
            totalItems={filteredVocabulary.length}
            onPageChange={(page) => setFilters(prev => ({ ...prev, currentPage: page }))}
            onPageSizeChange={(pageSize) => setFilters(prev => ({ ...prev, pageSize, currentPage: 1 }))}
          />
        </div>
      </div>
    </div>
  );
}
