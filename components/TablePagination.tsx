
import React from 'react';
import Button from './Button';
import SearchableSelect from './SearchableSelect';
import { SelectOption } from '../types';
import { AdvancedFiltersIcon } from '../constants'; 

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  itemsPerPageOptions: SelectOption[];
  onItemsPerPageChange: (value: string) => void;
  // onOpenAdvancedFiltersModal?: () => void; // Removed
  // areAdvancedFiltersActive?: boolean; // Removed
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  itemsPerPageOptions,
  onItemsPerPageChange,
  // onOpenAdvancedFiltersModal, // Removed
  // areAdvancedFiltersActive, // Removed
}) => {
  if (totalPages <= 1 && itemsPerPageOptions.length > 0 && totalItems <= Number(itemsPerPageOptions[0].value)) {
    if (totalItems <= Number(itemsPerPageOptions[0].value)) {
        return null;
    }
  }

  const pageNumbers = [];
  const maxPageButtons = 5; 

  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const firstItemIndex = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between py-3 px-1 bg-white border-t border-gray-200 sm:px-2">
      {/* Mobile view */}
      <div className="flex-1 flex justify-between sm:hidden">
        <Button size="sm" variant="outline" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <div className="mx-1 flex items-center gap-1">
          <SearchableSelect label="" options={itemsPerPageOptions} value={itemsPerPage.toString()} onChange={onItemsPerPageChange} allowClear={false} showSearch={false}/>
          {/* Advanced Filters button removed from here */}
        </div>
        <Button size="sm" variant="outline" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2"> {/* Left group: Rows selector */}
          <div className="w-32">
            <SearchableSelect label="" options={itemsPerPageOptions} value={itemsPerPage.toString()} onChange={onItemsPerPageChange} allowClear={false} showSearch={false}/>
          </div>
          {/* Advanced Filters button removed from here */}
        </div>

        <div className="flex-1 text-center">
          {totalItems > 0 && (
            <p className="text-xs text-gray-700">
              Showing <span className="font-medium">{firstItemIndex}</span> to <span className="font-medium">{lastItemIndex}</span> of{' '}
              <span className="font-medium">{totalItems.toLocaleString()}</span> results
            </p>
          )}
           {totalItems === 0 && (
            <p className="text-xs text-gray-700">No results</p>
           )}
        </div>

        <div>
          {totalPages > 0 && (
            <nav className="relative z-0 inline-flex rounded-md shadow-sm space-x-1" aria-label="Pagination">
              <Button size="sm" variant="outline" className="rounded-l-md px-2" onClick={() => onPageChange(1)} disabled={currentPage === 1 || totalPages === 0}>First</Button>
              <Button size="sm" variant="outline" className="px-2" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1 || totalPages === 0}>Prev</Button>
              {startPage > 1 && totalPages > maxPageButtons && <span className="relative inline-flex items-center px-1.5 py-1 border border-gray-300 bg-white text-xs font-medium text-gray-700">...</span>}
              {pageNumbers.map(number => (
                <Button key={number} size="sm" variant={number === currentPage ? 'primary' : 'outline'} className="px-2.5" onClick={() => onPageChange(number)} disabled={totalPages === 0}>{number}</Button>
              ))}
              {endPage < totalPages && totalPages > maxPageButtons && <span className="relative inline-flex items-center px-1.5 py-1 border border-gray-300 bg-white text-xs font-medium text-gray-700">...</span>}
              <Button size="sm" variant="outline" className="px-2" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
              <Button size="sm" variant="outline" className="rounded-r-md px-2" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages || totalPages === 0}>Last</Button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default TablePagination;