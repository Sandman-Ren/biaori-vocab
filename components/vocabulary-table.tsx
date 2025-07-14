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
import { ChevronUp, ChevronDown, Star } from 'lucide-react';
import { VocabularyItem } from '@/lib/types';
import { getPartOfSpeechColor } from '@/lib/vocabulary-utils';

interface VocabularyTableProps {
  vocabulary: VocabularyItem[];
  selectedRows: string[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onRowSelect: (rowId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onSort: (column: string) => void;
  onBookmark: (rowId: string) => void;
  bookmarkedRows: string[];
}

export default function VocabularyTable({
  vocabulary,
  selectedRows,
  sortColumn,
  sortDirection,
  onRowSelect,
  onSelectAll,
  onSort,
  onBookmark,
  bookmarkedRows,
}: VocabularyTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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

  const handleSort = (column: string) => {
    onSort(column);
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  return (
    <div className="w-full">
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

            return (
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
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onRowSelect(rowId, checked as boolean)}
                    aria-label={`Select ${item.japanese_word}`}
                  />
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
