'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { BookInfo, LessonInfo, PartOfSpeechInfo } from '@/lib/types';

interface FilterPanelProps {
  books: BookInfo[];
  lessons: LessonInfo[];
  partsOfSpeech: PartOfSpeechInfo[];
  selectedBooks: string[];
  selectedLessons: string[];
  selectedPartsOfSpeech: string[];
  textSearch: string;
  searchFields: string[];
  onBooksChange: (books: string[]) => void;
  onLessonsChange: (lessons: string[]) => void;
  onPartsOfSpeechChange: (partsOfSpeech: string[]) => void;
  onTextSearchChange: (search: string) => void;
  onSearchFieldsChange: (fields: string[]) => void;
}

export default function FilterPanel({
  books,
  lessons,
  partsOfSpeech,
  selectedBooks,
  selectedLessons,
  selectedPartsOfSpeech,
  textSearch,
  searchFields,
  onBooksChange,
  onLessonsChange,
  onPartsOfSpeechChange,
  onTextSearchChange,
  onSearchFieldsChange,
}: FilterPanelProps) {
  const [lessonSearch, setLessonSearch] = useState('');
  const [showAllLessons, setShowAllLessons] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    books: true,
    lessons: true,
    partsOfSpeech: true,
    search: true,
  });

  const filteredLessons = lessons.filter(lesson =>
    lesson.name.toLowerCase().includes(lessonSearch.toLowerCase())
  );

  const displayedLessons = showAllLessons 
    ? filteredLessons 
    : filteredLessons.slice(0, 10);

  const handleBookChange = (bookId: string, checked: boolean) => {
    if (checked) {
      onBooksChange([...selectedBooks, bookId]);
    } else {
      onBooksChange(selectedBooks.filter(id => id !== bookId));
    }
  };

  const handleLessonChange = (lessonName: string, checked: boolean) => {
    if (checked) {
      onLessonsChange([...selectedLessons, lessonName]);
    } else {
      onLessonsChange(selectedLessons.filter(name => name !== lessonName));
    }
  };

  const handlePartOfSpeechChange = (pos: string, checked: boolean) => {
    if (checked) {
      onPartsOfSpeechChange([...selectedPartsOfSpeech, pos]);
    } else {
      onPartsOfSpeechChange(selectedPartsOfSpeech.filter(p => p !== pos));
    }
  };

  const handleSearchFieldChange = (field: string, checked: boolean) => {
    if (checked) {
      onSearchFieldsChange([...searchFields, field]);
    } else {
      onSearchFieldsChange(searchFields.filter(f => f !== field));
    }
  };

  const clearAllFilters = () => {
    onBooksChange([]);
    onLessonsChange([]);
    onPartsOfSpeechChange([]);
    onTextSearchChange('');
  };

  const hasActiveFilters = selectedBooks.length > 0 || selectedLessons.length > 0 || 
    selectedPartsOfSpeech.length > 0 || textSearch.length > 0;

  return (
    <div className="w-full lg:w-72 border-r-0 lg:border-r border-gray-100 px-6 py-6 bg-white h-full overflow-y-auto">
      {/* Header - Mobile only */}
      <div className="lg:hidden mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Books Filter */}
      <Collapsible 
        open={expandedSections.books} 
        onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, books: open }))}
        className="mb-6"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <Label className="text-sm font-medium text-gray-900">
            Books {selectedBooks.length > 0 && `(${selectedBooks.length})`}
          </Label>
          {expandedSections.books ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="space-y-3">
            {books.map((book) => (
              <div key={`filter-panel-book-${book.id}`} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    id={`book-${book.id}`}
                    checked={selectedBooks.includes(book.id)}
                    onCheckedChange={(checked) => handleBookChange(book.id, checked as boolean)}
                  />
                  <Label
                    htmlFor={`book-${book.id}`}
                    className="text-gray-700 cursor-pointer text-sm"
                  >
                    {book.name} (Book {book.id})
                  </Label>
                </div>
                <span className="text-xs text-gray-400">{book.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Lessons Filter */}
      <Collapsible 
        open={expandedSections.lessons} 
        onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, lessons: open }))}
        className="mb-6"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <Label className="text-sm font-medium text-gray-900">
            Lessons {selectedLessons.length > 0 && `(${selectedLessons.length})`}
          </Label>
          {expandedSections.lessons ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Input
            type="text"
            placeholder="Search lessons..."
            value={lessonSearch}
            onChange={(e) => setLessonSearch(e.target.value)}
            className="mb-4 text-sm"
          />
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {displayedLessons.map((lesson) => (
              <div key={`filter-panel-lesson-${lesson.id}`} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    id={`lesson-${lesson.id}`}
                    checked={selectedLessons.includes(lesson.name)}
                    onCheckedChange={(checked) => handleLessonChange(lesson.name, checked as boolean)}
                  />
                  <Label
                    htmlFor={`lesson-${lesson.id}`}
                    className="text-gray-700 cursor-pointer text-sm"
                  >
                    {lesson.name}
                  </Label>
                </div>
                <span className="text-xs text-gray-400">{lesson.count}</span>
              </div>
            ))}
            {filteredLessons.length > 10 && !showAllLessons && (
              <button
                onClick={() => setShowAllLessons(true)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Show more...
              </button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Parts of Speech Filter */}
      <Collapsible 
        open={expandedSections.partsOfSpeech} 
        onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, partsOfSpeech: open }))}
        className="mb-6"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <Label className="text-sm font-medium text-gray-900">
            Parts of Speech {selectedPartsOfSpeech.length > 0 && `(${selectedPartsOfSpeech.length})`}
          </Label>
          {expandedSections.partsOfSpeech ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="space-y-3">
            {partsOfSpeech.map((pos) => (
              <div key={`filter-panel-pos-${pos.name}`} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    id={`pos-${pos.name}`}
                    checked={selectedPartsOfSpeech.includes(pos.name)}
                    onCheckedChange={(checked) => handlePartOfSpeechChange(pos.name, checked as boolean)}
                  />
                  <Label
                    htmlFor={`pos-${pos.name}`}
                    className="text-gray-700 cursor-pointer text-sm"
                  >
                    {pos.name}
                  </Label>
                </div>
                <span className="text-xs text-gray-400">{pos.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Text Search */}
      <Collapsible 
        open={expandedSections.search} 
        onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, search: open }))}
        className="mb-6"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <Label className="text-sm font-medium text-gray-900">
            Search {textSearch && '(active)'}
          </Label>
          {expandedSections.search ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Input
            type="text"
            placeholder="Japanese, reading, meaning..."
            value={textSearch}
            onChange={(e) => onTextSearchChange(e.target.value)}
            className="mb-4 text-sm"
          />
          <details className="text-sm text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700 mb-2">
              Search options
            </summary>
            <div className="space-y-2 ml-1 mt-2">
              {[
                { id: 'japanese', label: 'Japanese' },
                { id: 'reading', label: 'Reading' },
                { id: 'meaning', label: 'Meaning' },
                { id: 'examples', label: 'Examples' },
              ].map((field) => (
                <div key={`filter-panel-search-field-${field.id}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`search-${field.id}`}
                    checked={searchFields.includes(field.id)}
                    onCheckedChange={(checked) => handleSearchFieldChange(field.id, checked as boolean)}
                  />
                  <Label
                    htmlFor={`search-${field.id}`}
                    className="cursor-pointer text-sm"
                  >
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </details>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
