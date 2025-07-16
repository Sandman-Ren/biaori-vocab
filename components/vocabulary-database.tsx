'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import FilterPanel from '@/components/filter-panel';
import VocabularyTable from '@/components/vocabulary-table';
import Pagination from '@/components/pagination';
import { VocabularyItem, FilterState } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronLeft, ChevronRight, Download, Play, Info, Star, Filter } from 'lucide-react';
import { 
  getBookInfo, 
  getLessonInfo, 
  getPartOfSpeechInfo,
  filterVocabulary,
  sortVocabulary,
  paginateVocabulary
} from '@/lib/vocabulary-utils';
import { 
  generateVerbConjugationWorksheet, 
  generateVerbConjugationAnswerKey 
} from '@/lib/pdf-utils';

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
    selectedConjugations: ['polite_present', 'polite_past', 'polite_negative', 'casual_present'],
    conjugationSource: 'precomputed',
  });

  const [bookmarkedRows, setBookmarkedRows] = useState<string[]>([]);
  const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    books: true,
    lessons: true,
    partsOfSpeech: true,
    conjugations: true,
  });
  const [sectionAnimationsEnabled, setSectionAnimationsEnabled] = useState(true);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'json' | 'pdf-practice' | 'pdf-answers'>('csv');
  const [simplifiedPDF, setSimplifiedPDF] = useState(false);
  const [isMobileFABExpanded, setIsMobileFABExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load bookmarks from localStorage only on client-side
  useEffect(() => {
    if (!isClient) return;
    
    const saved = localStorage.getItem('vocabulary-bookmarks');
    if (saved) {
      try {
        setBookmarkedRows(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load bookmarks:', e);
      }
    }
  }, [isClient]);

  // Save bookmarks to localStorage when changed (only on client)
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('vocabulary-bookmarks', JSON.stringify(bookmarkedRows));
  }, [bookmarkedRows, isClient]);

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

  // Helper functions to control filter panel collapse/expand with animation control
  const handleFilterPanelExpand = () => {
    setSectionAnimationsEnabled(false);
    setIsFilterPanelCollapsed(false);
    // Re-enable animations after the panel transition completes
    setTimeout(() => setSectionAnimationsEnabled(true), 300);
  };

  const handleFilterPanelCollapse = () => {
    setSectionAnimationsEnabled(false);
    setIsFilterPanelCollapsed(true);
    // Re-enable animations after the panel transition completes
    setTimeout(() => setSectionAnimationsEnabled(true), 300);
  };

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

  const handleSelectedConjugationsChange = (conjugations: (keyof import('@/lib/types').VerbConjugations)[]) => {
    setFilters(prev => ({
      ...prev,
      selectedConjugations: conjugations
    }));
  };

  const handleConjugationSourceChange = (source: import('@/lib/types').ConjugationSource) => {
    setFilters(prev => ({
      ...prev,
      conjugationSource: source
    }));
  };

  const clearSelection = () => {
    setFilters(prev => ({ ...prev, selectedRows: [] }));
  };

  const exportSelected = () => {
    const selectedItems = vocabulary.filter(item => 
      filters.selectedRows.includes(item._id)
    );
    
    if (selectedItems.length === 0) {
      alert('请先选择要导出的词汇。');
      return;
    }

    switch (exportFormat) {
      case 'pdf-practice':
        generateVerbConjugationWorksheet({
          selectedVocabulary: selectedItems,
          selectedConjugations: filters.selectedConjugations,
          includeExamples: true,
          includeAnswers: false,
          simplifiedLayout: simplifiedPDF,
          conjugationSource: filters.conjugationSource
        });
        return;
        
      case 'pdf-answers':
        generateVerbConjugationAnswerKey({
          selectedVocabulary: selectedItems,
          selectedConjugations: filters.selectedConjugations,
          includeExamples: true,
          includeAnswers: true,
          simplifiedLayout: simplifiedPDF,
          conjugationSource: filters.conjugationSource
        });
        return;
        
      case 'csv':
        const csvContent = convertToCSV(selectedItems);
        downloadFile(csvContent, 'selected-vocabulary.csv', 'text/csv;charset=utf-8;');
        break;
      
      case 'xlsx':
        // For now, we'll export as CSV and suggest using a converter
        // In a real app, you'd use a library like xlsx or exceljs
        const xlsxContent = convertToCSV(selectedItems);
        downloadFile(xlsxContent, 'selected-vocabulary.csv', 'text/csv;charset=utf-8;');
        break;
      
      case 'json':
      default:
        const dataStr = JSON.stringify(selectedItems, null, 2);
        downloadFile(dataStr, 'selected-vocabulary.json', 'application/json');
        break;
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: VocabularyItem[]): string => {
    if (data.length === 0) return '';
    
    // CSV headers
    const headers = ['Japanese', 'Reading', 'Meaning', 'Part of Speech', 'Book', 'Lesson', 'Examples'];
    
    // Convert data to CSV rows
    const rows = data.map(item => [
      `"${item.japanese_word.replace(/"/g, '""')}"`,
      `"${item.reading.replace(/"/g, '""')}"`,
      `"${item.chinese_meaning.replace(/"/g, '""')}"`,
      `"${item.part_of_speech.replace(/"/g, '""')}"`,
      `"${item.book_id}"`,
      `"${item.lesson_name.replace(/"/g, '""')}"`,
      `"${(item.example_sentences || []).join('; ').replace(/"/g, '""')}"`
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background/95 backdrop-blur-sm border-b border-border px-4 sm:px-6 py-4 flex-shrink-0 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                中日交流标准日本语
              </h1>
              <span className="text-sm text-muted-foreground hidden sm:block">
                词汇学习系统
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Enhanced stats with animations */}
              <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2 hover-lift">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>总计: {filteredVocabulary.length.toLocaleString()} 词</span>
                </div>
                {bookmarkedRows.length > 0 && (
                  <div className="flex items-center space-x-2 hover-lift">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>已收藏: {bookmarkedRows.length}</span>
                  </div>
                )}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main content with side-by-side layout */}
        <main 
          id="main-content"
          className="flex-1 flex overflow-hidden"
          role="main"
          aria-label="词汇学习主要内容"
        >
          {/* Collapsible Filter Panel - Desktop only */}
          {!isMobile && (
            <motion.div
              initial={false}
              animate={{
                width: isFilterPanelCollapsed ? 48 : 288, // 12 * 4 = 48px, 72 * 4 = 288px
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.5,
              }}
              className="flex-shrink-0 bg-card border-r border-border flex flex-col overflow-hidden force-pointer-events"
            >
              {isFilterPanelCollapsed ? (
                <div className="bg-muted h-full flex flex-col items-center justify-start">
                  <motion.button
                    onClick={handleFilterPanelExpand}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent p-2 rounded mt-4 mb-2 transition-colors duration-200"
                    title="显示筛选"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                  <div className="writing-mode-vertical text-xs text-muted-foreground mt-2 select-none">
                    筛选
                  </div>
                  
                  {/* Visual indicator of active filters */}
                  {(filters.books.length > 0 || filters.lessons.length > 0 || filters.partsOfSpeech.length > 0 || filters.textSearch) && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-4" />
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {/* Filter Panel Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-sm font-medium text-foreground">筛选</h2>
                    <motion.button
                      onClick={handleFilterPanelCollapse}
                      className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors duration-200"
                      title="隐藏筛选"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  {/* Scrollable Filter Content */}
                  <div className="flex-1 overflow-y-auto force-pointer-events">
                    <FilterPanel
                      books={bookInfo}
                      lessons={lessonInfo}
                      partsOfSpeech={partOfSpeechInfo}
                      selectedBooks={filters.books}
                      selectedLessons={filters.lessons}
                      selectedPartsOfSpeech={filters.partsOfSpeech}
                      textSearch={filters.textSearch}
                      searchFields={filters.searchFields}
                      selectedConjugations={filters.selectedConjugations}
                      conjugationSource={filters.conjugationSource}
                      expandedSections={expandedSections}
                      animationsEnabled={sectionAnimationsEnabled}
                      onBooksChange={(books) => setFilters(prev => ({ ...prev, books }))}
                      onLessonsChange={(lessons) => setFilters(prev => ({ ...prev, lessons }))}
                      onPartsOfSpeechChange={(partsOfSpeech) => setFilters(prev => ({ ...prev, partsOfSpeech }))}
                      onTextSearchChange={(textSearch) => setFilters(prev => ({ ...prev, textSearch }))}
                      onSearchFieldsChange={(searchFields) => setFilters(prev => ({ ...prev, searchFields }))}
                      onSelectedConjugationsChange={handleSelectedConjugationsChange}
                      onConjugationSourceChange={handleConjugationSourceChange}
                      onExpandedSectionsChange={setExpandedSections}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div
            layout
            className="flex-1 flex flex-col min-w-0 overflow-hidden"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 0.8,
              duration: 0.15,
            }}
          >
            {/* PDF Export Info Banner */}
            {(exportFormat === 'pdf-practice' || exportFormat === 'pdf-answers') && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 sm:px-6 py-2 bg-primary/10 border-b border-primary/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-primary">
                    <Info className="w-4 h-4 text-primary" />
                    <span>
                      PDF打印模式：将为选中的 <span className="font-medium">{vocabulary.filter(v => filters.selectedRows.includes(v._id) && v.part_of_speech.includes('动')).length} 个动词</span> 
                      生成 <span className="font-medium">{exportFormat === 'pdf-practice' ? '练习册' : '答案册'}</span>，
                      包含 <span className="font-medium">{filters.selectedConjugations.length} 种变位形式</span>。
                      点击导出后将打开打印预览。
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="simplified-pdf-desktop" className="text-xs text-primary">
                      简化版式
                    </Label>
                    <Switch
                      id="simplified-pdf-desktop"
                      checked={simplifiedPDF}
                      onCheckedChange={setSimplifiedPDF}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Table Controls */}
            <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0 min-h-[64px]">
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button - Left side */}
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        筛选
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                      <SheetHeader>
                        <SheetTitle>筛选条件</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 h-full overflow-y-auto">
                        <FilterPanel
                          books={bookInfo}
                          lessons={lessonInfo}
                          partsOfSpeech={partOfSpeechInfo}
                          selectedBooks={filters.books}
                          selectedLessons={filters.lessons}
                          selectedPartsOfSpeech={filters.partsOfSpeech}
                          textSearch={filters.textSearch}
                          searchFields={filters.searchFields}
                          selectedConjugations={filters.selectedConjugations}
                          conjugationSource={filters.conjugationSource}
                          expandedSections={expandedSections}
                          animationsEnabled={sectionAnimationsEnabled}
                          onBooksChange={(books) => setFilters(prev => ({ ...prev, books }))}
                          onLessonsChange={(lessons) => setFilters(prev => ({ ...prev, lessons }))}
                          onPartsOfSpeechChange={(partsOfSpeech) => setFilters(prev => ({ ...prev, partsOfSpeech }))}
                          onTextSearchChange={(textSearch) => setFilters(prev => ({ ...prev, textSearch }))}
                          onSearchFieldsChange={(searchFields) => setFilters(prev => ({ ...prev, searchFields }))}
                          onSelectedConjugationsChange={handleSelectedConjugationsChange}
                          onConjugationSourceChange={handleConjugationSourceChange}
                          onExpandedSectionsChange={setExpandedSections}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                )}

                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={paginatedVocabulary.length > 0 && 
                      paginatedVocabulary.every(item => 
                        filters.selectedRows.includes(item._id)
                      )}
                    onCheckedChange={handleSelectAll}
                    aria-label="全选本页"
                  />
                  <Label className="text-sm text-muted-foreground hidden sm:block">全选</Label>
                </div>
                {/* Always render selection controls but hide when no selection */}
                <div className={`flex items-center space-x-3 transition-opacity duration-200 ${
                  filters.selectedRows.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    已选择 {filters.selectedRows.length} 项
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearSelection}
                    className="text-muted-foreground hover:text-foreground"
                    tabIndex={filters.selectedRows.length > 0 ? 0 : -1}
                  >
                    清除
                  </Button>
                </div>
              </div>
              
              {/* Desktop Export Controls - Always visible */}
              {!isMobile && (
                <div className="flex items-center space-x-3">
                  <Select 
                    value={exportFormat} 
                    onValueChange={(value: 'csv' | 'xlsx' | 'json' | 'pdf-practice' | 'pdf-answers') => setExportFormat(value)}
                  >
                    <SelectTrigger className="w-[150px] h-8">
                      <SelectValue placeholder="导出格式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">XLSX</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf-practice">PDF练习</SelectItem>
                      <SelectItem value="pdf-answers">PDF答案</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={exportSelected}
                    disabled={filters.selectedRows.length === 0}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    导出 {filters.selectedRows.length > 0 ? `(${filters.selectedRows.length})` : ''}
                  </Button>
                </div>
              )}
              
              {/* Mobile filter count indicator */}
              {isMobile && (filters.books.length > 0 || filters.lessons.length > 0 || filters.partsOfSpeech.length > 0 || filters.textSearch) && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                  已筛选
                </span>
              )}
            </div>

            {/* Scrollable Table Container */}
            <div className="flex-1 overflow-auto">
              <VocabularyTable
                vocabulary={paginatedVocabulary}
                selectedRows={filters.selectedRows}
                sortColumn={filters.sortColumn}
                sortDirection={filters.sortDirection}
                selectedConjugations={filters.selectedConjugations}
                conjugationSource={filters.conjugationSource}
                onRowSelect={handleRowSelect}
                onSelectAll={handleSelectAll}
                onSort={handleSort}
                onBookmark={handleBookmark}
                bookmarkedRows={bookmarkedRows}
                isMobile={isMobile}
              />
            </div>

            {/* Pagination */}
            <div className="flex-shrink-0">
              <Pagination
                currentPage={filters.currentPage}
                totalPages={totalPages}
                pageSize={filters.pageSize}
                totalItems={filteredVocabulary.length}
                onPageChange={(page) => setFilters(prev => ({ ...prev, currentPage: page }))}
                onPageSizeChange={(pageSize) => setFilters(prev => ({ ...prev, pageSize, currentPage: 1 }))}
                isMobile={isMobile}
              />
            </div>
          </motion.div>
        </main>

        {/* Floating Action Button - Mobile only */}
        {isMobile && filters.selectedRows.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
            {/* Expanded Actions */}
            <motion.div
              initial={false}
              animate={{
                opacity: isMobileFABExpanded ? 1 : 0,
                y: isMobileFABExpanded ? 0 : 20,
                scale: isMobileFABExpanded ? 1 : 0.8,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className={`flex flex-col space-y-2 ${!isMobileFABExpanded ? 'pointer-events-none' : ''}`}
            >
              {/* Export Format Selector */}
              <motion.div 
                className="bg-card rounded-lg shadow-lg border border-border p-3 min-w-[120px]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isMobileFABExpanded ? 1 : 0, 
                  scale: isMobileFABExpanded ? 1 : 0.8 
                }}
                transition={{ duration: 0.2, delay: isMobileFABExpanded ? 0.1 : 0 }}
              >
                <div className="text-xs text-muted-foreground mb-2 font-medium">导出格式</div>
                <Select 
                  value={exportFormat} 
                  onValueChange={(value: 'csv' | 'xlsx' | 'json' | 'pdf-practice' | 'pdf-answers') => setExportFormat(value)}
                >
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">XLSX</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf-practice">PDF练习</SelectItem>
                      <SelectItem value="pdf-answers">PDF答案</SelectItem>
                    </motion.div>
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Export Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isMobileFABExpanded ? 1 : 0, 
                  scale: isMobileFABExpanded ? 1 : 0.8 
                }}
                transition={{ duration: 0.2, delay: isMobileFABExpanded ? 0.2 : 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-green-600 text-white hover:bg-green-700 shadow-lg rounded-full w-12 h-12"
                  onClick={() => {
                    exportSelected();
                    setIsMobileFABExpanded(false);
                  }}
                >
                  <Download className="w-5 h-5" />
                </Button>
              </motion.div>
              
              {/* Practice Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isMobileFABExpanded ? 1 : 0, 
                  scale: isMobileFABExpanded ? 1 : 0.8 
                }}
                transition={{ duration: 0.2, delay: isMobileFABExpanded ? 0.3 : 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg rounded-full w-12 h-12"
                  onClick={() => {
                    // TODO: Implement practice mode
                    setIsMobileFABExpanded(false);
                  }}
                >
                  <Play className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Main FAB */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                delay: 0.1 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-full w-14 h-14"
                onClick={() => setIsMobileFABExpanded(!isMobileFABExpanded)}
              >
                <motion.div
                  animate={{ rotate: isMobileFABExpanded ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {isMobileFABExpanded ? (
                    <span className="text-xl font-light">×</span>
                  ) : (
                    <span className="text-sm font-medium">{filters.selectedRows.length}</span>
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Mobile Filter Panel - Sheet Component */}
      {isMobile && (
        <Sheet open={isFilterPanelCollapsed} onOpenChange={setIsFilterPanelCollapsed}>
          <SheetContent className="p-4 sm:p-6">
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold text-foreground">
                筛选
              </SheetTitle>
            </SheetHeader>
            
            {/* Filter Panel Content */}
            <div className="mt-4">
              <FilterPanel
                books={bookInfo}
                lessons={lessonInfo}
                partsOfSpeech={partOfSpeechInfo}
                selectedBooks={filters.books}
                selectedLessons={filters.lessons}
                selectedPartsOfSpeech={filters.partsOfSpeech}
                textSearch={filters.textSearch}
                searchFields={filters.searchFields}
                selectedConjugations={filters.selectedConjugations}
                conjugationSource={filters.conjugationSource}
                expandedSections={expandedSections}
                animationsEnabled={sectionAnimationsEnabled}
                onBooksChange={(books) => setFilters(prev => ({ ...prev, books }))}
                onLessonsChange={(lessons) => setFilters(prev => ({ ...prev, lessons }))}
                onPartsOfSpeechChange={(partsOfSpeech) => setFilters(prev => ({ ...prev, partsOfSpeech }))}
                onTextSearchChange={(textSearch) => setFilters(prev => ({ ...prev, textSearch }))}
                onSearchFieldsChange={(searchFields) => setFilters(prev => ({ ...prev, searchFields }))}
                onSelectedConjugationsChange={handleSelectedConjugationsChange}
                onConjugationSourceChange={handleConjugationSourceChange}
                onExpandedSectionsChange={setExpandedSections}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
