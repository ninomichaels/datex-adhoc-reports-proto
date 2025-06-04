
import React from 'react';
import { DataRow, SortConfig, SortDirection, ColumnDefinition, SelectOption, DisplayRow, GroupRow } from '../types';
import { ChevronUpIcon, ChevronDownIcon, XMarkIcon, ChevronRightIcon } from '../constants.tsx'; 
import TablePagination from './TablePagination';

interface DataTableProps {
  columns: ColumnDefinition[];
  data: DisplayRow[]; 
  sortConfig: SortConfig; 
  onSort: (key: keyof DataRow | string) => void;
  onRemoveSort: (key: keyof DataRow | string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  columnTotals: { [key: string]: number | string };
  itemsPerPageOptions: SelectOption[];
  onItemsPerPageChange: (value: string) => void;
  groupByColumnId?: string;
  subGroupByColumnId?: string; // New prop for sub-grouping
  expandedGroups?: Set<string>;
  onToggleGroupExpand?: (groupId: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  sortConfig,
  onSort,
  onRemoveSort,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  columnTotals,
  itemsPerPageOptions,
  onItemsPerPageChange,
  groupByColumnId,
  subGroupByColumnId, // Use this
  expandedGroups,
  onToggleGroupExpand,
}) => {
  if (!columns || columns.length === 0) {
    return <div className="p-4 text-center text-gray-500 h-full flex items-center justify-center">No columns selected. Please select columns to display data.</div>;
  }

  const formatCellValue = (value: any, column: ColumnDefinition): string => {
    if (value === undefined || value === null || value === '') return '-';
    if (typeof value === 'number') {
      if (column.label.includes('($)')) {
        return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      }
      if (column.label.includes('(%)') && !column.label.toLowerCase().includes("rate")) { 
         return `${value.toFixed(2)}%`;
      }
      const minDigits = column.id.toLowerCase().includes('rate') || column.id.toLowerCase().includes('percentage') ? 2 : 0;
      const maxDigits = 2;
      return value.toLocaleString(undefined, { minimumFractionDigits: minDigits, maximumFractionDigits: maxDigits });
    }
    if (value instanceof Date) {
        return value.toLocaleDateString();
    }
    return String(value);
  };


  return (
    <div className="bg-white shadow-md rounded-lg flex flex-col h-full overflow-hidden">
      <div className="shrink-0">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          itemsPerPageOptions={itemsPerPageOptions}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-grow relative">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {columns.map((col) => {
                const sortIndex = sortConfig.findIndex(item => item.key === col.id);
                const currentSortItem = sortIndex !== -1 ? sortConfig[sortIndex] : null;
                const isNumericColumn = col.dataType === 'number';
                return (
                  <th
                    key={col.id.toString()}
                    scope="col"
                    className={`px-4 py-3 ${isNumericColumn ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap ${col.id === columns[0]?.id ? 'sticky left-0 z-20 bg-gray-50' : ''}`}
                    onClick={() => onSort(col.id)} 
                    style={{ minWidth: col.id === columns[0]?.id ? '150px' : 'auto' }}
                    aria-sort={currentSortItem ? (currentSortItem.direction === SortDirection.ASC ? 'ascending' : 'descending') : 'none'}
                  >
                    <div className={`flex items-center ${isNumericColumn ? 'justify-end' : ''}`}>
                      {col.label}
                      {currentSortItem && (
                        currentSortItem.direction === SortDirection.ASC ? (
                          <ChevronUpIcon className="w-3.5 h-3.5 text-gray-600 ml-1.5" />
                        ) : (
                          <ChevronDownIcon className="w-3.5 h-3.5 text-gray-600 ml-1.5" />
                        )
                      )}
                      {currentSortItem && (
                        <div className="ml-1 relative group/badge">
                          <span className="text-xs font-medium text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-md">
                            {sortIndex + 1}
                          </span>
                          <button
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onRemoveSort(col.id);
                            }}
                            className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover/badge:opacity-100 hover:bg-red-700 transition-opacity z-10"
                            aria-label={`Remove ${col.label} from sort`}
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-sm text-gray-500">
                  No data available for the current filters.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                if ((row as GroupRow).isGroupHeader) {
                  const groupRow = row as GroupRow;
                  const isExpanded = expandedGroups?.has(groupRow.id);
                  const groupRowBg = groupRow.level === 0 ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-50 hover:bg-gray-100';
                  const groupRowText = groupRow.level === 0 ? 'text-gray-800' : 'text-gray-700';
                  const stickyBg = groupRow.level === 0 ? 'bg-gray-100 group-hover:bg-gray-200' : 'bg-gray-50 group-hover:bg-gray-100';
                  const indentPadding = groupRow.level === 1 ? 'pl-8' : 'pl-4';

                  return (
                    <tr 
                      key={groupRow.id} 
                      className={`${groupRowBg} font-semibold cursor-pointer group`}
                      onClick={() => onToggleGroupExpand?.(groupRow.id)}
                    >
                      {columns.map((col, colIndex) => (
                        <td
                          key={`${groupRow.id}-${col.id}`}
                          className={`px-4 py-3 whitespace-nowrap text-sm ${groupRowText}
                                      ${colIndex === 0 ? `sticky left-0 z-0 ${stickyBg}` : ''}
                                      ${colIndex === 0 ? indentPadding : ''}
                                      ${col.dataType === 'number' || (typeof groupRow.aggregates[col.id] === 'number' && !col.label.includes('(%)')) ? 'text-right' : 'text-left'}`}
                        >
                          {colIndex === 0 && <div className={`absolute inset-y-0 -left-px border-r border-gray-200 ${stickyBg} -z-10`} />}
                          {col.id === groupRow.groupKeyField ? (
                            <div className="flex items-center">
                              {isExpanded ? <ChevronDownIcon className="w-4 h-4 mr-2 text-gray-600" /> : <ChevronRightIcon className="w-4 h-4 mr-2 text-gray-600" />}
                              {formatCellValue(groupRow.groupValue, col)}
                              <span className="ml-2 text-xs text-gray-500">({groupRow.subRowCount} items)</span>
                            </div>
                          ) : (
                            formatCellValue(groupRow.aggregates[col.id], col)
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                } else { // It's a DataRow
                  const dataRow = row as DataRow;
                   // Determine if this DataRow is nested under a primary group only, or a subgroup
                  let indentLevel = 0;
                  if (groupByColumnId) indentLevel = 1; // Base indent if primary grouping active
                  if (subGroupByColumnId && data.some(r => (r as GroupRow).isGroupHeader && (r as GroupRow).level === 1 && expandedGroups?.has(r.id) && (r as GroupRow).subRows.includes(dataRow))) {
                     // Check if it's under an expanded subgroup (level 1)
                    indentLevel = 2; // Deeper indent if under subgroup
                  }
                  const dataRowIndentPadding = indentLevel === 1 ? 'pl-8' : (indentLevel === 2 ? 'pl-12' : 'pl-4');


                  return (
                    <tr key={dataRow.id || rowIndex} className={`hover:bg-gray-50 group bg-white`}>
                      {columns.map((col, colIndex) => (
                        <td 
                          key={`${dataRow.id}-${col.id}`} 
                          className={`px-4 py-3 whitespace-nowrap text-sm text-gray-700 
                                      ${colIndex === 0 ? `sticky left-0 z-0 bg-white group-hover:bg-gray-50` : ''} 
                                      ${colIndex === 0 ? dataRowIndentPadding : ''}
                                      ${col.dataType === 'number' || (typeof dataRow[col.id] === 'number' && !col.label.includes('(%)')) ? 'text-right' : 'text-left'}
                                    `}
                        >
                          {colIndex === 0 && <div className="absolute inset-y-0 -left-px border-r border-gray-200 group-hover:bg-gray-50 bg-white -z-10" />}
                          {formatCellValue(dataRow[col.id], col)}
                        </td>
                      ))}
                    </tr>
                  );
                }
              })
            )}
          </tbody>
           {columns.length > 0 && data.length > 0 && !groupByColumnId && ( 
            <tfoot className="sticky bottom-0 z-10">
              <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                {columns.map((col, index) => {
                  const totalValue = columnTotals[col.id];
                  const isNumericTotal = totalValue !== '-' && typeof totalValue === 'number';
                  return (
                    <td
                      key={`total-footer-${col.id}`}
                      className={`px-4 py-3 text-sm text-gray-800 whitespace-nowrap 
                                  ${index === 0 ? 'sticky left-0 z-20 bg-gray-100' : 'bg-gray-100'}
                                  ${isNumericTotal || col.dataType === 'number' ? 'text-right' : 'text-left'}`}
                      style={{ minWidth: index === 0 ? '150px' : 'auto' }}
                    >
                      {formatCellValue(totalValue, col)}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default DataTable;