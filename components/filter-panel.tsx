'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookInfo, LessonInfo, PartOfSpeechInfo, VerbConjugations, ConjugationLevel, ConjugationSource } from '@/lib/types';
import { CONJUGATION_FORMS, getConjugationsByLevel, detectCurrentLevel } from '@/lib/conjugation-utils';

interface FilterPanelProps {
  books: BookInfo[];
  lessons: LessonInfo[];
  partsOfSpeech: PartOfSpeechInfo[];
  selectedBooks: string[];
  selectedLessons: string[];
  selectedPartsOfSpeech: string[];
  textSearch: string;
  searchFields: string[];
  selectedConjugations: (keyof VerbConjugations)[];
  conjugationSource: ConjugationSource;
  expandedSections: {
    search: boolean;
    books: boolean;
    lessons: boolean;
    partsOfSpeech: boolean;
    conjugations: boolean;
  };
  animationsEnabled?: boolean;
  onBooksChange: (books: string[]) => void;
  onLessonsChange: (lessons: string[]) => void;
  onPartsOfSpeechChange: (partsOfSpeech: string[]) => void;
  onTextSearchChange: (search: string) => void;
  onSearchFieldsChange: (fields: string[]) => void;
  onSelectedConjugationsChange: (conjugations: (keyof VerbConjugations)[]) => void;
  onConjugationSourceChange: (source: ConjugationSource) => void;
  onExpandedSectionsChange: (sections: {
    search: boolean;
    books: boolean;
    lessons: boolean;
    partsOfSpeech: boolean;
    conjugations: boolean;
  }) => void;
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
  selectedConjugations,
  conjugationSource,
  expandedSections,
  animationsEnabled = true,
  onBooksChange,
  onLessonsChange,
  onPartsOfSpeechChange,
  onTextSearchChange,
  onSearchFieldsChange,
  onSelectedConjugationsChange,
  onConjugationSourceChange,
  onExpandedSectionsChange,
}: FilterPanelProps) {
  const [lessonSearch, setLessonSearch] = useState('');
  const [showAllLessons, setShowAllLessons] = useState(false);

  // Ensure expandedSections has a default value
  const safeExpandedSections = expandedSections || {
    search: true,
    books: true,
    lessons: true,
    partsOfSpeech: true,
    conjugations: true,
  };

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

  const handleConjugationChange = (conjugationKey: keyof VerbConjugations, checked: boolean) => {
    if (checked) {
      onSelectedConjugationsChange([...selectedConjugations, conjugationKey]);
    } else {
      onSelectedConjugationsChange(selectedConjugations.filter(c => c !== conjugationKey));
    }
  };

  const applyConjugationPreset = (preset: string) => {
    const presetConjugations = getConjugationsByLevel(preset as ConjugationLevel);
    onSelectedConjugationsChange(presetConjugations);
  };

  const currentPreset = detectCurrentLevel(selectedConjugations);

  // Helper functions for select all/deselect all
  const selectAllBooks = () => {
    onBooksChange(books.map(book => book.id));
  };

  const deselectAllBooks = () => {
    onBooksChange([]);
  };

  const selectAllLessons = () => {
    onLessonsChange(filteredLessons.map(lesson => lesson.name));
  };

  const deselectAllLessons = () => {
    onLessonsChange([]);
  };

  const selectAllPartsOfSpeech = () => {
    onPartsOfSpeechChange(partsOfSpeech.map(pos => pos.name));
  };

  const deselectAllPartsOfSpeech = () => {
    onPartsOfSpeechChange([]);
  };

  const selectAllSearchFields = () => {
    onSearchFieldsChange(['japanese', 'reading', 'meaning', 'examples']);
  };

  const deselectAllSearchFields = () => {
    onSearchFieldsChange([]);
  };

  const selectAllConjugations = () => {
    onSelectedConjugationsChange(CONJUGATION_FORMS.map(form => form.key));
  };

  const deselectAllConjugations = () => {
    onSelectedConjugationsChange([]);
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
    <div className="w-full px-6 py-6 bg-card text-card-foreground force-pointer-events">
      {/* Header - Mobile only */}
      <div className="lg:hidden mb-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">筛选</h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              清除所有
            </button>
          )}
        </div>
      </div>

      {/* Text Search - Now at the top */}
      <Collapsible 
        open={safeExpandedSections.search} 
        onOpenChange={(open) => onExpandedSectionsChange({ ...safeExpandedSections, search: open })}
        className="mb-6"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <Label className="text-sm font-medium text-foreground">
            搜索 {textSearch && '(生效中)'}
          </Label>
          <motion.div
            animate={{ rotate: safeExpandedSections.search ? 0 : -90 }}
            transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </CollapsibleTrigger>
        <CollapsibleContent forceMount>
          <AnimatePresence>
            {safeExpandedSections.search && (
              <motion.div
                initial={animationsEnabled ? { height: 0, opacity: 0 } : false}
                animate={animationsEnabled ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={animationsEnabled ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
                transition={animationsEnabled ? { duration: 0.3, ease: 'easeOut' } : { duration: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4">
                  <Input
                    type="text"
                    placeholder="日语、读音、含义..."
                    value={textSearch}
                    onChange={(e) => onTextSearchChange(e.target.value)}
                    className="mb-4 text-sm"
                  />
                  <details className="text-sm text-muted-foreground">
                    <summary className="cursor-pointer hover:text-foreground mb-2">
                      搜索选项
                    </summary>
                    
                    {/* Select All/Deselect All for Search Fields */}
                    <div className="flex space-x-2 mb-3 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllSearchFields}
                        className="text-xs flex-1"
                        disabled={searchFields.length === 4}
                      >
                        全选 (4)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deselectAllSearchFields}
                        className="text-xs flex-1"
                        disabled={searchFields.length === 0}
                      >
                        全不选
                      </Button>
                    </div>
                    
                    <div className="space-y-2 ml-1">
                      {[
                        { id: 'japanese', label: '日语' },
                        { id: 'reading', label: '读音' },
                        { id: 'meaning', label: '含义' },
                        { id: 'examples', label: '例句' },
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {/* Books Filter */}
      <Collapsible 
        open={safeExpandedSections.books} 
        onOpenChange={(open) => onExpandedSectionsChange({ ...safeExpandedSections, books: open })}
        className="mb-6"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <Label className="text-sm font-medium text-foreground">
            教材 {selectedBooks.length > 0 && `(${selectedBooks.length})`}
          </Label>
          <motion.div
            animate={{ rotate: safeExpandedSections.books ? 0 : -90 }}
            transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </CollapsibleTrigger>
        <CollapsibleContent forceMount>
          <AnimatePresence>
            {safeExpandedSections.books && (
              <motion.div
                initial={animationsEnabled ? { height: 0, opacity: 0 } : false}
                animate={animationsEnabled ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={animationsEnabled ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
                transition={animationsEnabled ? { duration: 0.3, ease: 'easeOut' } : { duration: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3">
                  {/* Select All/Deselect All for Books */}
                  <div className="flex space-x-2 mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllBooks}
                      className="text-xs flex-1"
                      disabled={selectedBooks.length === books.length}
                    >
                      全选 ({books.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deselectAllBooks}
                      className="text-xs flex-1"
                      disabled={selectedBooks.length === 0}
                    >
                      全不选
                    </Button>
                  </div>
                  
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
                          className="text-foreground cursor-pointer text-sm"
                        >
                          {book.name} (Book {book.id})
                        </Label>
                      </div>
                      <span className="text-xs text-muted-foreground">{book.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {/* Lessons Filter */}
      <Collapsible 
        open={safeExpandedSections.lessons} 
        onOpenChange={(open) => onExpandedSectionsChange({ ...safeExpandedSections, lessons: open })}
        className="mb-6"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <Label className="text-sm font-medium text-foreground">
            课程 {selectedLessons.length > 0 && `(${selectedLessons.length})`}
          </Label>
          <motion.div
            animate={{ rotate: safeExpandedSections.lessons ? 0 : -90 }}
            transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </CollapsibleTrigger>
        <CollapsibleContent forceMount>
          <AnimatePresence>
            {safeExpandedSections.lessons && (
              <motion.div
                initial={animationsEnabled ? { height: 0, opacity: 0 } : false}
                animate={animationsEnabled ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={animationsEnabled ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
                transition={animationsEnabled ? { duration: 0.3, ease: 'easeOut' } : { duration: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4">
                  <Input
                    type="text"
                    placeholder="搜索课程..."
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    className="mb-4 text-sm"
                  />
                  
                  {/* Select All/Deselect All for Lessons */}
                  <div className="flex space-x-2 mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllLessons}
                      className="text-xs flex-1"
                      disabled={selectedLessons.length === filteredLessons.length}
                    >
                      全选 ({filteredLessons.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deselectAllLessons}
                      className="text-xs flex-1"
                      disabled={selectedLessons.length === 0}
                    >
                      全不选
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-theme">
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
                            className="text-foreground cursor-pointer text-sm"
                          >
                            {lesson.name}
                          </Label>
                        </div>
                        <span className="text-xs text-muted-foreground">{lesson.count}</span>
                      </div>
                    ))}
                    {filteredLessons.length > 10 && !showAllLessons && (
                      <button
                        onClick={() => setShowAllLessons(true)}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        显示更多...
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {/* Parts of Speech Filter */}
      <Collapsible 
        open={safeExpandedSections.partsOfSpeech} 
        onOpenChange={(open) => onExpandedSectionsChange({ ...safeExpandedSections, partsOfSpeech: open })}
        className="mb-6"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <Label className="text-sm font-medium text-foreground">
            词性 {selectedPartsOfSpeech.length > 0 && `(${selectedPartsOfSpeech.length})`}
          </Label>
          <motion.div
            animate={{ rotate: safeExpandedSections.partsOfSpeech ? 0 : -90 }}
            transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </CollapsibleTrigger>
        <CollapsibleContent forceMount>
          <AnimatePresence>
            {safeExpandedSections.partsOfSpeech && (
              <motion.div
                initial={animationsEnabled ? { height: 0, opacity: 0 } : false}
                animate={animationsEnabled ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={animationsEnabled ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
                transition={animationsEnabled ? { duration: 0.3, ease: 'easeOut' } : { duration: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3">
                  {/* Select All/Deselect All for Parts of Speech */}
                  <div className="flex space-x-2 mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllPartsOfSpeech}
                      className="text-xs flex-1"
                      disabled={selectedPartsOfSpeech.length === partsOfSpeech.length}
                    >
                      全选 ({partsOfSpeech.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deselectAllPartsOfSpeech}
                      className="text-xs flex-1"
                      disabled={selectedPartsOfSpeech.length === 0}
                    >
                      全不选
                    </Button>
                  </div>
                  
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
                          className="text-foreground cursor-pointer text-sm"
                        >
                          {pos.name}
                        </Label>
                      </div>
                      <span className="text-xs text-muted-foreground">{pos.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>

      {/* Verb Conjugations */}
      <Collapsible 
        open={safeExpandedSections.conjugations} 
        onOpenChange={(open) => onExpandedSectionsChange({ ...safeExpandedSections, conjugations: open })}
        className="mb-6"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
          <Label className="text-sm font-medium text-foreground">
            动词变位 {selectedConjugations.length > 0 && `(已选择 ${selectedConjugations.length} 个)`}
          </Label>
          <motion.div
            animate={{ rotate: safeExpandedSections.conjugations ? 0 : -90 }}
            transition={animationsEnabled ? { duration: 0.2 } : { duration: 0 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </CollapsibleTrigger>
        <CollapsibleContent forceMount>
          <AnimatePresence>
            {safeExpandedSections.conjugations && (
              <motion.div
                initial={animationsEnabled ? { height: 0, opacity: 0 } : false}
                animate={animationsEnabled ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={animationsEnabled ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
                transition={animationsEnabled ? { duration: 0.3, ease: 'easeOut' } : { duration: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4">
                  {/* Conjugation Source Selector */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">变位数据源：</Label>
                    <Select value={conjugationSource} onValueChange={onConjugationSourceChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择变位数据源" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="precomputed">预计算 (默认)</SelectItem>
                        <SelectItem value="jmdict">JMDict 词典</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {conjugationSource === 'precomputed' ? '使用预先计算的动词变位' : '使用 JMDict 词典的实时变位'}
                    </p>
                  </div>
                  
                  {/* Preset Buttons */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">快速预设：</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'beginner', label: '初级', count: 6 },
                        { key: 'intermediate', label: '中级', count: 10 },
                        { key: 'advanced', label: '高级', count: 13 },
                        { key: 'complete', label: '全部形式', count: 15 },
                      ].map(preset => (
                        <Button
                          key={preset.key}
                          variant={currentPreset === preset.key ? "default" : "outline"}
                          size="sm"
                          onClick={() => applyConjugationPreset(preset.key)}
                          className="text-xs"
                        >
                          {preset.label} ({preset.count})
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Select All/Deselect All for Conjugations */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllConjugations}
                      className="text-xs flex-1"
                      disabled={selectedConjugations.length === CONJUGATION_FORMS.length}
                    >
                      全选 ({CONJUGATION_FORMS.length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deselectAllConjugations}
                      className="text-xs flex-1"
                      disabled={selectedConjugations.length === 0}
                    >
                      全不选
                    </Button>
                  </div>

                  {/* Individual Form Checkboxes */}
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">单独形式：</Label>
                    
                    {/* Basic Forms */}
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-blue-600">基础形式</div>
                      <div className="space-y-3">
                        {CONJUGATION_FORMS.filter(form => form.category === 'basic').map(form => (
                          <div key={`conjugation-${form.key}`} className="flex items-start space-x-3 ml-2">
                            <Checkbox
                              id={`conjugation-${form.key}`}
                              checked={selectedConjugations.includes(form.key)}
                              onCheckedChange={(checked) => handleConjugationChange(form.key, checked as boolean)}
                              className="mt-0.5"
                            />
                            <Label
                              htmlFor={`conjugation-${form.key}`}
                              className="cursor-pointer text-sm flex-1 leading-relaxed"
                            >
                              <div className="space-y-1">
                                <div className="font-medium">{form.label}</div>
                                <div className="text-xs text-muted-foreground">{form.description}</div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Intermediate Forms */}
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-orange-600">中级形式</div>
                      <div className="space-y-3">
                        {CONJUGATION_FORMS.filter(form => form.category === 'intermediate').map(form => (
                          <div key={`conjugation-${form.key}`} className="flex items-start space-x-3 ml-2">
                            <Checkbox
                              id={`conjugation-${form.key}`}
                              checked={selectedConjugations.includes(form.key)}
                              onCheckedChange={(checked) => handleConjugationChange(form.key, checked as boolean)}
                              className="mt-0.5"
                            />
                            <Label
                              htmlFor={`conjugation-${form.key}`}
                              className="cursor-pointer text-sm flex-1 leading-relaxed"
                            >
                              <div className="space-y-1">
                                <div className="font-medium">{form.label}</div>
                                <div className="text-xs text-muted-foreground">{form.description}</div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Advanced Forms */}
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-red-600">高级形式</div>
                      <div className="space-y-3">
                        {CONJUGATION_FORMS.filter(form => form.category === 'advanced').map(form => (
                          <div key={`conjugation-${form.key}`} className="flex items-start space-x-3 ml-2">
                            <Checkbox
                              id={`conjugation-${form.key}`}
                              checked={selectedConjugations.includes(form.key)}
                              onCheckedChange={(checked) => handleConjugationChange(form.key, checked as boolean)}
                              className="mt-0.5"
                            />
                            <Label
                              htmlFor={`conjugation-${form.key}`}
                              className="cursor-pointer text-sm flex-1 leading-relaxed"
                            >
                              <div className="space-y-1">
                                <div className="font-medium">{form.label}</div>
                                <div className="text-xs text-muted-foreground">{form.description}</div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
