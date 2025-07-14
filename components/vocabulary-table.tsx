'use client';

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Star, ChevronRight } from 'lucide-react';
import { VocabularyItem, VerbConjugations } from '@/lib/types';
import { getPartOfSpeechColor } from '@/lib/vocabulary-utils';
import { isVerb } from '@/lib/conjugation-utils';
import VerbConjugationDisplay from './verb-conjugation-display';

interface VocabularyTableProps {
  vocabulary: VocabularyItem[];
  selectedRows: string[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  selectedConjugations: (keyof VerbConjugations)[];
  onRowSelect: (rowId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onSort: (column: string) => void;
  onBookmark: (rowId: string) => void;
  bookmarkedRows: string[];
  isMobile?: boolean;
}

export default function VocabularyTable({
  vocabulary,
  selectedRows,
  sortColumn,
  sortDirection,
  selectedConjugations,
  onRowSelect,
  onSelectAll,
  onSort,
  onBookmark,
  bookmarkedRows,
  isMobile = false,
}: VocabularyTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const allSelected = vocabulary.length > 0 && 
    vocabulary.every(item => selectedRows.includes(getRowId(item)));

  const someSelected = selectedRows.length > 0 && !allSelected;

  function getRowId(item: VocabularyItem): string {
    return item._id;
  }

  const handleSelectAll = () => {
    onSelectAll(!allSelected);
  };

  const handleRowSelect = (item: VocabularyItem) => {
    const rowId = getRowId(item);
    const isSelected = selectedRows.includes(rowId);
    onRowSelect(rowId, !isSelected);
  };

  const toggleRowExpansion = (item: VocabularyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const rowId = getRowId(item);
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const handleSort = (column: string) => {
    onSort(column);
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  return (
    <div className="w-full">
      {isMobile ? (
        // Mobile Card View
        <>
          {/* Mobile Sort Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleSort('japanese')}
                  className={`text-sm transition-colors ${
                    sortColumn === 'japanese'
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Japanese {getSortIcon('japanese')}
                </button>
                <button
                  onClick={() => handleSort('reading')}
                  className={`text-sm transition-colors ${
                    sortColumn === 'reading'
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Reading {getSortIcon('reading')}
                </button>
                <button
                  onClick={() => handleSort('meaning')}
                  className={`text-sm transition-colors ${
                    sortColumn === 'meaning'
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Meaning {getSortIcon('meaning')}
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 p-4">
            {vocabulary.map((item) => {
              const rowId = getRowId(item);
              const isSelected = selectedRows.includes(rowId);
              const isBookmarked = bookmarkedRows.includes(rowId);

              return (
                <div
                  key={`vocabulary-mobile-card-${item._id}`}
                  className={`
                    bg-white border rounded-lg p-4 transition-colors
                    ${isSelected 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => handleRowSelect(item)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2 sm:space-x-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onRowSelect(rowId, checked as boolean)}
                        aria-label={`Select ${item.japanese_word}`}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-lg text-gray-900">{item.japanese_word}</div>
                        <div className="text-gray-600 text-sm">{item.reading}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBookmark(rowId)}
                        className={`px-2 ${
                          isBookmarked 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-gray-900">{item.chinese_meaning}</div>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPartOfSpeechColor(item.part_of_speech)}`}
                      >
                        {item.part_of_speech}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {item.lesson_name}
                      </div>
                    </div>
                    
                    {item.example_sentences.length > 0 && (
                      <div className="text-xs text-gray-400">
                        {item.example_sentences.length} example{item.example_sentences.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        // Desktop Table View
        <Table>
          <TableHeader className="sticky top-0 bg-gray-50">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  {...(someSelected && { 'data-state': 'indeterminate' })}
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('japanese')}
              >
                <div className="flex items-center space-x-1">
                  <span>Japanese</span>
                  {getSortIcon('japanese')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('reading')}
              >
                <div className="flex items-center space-x-1">
                  <span>Reading</span>
                  {getSortIcon('reading')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('meaning')}
              >
                <div className="flex items-center space-x-1">
                  <span>Meaning</span>
                  {getSortIcon('meaning')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('part_of_speech')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  {getSortIcon('part_of_speech')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('lesson')}
              >
                <div className="flex items-center space-x-1">
                  <span>Lesson</span>
                  {getSortIcon('lesson')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('examples')}
              >
                <div className="flex items-center space-x-1">
                  <span>Examples</span>
                  {getSortIcon('examples')}
                </div>
              </TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vocabulary.map((item) => {
              const rowId = getRowId(item);
              const isSelected = selectedRows.includes(rowId);
              const isBookmarked = bookmarkedRows.includes(rowId);
              const isHovered = hoveredRow === rowId;
              const isExpanded = expandedRows.has(rowId);
              const isVerbItem = isVerb(item.part_of_speech);

              return (
                <>
                  <TableRow
                    key={`vocabulary-table-row-${item._id}`}
                    className={`
                      transition-colors cursor-pointer
                      ${isSelected 
                        ? 'bg-blue-50 border-l-2 border-l-blue-500' 
                        : isHovered ? 'bg-gray-50' : ''
                      }
                    `}
                    onMouseEnter={() => setHoveredRow(rowId)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => handleRowSelect(item)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => onRowSelect(rowId, checked as boolean)}
                          aria-label={`Select ${item.japanese_word}`}
                        />
                        {isVerbItem && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => toggleRowExpansion(item, e)}
                            className="p-1 hover:bg-gray-200"
                          >
                            <ChevronRight 
                              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                            />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.japanese_word}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {item.reading}
                    </TableCell>
                    <TableCell className="text-gray-900 text-sm">
                      {item.chinese_meaning}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPartOfSpeechColor(item.part_of_speech)}`}
                      >
                        {item.part_of_speech}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {item.lesson_name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-400">
                      {item.example_sentences.length}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900 px-2"
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onBookmark(rowId)}
                          className={`px-1 ${
                            isBookmarked 
                              ? 'text-yellow-500 hover:text-yellow-600' 
                              : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {isVerbItem && isExpanded && (
                    <TableRow key={`vocabulary-table-conjugations-${item._id}`}>
                      <TableCell colSpan={8} className="p-0">
                        <VerbConjugationDisplay 
                          vocabulary={item} 
                          selectedConjugations={selectedConjugations}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
