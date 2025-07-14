'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isMobile?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  isMobile = false,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt((e.target as HTMLInputElement).value);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    }
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={`flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-100 ${isMobile ? 'flex-col space-y-4' : ''}`}>
      <div className="text-sm text-gray-500 order-2 sm:order-1">
        {totalItems > 0 ? (
          <>
            {isMobile ? (
              <>{totalItems.toLocaleString()} items</>
            ) : (
              <>{startItem}–{endItem} of {totalItems.toLocaleString()}</>
            )}
          </>
        ) : (
          'No results'
        )}
      </div>

      <div className={`flex items-center space-x-4 order-1 sm:order-2 ${isMobile ? 'w-full justify-between' : ''}`}>
        {/* Page size selector */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className={isMobile ? 'hidden' : ''}>Rows:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(parseInt(value))}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="pagination-page-size-25" value="25">25</SelectItem>
              <SelectItem key="pagination-page-size-50" value="50">50</SelectItem>
              <SelectItem key="pagination-page-size-100" value="100">100</SelectItem>
              <SelectItem key="pagination-page-size-200" value="200">200</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canGoPrevious}
              className="px-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center space-x-1 text-sm">
              {isMobile ? (
                <span className="text-gray-600 min-w-[4rem] text-center">
                  {currentPage} / {totalPages}
                </span>
              ) : (
                <>
                  <Input
                    type="number"
                    value={currentPage}
                    onChange={handlePageInputChange}
                    onKeyDown={handlePageInputKeyDown}
                    className="w-16 h-8 text-center text-sm"
                    min={1}
                    max={totalPages}
                  />
                  <span className="text-gray-400">of {totalPages}</span>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canGoNext}
              className="px-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
