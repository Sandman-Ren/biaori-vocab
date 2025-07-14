'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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

  return (
    <div className="w-72 border-r border-gray-100 px-6 py-6 bg-white h-full overflow-y-auto">
      {/* Books Filter */}
      <div className="mb-8">
        <Label className="text-sm font-medium text-gray-900 mb-4 block">
          Books
        </Label>
        <div className="space-y-3">
          {books.map((book) => (
            <div key={`filter-panel-book-${book.id}`} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`book-${book.id}`}
                  checked={selectedBooks.includes(book.id)}
                  onCheckedChange={(checked) => handleBookChange(book.id, checked as boolean)}
                />
                <Label
                  htmlFor={`book-${book.id}`}
                  className="text-gray-700 cursor-pointer"
                >
                  {book.name} (Book {book.id})
                </Label>
              </div>
              <span className="text-xs text-gray-400">{book.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons Filter */}
      <div className="mb-8">
        <Label className="text-sm font-medium text-gray-900 mb-4 block">
          Lessons
        </Label>
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
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`lesson-${lesson.id}`}
                  checked={selectedLessons.includes(lesson.name)}
                  onCheckedChange={(checked) => handleLessonChange(lesson.name, checked as boolean)}
                />
                <Label
                  htmlFor={`lesson-${lesson.id}`}
                  className="text-gray-700 cursor-pointer"
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
      </div>

      {/* Parts of Speech Filter */}
      <div className="mb-8">
        <Label className="text-sm font-medium text-gray-900 mb-4 block">
          Parts of Speech
        </Label>
        <div className="space-y-3">
          {partsOfSpeech.map((pos) => (
            <div key={`filter-panel-pos-${pos.name}`} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`pos-${pos.name}`}
                  checked={selectedPartsOfSpeech.includes(pos.name)}
                  onCheckedChange={(checked) => handlePartOfSpeechChange(pos.name, checked as boolean)}
                />
                <Label
                  htmlFor={`pos-${pos.name}`}
                  className="text-gray-700 cursor-pointer"
                >
                  {pos.name}
                </Label>
              </div>
              <span className="text-xs text-gray-400">{pos.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Text Search */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-900 mb-4 block">
          Search
        </Label>
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
                  className="cursor-pointer"
                >
                  {field.label}
                </Label>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
