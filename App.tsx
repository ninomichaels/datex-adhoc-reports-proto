
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FilterValues, SortConfig, SortDirection, DataRow, ColumnDefinition, SelectOption, ColumnOption, AdvancedFilterRule, GroupRow, DisplayRow } from './types';
import {
  EXAMPLE_DATA,
  ALL_COLUMN_CONFIG,
  DEFAULT_VISIBLE_COLUMN_IDS,
  ITEMS_PER_PAGE,
  ITEMS_PER_PAGE_OPTIONS,
  MANAGERS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_SUBTYPE_OPTIONS,
  REGION_OPTIONS,
  BUILDING_OPTIONS,
  GROUP_BY_OPTIONS as INITIAL_GROUP_BY_OPTIONS, // Renamed for clarity
  FILTER_OPERATORS, 
  FilterIcon,
  ClearIcon, 
  DownloadIcon, 
  SaveIcon, 
  SettingsIcon as CogIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  XMarkIcon, 
  AdvancedFiltersIcon 
} from './constants.tsx';
import Button from './components/Button';
import SearchableSelect from './components/SearchableSelect';
import DataTable from './components/DataTable';
import ColumnsModal from './components/ColumnsModal';
import AdvancedFiltersModal from './components/AdvancedFiltersModal'; 

const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

const generateGroupId = (level: number, keyField: string, keyValue: any, parentGroupId?: string): string => {
  const safeKeyValue = String(keyValue).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  const part = `level${level}_${keyField}_${safeKeyValue}`;
  return parentGroupId ? `${parentGroupId}||${part}` : part;
};


const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterValues>({
    period: getCurrentYearMonth(),
    manager: [],
    propertyType: [],
    propertySubType: [],
    region: [],
    building: [],
    groupBy: '',
    subGroupBy: '', // New filter for subgrouping
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(DEFAULT_VISIBLE_COLUMN_IDS);
  const [showFilters, setShowFilters] = useState(true);

  const [isAdvancedFiltersModalOpen, setIsAdvancedFiltersModalOpen] = useState(false);
  const [advancedFilterRules, setAdvancedFilterRules] = useState<AdvancedFilterRule[]>([]);
  
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const groupByOptions = useMemo(() => {
    return INITIAL_GROUP_BY_OPTIONS.filter(opt => opt.value === '' || opt.value !== filters.subGroupBy);
  }, [filters.subGroupBy]);

  const subGroupByOptions = useMemo(() => {
    if (!filters.groupBy) {
      return [{ value: '', label: 'None' }]; // Only "None" if primary group is not set
    }
    return INITIAL_GROUP_BY_OPTIONS.filter(opt => opt.value === '' || opt.value !== filters.groupBy);
  }, [filters.groupBy]);


  const handleFilterChange = useCallback((filterName: keyof FilterValues, value: string | string[]) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterName]: value };
      if (filterName === 'groupBy') {
        // Reset expansions handled below by setExpandedGroups
        if (!value) { // If groupBy is cleared
          newFilters.subGroupBy = ''; // Clear subGroupBy as well
        }
      }
      // Reset expansions handled below by setExpandedGroups if filterName is 'subGroupBy'
      return newFilters;
    });
    setCurrentPage(1);
     if (filterName === 'groupBy' || filterName === 'subGroupBy') {
      setExpandedGroups(new Set());
    }
  }, []);

  const handleToggleGroupExpand = useCallback((groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
        // If a parent group is collapsed, collapse all its children subgroups too
        prev.forEach(id => {
          if (id.startsWith(groupId + "||")) {
            newSet.delete(id);
          }
        });
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  }, []);

  const handleSort = useCallback((keyToSort: keyof DataRow | string) => {
    setSortConfig(prevSortConfig => {
      const newSortConfig = [...prevSortConfig].map(sc => ({...sc}));
      const existingSortIndex = newSortConfig.findIndex(item => item.key === keyToSort);

      if (existingSortIndex !== -1) {
        newSortConfig[existingSortIndex].direction = 
          newSortConfig[existingSortIndex].direction === SortDirection.ASC 
          ? SortDirection.DESC 
          : SortDirection.ASC;
      } else {
        newSortConfig.push({ key: keyToSort, direction: SortDirection.ASC });
      }
      return newSortConfig;
    });
  }, []);

  const handleRemoveSortColumn = useCallback((keyToRemove: string) => {
    setSortConfig(prevSortConfig => prevSortConfig.filter(item => item.key !== keyToRemove));
  }, []);


  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }, []);

  const handleApplyColumns = useCallback((selectedColumnIds: string[], newSortConfig: SortConfig) => {
    setVisibleColumnIds(selectedColumnIds);
    setSortConfig(newSortConfig); 
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      period: getCurrentYearMonth(),
      manager: [],
      propertyType: [],
      propertySubType: [],
      region: [],
      building: [],
      groupBy: '',
      subGroupBy: '',
    });
    setAdvancedFilterRules([]); 
    setExpandedGroups(new Set());
    setCurrentPage(1);
  }, []);

  const handleOpenAdvancedFiltersModal = () => setIsAdvancedFiltersModalOpen(true);
  const handleCloseAdvancedFiltersModal = () => setIsAdvancedFiltersModalOpen(false);
  
  const currentColumns: ColumnDefinition[] = useMemo(() => {
    return visibleColumnIds.flatMap(id => {
      const matchingOption = ALL_COLUMN_CONFIG.find(opt => opt.id === id);
      if (matchingOption) {
        return [{
          id: matchingOption.id,
          label: matchingOption.label,
          isSummable: matchingOption.isSummable || false,
          dataType: matchingOption.dataType, 
        }];
      }
      return []; 
    });
  }, [visibleColumnIds]);
  
  const handleApplyAdvancedFilters = useCallback((rulesFromModal: AdvancedFilterRule[]) => {
    const visibleColumnIdsInModal = new Set(currentColumns.map(c => c.id));
    const persistentRulesForHiddenCols = advancedFilterRules.filter(
      appRule => !visibleColumnIdsInModal.has(appRule.field)
    );
    const newCombinedRules = [...persistentRulesForHiddenCols, ...rulesFromModal];
    setAdvancedFilterRules(newCombinedRules);
    setCurrentPage(1); 
  }, [advancedFilterRules, currentColumns]);


  const evaluateSingleRule = (row: DataRow, rule: AdvancedFilterRule): boolean => {
    const cellValue = row[rule.field];
    let ruleValue = rule.value;
    const operatorDef = FILTER_OPERATORS.find(op => op.value === rule.operator);

    if (rule.operator === 'is_empty') return cellValue === null || cellValue === undefined || cellValue === '';
    if (rule.operator === 'is_not_empty') return cellValue !== null && cellValue !== undefined && cellValue !== '';
    
    if (cellValue === null || cellValue === undefined) return false;

    switch (rule.dataType) {
      case 'string':
        const cellStr = String(cellValue).toLowerCase();
        const ruleStr = String(ruleValue).toLowerCase();
        if (rule.operator === 'is') return cellStr === ruleStr;
        if (rule.operator === 'is_not') return cellStr !== ruleStr;
        if (rule.operator === 'contains') return cellStr.includes(ruleStr);
        if (rule.operator === 'does_not_contain') return !cellStr.includes(ruleStr);
        if (rule.operator === 'starts_with') return cellStr.startsWith(ruleStr);
        if (rule.operator === 'ends_with') return cellStr.endsWith(ruleStr);
        break;
      case 'number':
        const cellNum = parseFloat(String(cellValue)); 
        const ruleNum = parseFloat(String(ruleValue)); 
        if (isNaN(cellNum) || isNaN(ruleNum)) return false; 
        if (rule.operator === 'eq') return cellNum === ruleNum;
        if (rule.operator === 'neq') return cellNum !== ruleNum;
        if (rule.operator === 'gt') return cellNum > ruleNum;
        if (rule.operator === 'lt') return cellNum < ruleNum;
        if (rule.operator === 'gte') return cellNum >= ruleNum;
        if (rule.operator === 'lte') return cellNum <= ruleNum;
        break;
      case 'date':
        try {
          const cellDateStr = String(cellValue);
          const ruleDateStr = String(ruleValue);
          if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(cellDateStr) || !/^\\d{4}-\\d{2}-\\d{2}$/.test(ruleDateStr)) return false;

          const cellDate = new Date(cellDateStr + 'T00:00:00Z');
          const ruleDate = new Date(ruleDateStr + 'T00:00:00Z');
          
          if (isNaN(cellDate.getTime()) || isNaN(ruleDate.getTime())) return false;

          if (rule.operator === 'date_is') return cellDate.getTime() === ruleDate.getTime();
          if (rule.operator === 'date_is_not') return cellDate.getTime() !== ruleDate.getTime();
          if (rule.operator === 'date_is_before') return cellDate.getTime() < ruleDate.getTime();
          if (rule.operator === 'date_is_after') return cellDate.getTime() > ruleDate.getTime();
          if (rule.operator === 'date_is_on_or_before') return cellDate.getTime() <= ruleDate.getTime();
          if (rule.operator === 'date_is_on_or_after') return cellDate.getTime() >= ruleDate.getTime();
        } catch (e) { return false; } 
        break;
      case 'boolean': 
          if (operatorDef?.requiresValue === false) {
              if (rule.operator === 'is_true') return cellValue === true;
              if (rule.operator === 'is_false') return cellValue === false;
          } else { 
              const ruleBool = rule.value === true || String(rule.value).toLowerCase() === 'true';
              return cellValue === ruleBool;
          }
          break;
    }
    return false; 
  };

  const baseFilteredRows = useMemo(() => {
    let data = [...EXAMPLE_DATA];

    if (filters.manager.length > 0) data = data.filter(row => filters.manager.includes(row.manager));
    if (filters.propertyType.length > 0) data = data.filter(row => filters.propertyType.includes(row.propertyType));
    if (filters.propertySubType.length > 0) data = data.filter(row => filters.propertySubType.includes(row.propertySubType));
    if (filters.region.length > 0) data = data.filter(row => filters.region.includes(row.region));
    if (filters.building.length > 0) data = data.filter(row => filters.building.includes(row.building));

    if (advancedFilterRules.length > 0) {
      data = data.filter(row => {
        if (advancedFilterRules.length === 0) return true;
        let overallMatch = evaluateSingleRule(row, advancedFilterRules[0]);
        for (let i = 1; i < advancedFilterRules.length; i++) {
          const rule = advancedFilterRules[i];
          const ruleMatch = evaluateSingleRule(row, rule);
          const conjunction = rule.conjunction || 'AND'; 
          if (conjunction === 'AND') {
            overallMatch = overallMatch && ruleMatch;
          } else if (conjunction === 'OR') {
            overallMatch = overallMatch || ruleMatch;
          }
        }
        return overallMatch;
      });
    }
    return data;
  }, [filters, advancedFilterRules]);

  const sortRows = useCallback((rows: DisplayRow[], currentSortConfig: SortConfig, columnsConfig: ColumnOption[]) => {
    if (currentSortConfig.length === 0) return rows;

    const columnDefsMap = new Map(columnsConfig.map(col => [col.id, col]));

    return [...rows].sort((a, b) => {
      for (const { key, direction } of currentSortConfig) {
        let valA: any, valB: any;
        const columnDef = columnDefsMap.get(key as string);
        const dataType = columnDef?.dataType;

        if ((a as GroupRow).isGroupHeader && (b as GroupRow).isGroupHeader) {
          const groupA = a as GroupRow;
          const groupB = b as GroupRow;
          if (key === groupA.groupKeyField) { valA = groupA.groupValue; valB = groupB.groupValue; }
          else { valA = groupA.aggregates[key]; valB = groupB.aggregates[key]; }
        } else if (!(a as GroupRow).isGroupHeader && !(b as GroupRow).isGroupHeader) {
          valA = (a as DataRow)[key!]; valB = (b as DataRow)[key!];
        } else { return 0; } // Should not happen if sorting consistently
        
        let comparisonResult = 0;
        if (valA === null || valA === undefined) comparisonResult = (valB === null || valB === undefined) ? 0 : -1;
        else if (valB === null || valB === undefined) comparisonResult = 1;
        else {
          if (dataType === 'date') {
            const dateA = new Date(String(valA)); const dateB = new Date(String(valB));
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) comparisonResult = dateA.getTime() - dateB.getTime();
            else comparisonResult = String(valA).localeCompare(String(valB));
          } else if (dataType === 'number' || (typeof valA === 'number' && typeof valB === 'number')) {
            comparisonResult = Number(valA) - Number(valB);
          } else if (dataType === 'string' || (typeof valA === 'string' && typeof valB === 'string')) {
            comparisonResult = String(valA).localeCompare(String(valB));
          } else if (dataType === 'boolean' || (typeof valA === 'boolean' && typeof valB === 'boolean')) {
              comparisonResult = (valA === valB) ? 0 : (valA ? 1 : -1);
          } else { comparisonResult = String(valA).localeCompare(String(valB)); }
        }
        if (comparisonResult !== 0) return direction === SortDirection.ASC ? comparisonResult : -comparisonResult;
      }
      return 0;
    });
  }, []);
  
  const groupData = useCallback((
    rowsToGroup: DataRow[], 
    groupKey: string, 
    level: number, 
    parentGroupId?: string
  ): GroupRow[] => {
    if (!groupKey) return [];

    const grouped = new Map<any, DataRow[]>();
    rowsToGroup.forEach(row => {
      const groupValue = row[groupKey];
      if (!grouped.has(groupValue)) grouped.set(groupValue, []);
      grouped.get(groupValue)!.push(row);
    });

    const groupRows: GroupRow[] = [];
    grouped.forEach((subRowsData, groupValue) => {
      const currentGroupId = generateGroupId(level, groupKey, groupValue, parentGroupId);
      const aggregates: { [key: string]: number | string } = {};
      currentColumns.forEach(col => {
        if (col.id === groupKey) aggregates[col.id] = groupValue;
        else if (col.isSummable) aggregates[col.id] = subRowsData.reduce((sum, sr) => sum + (Number(sr[col.id]) || 0), 0);
        else aggregates[col.id] = '';
      });

      let finalSubRows: DisplayRow[] = subRowsData;
      if (level === 0 && filters.subGroupBy && filters.subGroupBy !== groupKey) {
         // For primary groups, if subGroupBy is active, their subRows are secondary groups
        finalSubRows = groupData(subRowsData, filters.subGroupBy, 1, currentGroupId);
      } else {
        // For subgroups (level 1) or primary groups without subgrouping, sort their DataRows
        finalSubRows = sortRows(subRowsData, sortConfig, ALL_COLUMN_CONFIG) as DataRow[];
      }
      
      groupRows.push({
        id: currentGroupId,
        isGroupHeader: true,
        groupKeyField: groupKey,
        groupValue: groupValue,
        aggregates: aggregates,
        subRows: finalSubRows,
        subRowCount: subRowsData.length, // This always refers to the count of raw DataRows in this specific group value
        level: level,
      });
    });
    return sortRows(groupRows, sortConfig, ALL_COLUMN_CONFIG) as GroupRow[];
  }, [currentColumns, filters.subGroupBy, sortConfig, sortRows]);


  const processedAndSortedData = useMemo(() => {
    if (!filters.groupBy) {
      return sortRows(baseFilteredRows, sortConfig, ALL_COLUMN_CONFIG);
    }
    return groupData(baseFilteredRows, filters.groupBy, 0);
  }, [baseFilteredRows, filters.groupBy, groupData, sortConfig, sortRows]);


  const finalDisplayableRows = useMemo(() => {
    if (!filters.groupBy) {
      return processedAndSortedData as DataRow[]; // Already sorted DataRow[]
    }

    const displayRows: DisplayRow[] = [];
    function flattenGroup(group: GroupRow) {
      displayRows.push(group);
      if (expandedGroups.has(group.id)) {
        group.subRows.forEach(subRow => {
          if ((subRow as GroupRow).isGroupHeader) {
            flattenGroup(subRow as GroupRow); // Recursively flatten subgroups
          } else {
            displayRows.push(subRow as DataRow); // Add data row
          }
        });
      }
    }
    (processedAndSortedData as GroupRow[]).forEach(flattenGroup);
    return displayRows;
  }, [processedAndSortedData, filters.groupBy, expandedGroups]);


  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return finalDisplayableRows.slice(startIndex, startIndex + itemsPerPage);
  }, [finalDisplayableRows, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => Math.ceil(finalDisplayableRows.length / itemsPerPage), [finalDisplayableRows.length, itemsPerPage]);

  const columnTotals = useMemo(() => {
    const totals: { [key: string]: number | string } = {};
    currentColumns.forEach(col => {
      if (col.isSummable) {
        const sum = baseFilteredRows.reduce((acc, row) => {
          const value = row[col.id];
          return acc + (typeof value === 'number' && !isNaN(value) ? value : 0);
        }, 0);
        totals[col.id] = sum;
      } else {
        totals[col.id] = '-';
      }
    });
    return totals;
  }, [baseFilteredRows, currentColumns]);

  const areAdvancedFiltersActive = advancedFilterRules.length > 0;
  const advancedFiltersButtonText = areAdvancedFiltersActive 
    ? `Advanced Filters Enabled (${advancedFilterRules.length})` 
    : "Advanced Filters";
  const advancedFiltersButtonClass = areAdvancedFiltersActive 
    ? "bg-teal-100 border-teal-500 text-teal-700 hover:bg-teal-50 hover:border-teal-600 focus:ring-teal-400" 
    : "!border-teal-600 text-teal-600 hover:bg-teal-50 hover:text-teal-700 focus:ring-teal-400";
  
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <main className="flex flex-col flex-grow overflow-hidden px-4 pt-2 pb-0">
        <div className="mb-2 p-1 shrink-0">
          <h1 className="text-lg font-semibold text-gray-700">Commercial / Building Data Report</h1>
        </div>

        <div className="mb-3 p-3 bg-white rounded-lg shadow shrink-0">
          <div className="flex items-end justify-between gap-4 mb-0">
            <div className="flex items-end gap-4">
              <div className="flex flex row items-center">
                <label htmlFor="period-picker" className="block text-xs font-medium text-gray-700 mr-2">Report Period</label>
                <input
                  type="month"
                  id="period-picker"
                  name="period"
                  value={filters.period}
                  onChange={(e) => handleFilterChange('period', e.target.value)}
                  className="bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-[34px]"
                  aria-label="Select reporting period month and year"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<FilterIcon />}
                aria-expanded={showFilters}
                aria-controls="filter-panel"
                className="h-[34px] border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {showFilters 
                  ? <ChevronUpIcon className="w-4 h-4 ml-1.5" /> 
                  : <ChevronDownIcon className="w-4 h-4 ml-1.5" />
                }
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" leftIcon={<DownloadIcon />}>Download</Button>
              <Button variant="outline" size="sm" leftIcon={<SaveIcon />}>Save View</Button>
              <Button variant="primary" size="sm" leftIcon={<CogIcon />} onClick={() => setIsColumnsModalOpen(true)}>
                Columns
              </Button>
            </div>
          </div>

          {showFilters && (
            <div id="filter-panel" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 pb-1 border-t border-gray-200 pt-3 mt-3">
              <SearchableSelect label="Manager" options={MANAGERS_OPTIONS} value={filters.manager} onChange={(value) => handleFilterChange('manager', value)} isMultiSelect placeholder="All Managers"/>
              <SearchableSelect label="Property Type" options={PROPERTY_TYPE_OPTIONS} value={filters.propertyType} onChange={(value) => handleFilterChange('propertyType', value)} isMultiSelect placeholder="All Types"/>
              <SearchableSelect label="Property SubType" options={PROPERTY_SUBTYPE_OPTIONS} value={filters.propertySubType} onChange={(value) => handleFilterChange('propertySubType', value)} isMultiSelect placeholder="All SubTypes"/>
              <SearchableSelect label="Region" options={REGION_OPTIONS} value={filters.region} onChange={(value) => handleFilterChange('region', value)} isMultiSelect placeholder="All Regions"/>
              <SearchableSelect label="Building" options={BUILDING_OPTIONS} value={filters.building} onChange={(value) => handleFilterChange('building', value)} isMultiSelect placeholder="All Buildings"/>
              
              <SearchableSelect 
                  label="Group By" 
                  options={groupByOptions} 
                  value={filters.groupBy} 
                  onChange={(value) => handleFilterChange('groupBy', value as string)} 
                  placeholder="None" 
                  allowClear={true}
                  showSearch={groupByOptions.length > 10}
              />
              <SearchableSelect 
                  label="Subgroup By" 
                  options={subGroupByOptions} 
                  value={filters.subGroupBy} 
                  onChange={(value) => handleFilterChange('subGroupBy', value as string)} 
                  placeholder="None" 
                  allowClear={true}
                  disabled={!filters.groupBy} // Disable if no primary group
                  showSearch={subGroupByOptions.length > 10}
              />
              
              <div className="xl:col-start-5 flex items-end"> 
                 <Button 
                  variant="outline" 
                  size="md" 
                  onClick={handleOpenAdvancedFiltersModal} 
                  leftIcon={<AdvancedFiltersIcon />}
                  className={`w-full ${advancedFiltersButtonClass}`}
                >
                  {advancedFiltersButtonText}
                </Button>
              </div>
              <div className="flex items-end"> 
                <Button variant="outline" size="md" onClick={clearAllFilters} leftIcon={<ClearIcon />} className="w-full border-rose-500 text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:ring-rose-400">
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-grow overflow-hidden relative">
          <DataTable
            columns={currentColumns}
            data={paginatedData}
            sortConfig={sortConfig}
            onSort={handleSort}
            onRemoveSort={handleRemoveSortColumn}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage} 
            totalItems={finalDisplayableRows.length}
            columnTotals={columnTotals}
            itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS} 
            onItemsPerPageChange={handleItemsPerPageChange}
            groupByColumnId={filters.groupBy}
            subGroupByColumnId={filters.subGroupBy} // Pass subGroupBy
            expandedGroups={expandedGroups}
            onToggleGroupExpand={handleToggleGroupExpand}
          />
        </div>
      </main>

      <ColumnsModal 
        isOpen={isColumnsModalOpen} 
        onClose={() => setIsColumnsModalOpen(false)} 
        onApply={handleApplyColumns} 
        allColumnOptions={ALL_COLUMN_CONFIG} 
        initiallySelectedIds={visibleColumnIds} 
        sortConfig={sortConfig}
      />
      <AdvancedFiltersModal 
        isOpen={isAdvancedFiltersModalOpen} 
        onClose={handleCloseAdvancedFiltersModal} 
        onApplyFilters={handleApplyAdvancedFilters} 
        columns={currentColumns} 
        initialRules={advancedFilterRules} 
      />
    </div>
  );
};

export default App;