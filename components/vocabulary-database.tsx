'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FilterPanel from '@/components/filter-panel';
import VocabularyTable from '@/components/vocabulary-table';
import Pagination from '@/components/pagination';
import { VocabularyItem, FilterState } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Filter, ChevronLeft, ChevronRight, Download, Play, Info } from 'lucide-react';
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
  });

  const [bookmarkedRows, setBookmarkedRows] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterPanelCollapsed, setIsFilterPanelCollapsed] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'json' | 'pdf-practice' | 'pdf-answers'>('csv');
  const [simplifiedPDF, setSimplifiedPDF] = useState(false);
  const [isMobileFABExpanded, setIsMobileFABExpanded] = useState(false);
  const [isMobileExportDialogOpen, setIsMobileExportDialogOpen] = useState(false);
  const isMobile = useIsMobile();

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

  const handleSelectedConjugationsChange = (conjugations: (keyof import('@/lib/types').VerbConjugations)[]) => {
    setFilters(prev => ({
      ...prev,
      selectedConjugations: conjugations
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
          simplifiedLayout: simplifiedPDF
        });
        return;
        
      case 'pdf-answers':
        generateVerbConjugationAnswerKey({
          selectedVocabulary: selectedItems,
          selectedConjugations: filters.selectedConjugations,
          includeExamples: true,
          includeAnswers: true,
          simplifiedLayout: simplifiedPDF
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
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 z-50 flex-shrink-0">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              {isMobile && (
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="px-2">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <SheetHeader className="sr-only">
                      <SheetTitle>筛选词汇</SheetTitle>
                    </SheetHeader>
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
                      onBooksChange={(books) => setFilters(prev => ({ ...prev, books }))}
                      onLessonsChange={(lessons) => setFilters(prev => ({ ...prev, lessons }))}
                      onPartsOfSpeechChange={(partsOfSpeech) => setFilters(prev => ({ ...prev, partsOfSpeech }))}
                      onTextSearchChange={(textSearch) => setFilters(prev => ({ ...prev, textSearch }))}
                      onSearchFieldsChange={(searchFields) => setFilters(prev => ({ ...prev, searchFields }))}
                      onSelectedConjugationsChange={handleSelectedConjugationsChange}
                    />
                  </SheetContent>
                </Sheet>
              )}
              <h1 className="text-lg sm:text-xl font-medium text-gray-900">中日交流标准日本语</h1>
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                词汇
              </span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                <span className="font-medium">{filteredVocabulary.length.toLocaleString()}</span>
                {' '}共{' '}
                <span className="text-gray-400">{vocabulary.length.toLocaleString()}</span>
              </span>
              {filters.selectedRows.length > 0 && (
                <>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <span className="hidden sm:inline">练习</span>
                    <span className="sm:hidden">({filters.selectedRows.length})</span>
                    <span className="hidden sm:inline"> ({filters.selectedRows.length})</span>
                  </Button>
                  
                  {/* Mobile Export Button with Format Selection */}
                  <Dialog open={isMobileExportDialogOpen} onOpenChange={setIsMobileExportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="sm:hidden"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:hidden max-w-[320px]">
                      <DialogHeader>
                        <DialogTitle>选择导出格式</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Select 
                          value={exportFormat} 
                          onValueChange={(value: 'csv' | 'xlsx' | 'json' | 'pdf-practice' | 'pdf-answers') => setExportFormat(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV - 逗号分隔值</SelectItem>
                            <SelectItem value="xlsx">XLSX - Excel 表格</SelectItem>
                            <SelectItem value="json">JSON - 数据格式</SelectItem>
                            <SelectItem value="pdf-practice">PDF - 动词练习册 (打印)</SelectItem>
                            <SelectItem value="pdf-answers">PDF - 动词答案册 (打印)</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {(exportFormat === 'pdf-practice' || exportFormat === 'pdf-answers') && (
                          <div className="space-y-3">
                            <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="font-medium mb-1">📚 动词变位练习册说明</div>
                              <ul className="space-y-1 text-blue-700">
                                <li>• 仅包含选中的动词（{vocabulary.filter(v => filters.selectedRows.includes(v._id) && v.part_of_speech.includes('动')).length} 个动词）</li>
                                <li>• 使用当前选中的变位形式（{filters.selectedConjugations.length} 种形式）</li>
                                <li>• 练习册：空白处供填写练习</li>
                                <li>• 答案册：包含完整的变位答案</li>
                                <li>• 点击导出后打开打印预览，选择&ldquo;保存为PDF&rdquo;</li>
                              </ul>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                              <div className="flex flex-col">
                                <Label htmlFor="simplified-pdf" className="text-sm font-medium">
                                  简化版式
                                </Label>
                                <span className="text-xs text-gray-500">
                                  简洁打印友好的黑白版式
                                </span>
                              </div>
                              <Switch
                                id="simplified-pdf"
                                checked={simplifiedPDF}
                                onCheckedChange={setSimplifiedPDF}
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex space-x-2 pt-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsMobileExportDialogOpen(false)}
                            className="flex-1"
                          >
                            取消
                          </Button>
                          <Button 
                            onClick={() => {
                              exportSelected();
                              setIsMobileExportDialogOpen(false);
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            导出 ({filters.selectedRows.length})
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              {/* Export Dropdown */}
              <div className="hidden sm:flex items-center space-x-2">
                <Select 
                  value={exportFormat} 
                  onValueChange={(value: 'csv' | 'xlsx' | 'json' | 'pdf-practice' | 'pdf-answers') => setExportFormat(value)}
                  disabled={filters.selectedRows.length === 0}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue />
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
                  variant="outline" 
                  size="sm"
                  onClick={exportSelected}
                  disabled={filters.selectedRows.length === 0}
                >
                  导出
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Full Height */}
      <div className="flex flex-1 overflow-hidden">
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
            className="flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden force-pointer-events"
          >
            {isFilterPanelCollapsed ? (
              <div className="bg-gray-50 h-full flex flex-col items-center justify-start">
                <motion.button
                  onClick={() => setIsFilterPanelCollapsed(false)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded mt-4 mb-2 transition-colors duration-200"
                  title="显示筛选"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
                <div className="writing-mode-vertical text-xs text-gray-400 mt-2 select-none">
                  筛选
                </div>
                
                {/* Visual indicator of active filters */}
                {(filters.books.length > 0 || filters.lessons.length > 0 || filters.partsOfSpeech.length > 0 || filters.textSearch) && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-4" />
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Filter Panel Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h2 className="text-sm font-medium text-gray-900">筛选</h2>
                  <motion.button
                    onClick={() => setIsFilterPanelCollapsed(true)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors duration-200"
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
                    onBooksChange={(books) => setFilters(prev => ({ ...prev, books }))}
                    onLessonsChange={(lessons) => setFilters(prev => ({ ...prev, lessons }))}
                    onPartsOfSpeechChange={(partsOfSpeech) => setFilters(prev => ({ ...prev, partsOfSpeech }))}
                    onTextSearchChange={(textSearch) => setFilters(prev => ({ ...prev, textSearch }))}
                    onSearchFieldsChange={(searchFields) => setFilters(prev => ({ ...prev, searchFields }))}
                    onSelectedConjugationsChange={handleSelectedConjugationsChange}
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
              className="px-4 sm:px-6 py-2 bg-blue-50 border-b border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span>
                    PDF打印模式：将为选中的 <span className="font-medium">{vocabulary.filter(v => filters.selectedRows.includes(v._id) && v.part_of_speech.includes('动')).length} 个动词</span> 
                    生成 <span className="font-medium">{exportFormat === 'pdf-practice' ? '练习册' : '答案册'}</span>，
                    包含 <span className="font-medium">{filters.selectedConjugations.length} 种变位形式</span>。
                    点击导出后将打开打印预览。
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="simplified-pdf-desktop" className="text-xs text-blue-600">
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
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0 min-h-[64px]">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Checkbox
                  checked={paginatedVocabulary.length > 0 && 
                    paginatedVocabulary.every(item => 
                      filters.selectedRows.includes(item._id)
                    )}
                  onCheckedChange={handleSelectAll}
                  aria-label="全选本页"
                />
                <Label className="text-sm text-gray-600 hidden sm:block">全选</Label>
              </div>
              {/* Always render selection controls but hide when no selection */}
              <div className={`flex items-center space-x-3 transition-opacity duration-200 ${
                filters.selectedRows.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  已选择 {filters.selectedRows.length} 项
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearSelection}
                  className="text-gray-500 hover:text-gray-700"
                  tabIndex={filters.selectedRows.length > 0 ? 0 : -1}
                >
                  清除
                </Button>
              </div>
            </div>
            {/* Mobile filter count indicator */}
            {isMobile && (filters.books.length > 0 || filters.lessons.length > 0 || filters.partsOfSpeech.length > 0 || filters.textSearch) && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
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
      </div>

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
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[120px]">
              <div className="text-xs text-gray-600 mb-2 font-medium">导出格式</div>
              <Select 
                value={exportFormat} 
                onValueChange={(value: 'csv' | 'xlsx' | 'json' | 'pdf-practice' | 'pdf-answers') => setExportFormat(value)}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf-practice">PDF练习</SelectItem>
                  <SelectItem value="pdf-answers">PDF答案</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export Button */}
            <Button
              className="bg-green-600 text-white hover:bg-green-700 shadow-lg rounded-full w-12 h-12"
              onClick={() => {
                exportSelected();
                setIsMobileFABExpanded(false);
              }}
            >
              <Download className="w-5 h-5" />
            </Button>
            
            {/* Practice Button */}
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

          {/* Main FAB */}
          <Button 
            className="bg-black text-white hover:bg-gray-800 shadow-lg rounded-full w-14 h-14"
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
        </div>
      )}
    </div>
  );
}
