
import React, { useState, useEffect, useMemo } from 'react';
import { ColumnOption, SortConfig, SortDirection } from '../types';
import Button from './Button';
import { SearchIcon, XMarkIcon, GrabHandleIcon, ChevronUpIcon, ChevronDownIcon } from '../constants.tsx';

interface ColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (orderedSelectedColumnIds: string[], newSortConfig: SortConfig) => void; 
  allColumnOptions: ColumnOption[];
  initiallySelectedIds: string[];
  sortConfig: SortConfig; 
}

// --- Professional SVG Icons ---
const GeneralIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
  </svg>
);
const OccupancyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18A2.25 2.25 0 006.75 21h10.5A2.25 2.25 0 0019.5 18.75V5.25A2.25 2.25 0 0017.25 3H6.75A2.25 2.25 0 004.5 5.25zm4.5-1.5V5.25" />
  </svg>
);
const FinancialsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v18h18M7.5 18V9.75m4.5 8.25V6m4.5 12V12.75" />
  </svg>
);
const MarketingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.586 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.044 5.25M19.175 3A23.74 23.74 0 0018.795 3m0 18A23.74 23.74 0 0019.175 21m0-1.125a23.91 23.91 0 001.044-5.25M18.795 21A23.74 23.74 0 0019.175 21" />
  </svg>
);
const SalesIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);
const ListIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);
// Generic sort icon (optional, for non-active sort states)
const SortGenericIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 3.75V16.25M10 3.75L6.25 7.5M10 3.75L13.75 7.5M10 16.25L6.25 12.5M10 16.25L13.75 12.5" />
  </svg>
);


interface CategoryStyle {
  listItemBorder: string;
  tabActiveBg: string;
  tabActiveText: string;
  tabInactiveBg: string;
  tabInactiveText: string;
  tabInactiveHoverBg?: string;
}

const CATEGORY_STYLES: { [key: string]: CategoryStyle } = {
  'All':      { listItemBorder: 'border-gray-500',   tabActiveBg: 'bg-gray-700',  tabActiveText: 'text-white',    tabInactiveBg: 'bg-gray-200',   tabInactiveText: 'text-gray-800', tabInactiveHoverBg: 'hover:bg-gray-300' },
  'General':    { listItemBorder: 'border-sky-500',   tabActiveBg: 'bg-sky-600',   tabActiveText: 'text-white', tabInactiveBg: 'bg-sky-100',   tabInactiveText: 'text-sky-700', tabInactiveHoverBg: 'hover:bg-sky-200' },
  'Occupancy':  { listItemBorder: 'border-teal-500',  tabActiveBg: 'bg-teal-600',  tabActiveText: 'text-white', tabInactiveBg: 'bg-teal-100',  tabInactiveText: 'text-teal-700', tabInactiveHoverBg: 'hover:bg-teal-200' },
  'Financials': { listItemBorder: 'border-slate-500', tabActiveBg: 'bg-slate-600', tabActiveText: 'text-white', tabInactiveBg: 'bg-slate-100', tabInactiveText: 'text-slate-700', tabInactiveHoverBg: 'hover:bg-slate-200' },
  'Marketing':  { listItemBorder: 'border-indigo-500', tabActiveBg: 'bg-indigo-600', tabActiveText: 'text-white', tabInactiveBg: 'bg-indigo-100', tabInactiveText: 'text-indigo-700', tabInactiveHoverBg: 'hover:bg-indigo-200' },
  'Sales':      { listItemBorder: 'border-rose-500',   tabActiveBg: 'bg-rose-600',   tabActiveText: 'text-white', tabInactiveBg: 'bg-rose-100',   tabInactiveText: 'text-rose-700', tabInactiveHoverBg: 'hover:bg-rose-200' },
  'default':    { listItemBorder: 'border-gray-500',   tabActiveBg: 'bg-gray-600',   tabActiveText: 'text-white', tabInactiveBg: 'bg-gray-100',   tabInactiveText: 'text-gray-700', tabInactiveHoverBg: 'hover:bg-gray-200' },
};

const CATEGORY_ICONS: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  'All': ListIcon,
  'General': GeneralIcon,
  'Occupancy': OccupancyIcon,
  'Financials': FinancialsIcon,
  'Marketing': MarketingIcon,
  'Sales': SalesIcon,
};


const ColumnsModal: React.FC<ColumnsModalProps> = ({
  isOpen,
  onClose,
  onApply,
  allColumnOptions,
  initiallySelectedIds,
  sortConfig, 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIdsSet, setSelectedIdsSet] = useState<Set<string>>(new Set());
  const [orderedSelectedIds, setOrderedSelectedIds] = useState<string[]>([]);
  const [localSortConfig, setLocalSortConfig] = useState<SortConfig>([]);
  
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allColumnOptions.map(opt => opt.category));
    return ['All', ...Array.from(uniqueCategories)];
  }, [allColumnOptions]);

  const [activeTab, setActiveTab] = useState<string>(categories[0] || 'All');
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedIdsSet(new Set(initiallySelectedIds));
      setOrderedSelectedIds([...initiallySelectedIds]);
      // Deep copy for local modification, preserving original objects for stability if not changed
      setLocalSortConfig([...sortConfig].map(sc => ({...sc}))); 
      if (!categories.includes(activeTab)) {
        setActiveTab(categories[0] || 'All');
      }
    }
  }, [isOpen, initiallySelectedIds, sortConfig, categories, activeTab]);


  const handleToggleSelection = (optionId: string) => {
    const newSelectedIdsSet = new Set(selectedIdsSet);
    let newOrderedSelectedIds = [...orderedSelectedIds];

    if (newSelectedIdsSet.has(optionId)) {
      newSelectedIdsSet.delete(optionId);
      newOrderedSelectedIds = newOrderedSelectedIds.filter(id => id !== optionId);
      // If a deselected column was part of sortConfig, remove it
      setLocalSortConfig(prev => prev.filter(sc => sc.key !== optionId));
    } else {
      newSelectedIdsSet.add(optionId);
      if (!newOrderedSelectedIds.includes(optionId)) { 
          newOrderedSelectedIds.push(optionId);
      }
    }
    setSelectedIdsSet(newSelectedIdsSet);
    setOrderedSelectedIds(newOrderedSelectedIds);
  };
  
  const handleRemoveFromSelected = (optionId: string) => {
    setSelectedIdsSet(prevSet => {
      const newSet = new Set(prevSet);
      newSet.delete(optionId);
      return newSet;
    });
    setOrderedSelectedIds(prevOrdered => prevOrdered.filter(id => id !== optionId));
    // If a removed column was part of sortConfig, remove it
    setLocalSortConfig(prev => prev.filter(sc => sc.key !== optionId));
  };
  
  const handleSortInModal = (columnId: string) => {
    setLocalSortConfig(prevSortConfig => {
      const newSortConfig = [...prevSortConfig].map(sc => ({...sc})); 
      const existingSortIndex = newSortConfig.findIndex(item => item.key === columnId);

      if (existingSortIndex !== -1) { // Column is already sorted
        // Cycle direction: ASC -> DESC -> ASC
        newSortConfig[existingSortIndex].direction = 
          newSortConfig[existingSortIndex].direction === SortDirection.ASC 
          ? SortDirection.DESC 
          : SortDirection.ASC;
      } else { // Column not sorted, add it as ASC
        newSortConfig.push({ key: columnId, direction: SortDirection.ASC });
      }
      return newSortConfig;
    });
  };

  const handleRemoveSortFromModal = (columnId: string) => {
    setLocalSortConfig(prev => prev.filter(sc => sc.key !== columnId));
  };


  const handleApply = () => {
    // Filter out sort configurations for columns that are no longer selected
    const currentSelectedIds = new Set(orderedSelectedIds);
    const validSortConfig = localSortConfig.filter(sc => currentSelectedIds.has(sc.key as string));
    onApply(orderedSelectedIds, validSortConfig);
    onClose();
  };

  const filteredOptionsByTab = useMemo(() => {
    const baseFilter = (opt: ColumnOption) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activeTab === 'All' && opt.category.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeTab === 'All') {
      return allColumnOptions.filter(baseFilter);
    }
    return allColumnOptions.filter(opt =>
      opt.category === activeTab && opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allColumnOptions, activeTab, searchTerm]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItemIndex(index);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); 
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) {
      setDraggedItemIndex(null);
      return;
    }

    const newOrderedList = [...orderedSelectedIds];
    const draggedItem = newOrderedList.splice(draggedItemIndex, 1)[0];
    newOrderedList.splice(targetIndex, 0, draggedItem);

    setOrderedSelectedIds(newOrderedList);
    setDraggedItemIndex(null);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 md:p-6 lg:p-8 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Select, Order, and Sort Columns</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
            <XMarkIcon className="w-6 h-6" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b sticky top-[65px] bg-white z-10 shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={activeTab === 'All' ? "Search all columns (by name or category)..." : `Search columns in ${activeTab} (by name)...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-2/3 flex flex-col border-r overflow-hidden">
            <div className="flex flex-wrap gap-2 p-3 border-b shrink-0">
              {categories.map(categoryName => {
                const categoryStyle = CATEGORY_STYLES[categoryName] || CATEGORY_STYLES.default;
                const CategoryIconComponent = CATEGORY_ICONS[categoryName];
                const isActive = activeTab === categoryName;
                return (
                  <button
                    key={categoryName}
                    onClick={() => setActiveTab(categoryName)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium focus:outline-none whitespace-nowrap flex items-center transition-colors duration-150
                      ${isActive 
                        ? `${categoryStyle.tabActiveBg} ${categoryStyle.tabActiveText}` 
                        : `${categoryStyle.tabInactiveBg} ${categoryStyle.tabInactiveText} ${categoryStyle.tabInactiveHoverBg || 'hover:opacity-80'}`
                      }`}
                  >
                    {CategoryIconComponent && <CategoryIconComponent className="w-4 h-4 mr-1.5" />}
                    {categoryName}
                  </button>
                );
              })}
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              {filteredOptionsByTab.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  {searchTerm
                    ? `No columns match your search${activeTab === 'All' ? '' : ` in the ${activeTab} category`}.`
                    : activeTab === 'All'
                      ? 'No columns available or clear search.'
                      : `No columns in ${activeTab} category or clear search.`}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                  {filteredOptionsByTab.map(option => {
                     const categoryStyle = CATEGORY_STYLES[option.category] || CATEGORY_STYLES.default;
                     return (
                      <label 
                        key={option.id} 
                        className={`flex items-center justify-between p-2.5 hover:bg-gray-100 rounded-md cursor-pointer border border-gray-200 transition-colors border-l-4 ${categoryStyle.listItemBorder} hover:shadow-sm`}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 shrink-0"
                            checked={selectedIdsSet.has(option.id)}
                            onChange={() => handleToggleSelection(option.id)}
                          />
                          <span className="text-sm text-gray-800 flex-grow truncate" title={option.label}>{option.label}</span>
                        </div>
                         {activeTab === 'All' && ( 
                            <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${CATEGORY_STYLES[option.category]?.tabInactiveBg || CATEGORY_STYLES.default.tabInactiveBg} ${CATEGORY_STYLES[option.category]?.tabInactiveText || CATEGORY_STYLES.default.tabInactiveText}`}>
                                {option.category}
                            </span>
                        )}
                      </label>
                     );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="w-1/3 p-4 flex flex-col overflow-hidden">
            <h3 className="text-md font-semibold text-gray-700 mb-3 shrink-0">
              Selected Columns ({orderedSelectedIds.length})
            </h3>
            <div className="overflow-y-auto flex-grow border border-gray-200 rounded-md p-2 bg-gray-50 space-y-2">
              {orderedSelectedIds.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No columns selected. Check items from the left.</p>
              ) : (
                orderedSelectedIds.map((id, index) => {
                  const option = allColumnOptions.find(opt => opt.id === id);
                  if (!option) return null;
                  const categoryStyle = CATEGORY_STYLES[option.category] || CATEGORY_STYLES.default;
                  
                  const sortInfoIndex = localSortConfig.findIndex(item => item.key === id);
                  const sortInfo = sortInfoIndex !== -1 ? localSortConfig[sortInfoIndex] : null;
                  const sortPriority = sortInfo ? sortInfoIndex + 1 : null;

                  return (
                    <div
                      key={id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`flex items-center justify-between p-2.5 pr-1 border rounded-md shadow-sm transition-all bg-white hover:shadow-md border-l-4 ${categoryStyle.listItemBorder} ${draggedItemIndex === index ? 'opacity-50 ring-2 ring-blue-500' : ''}`}
                    >
                      <div className="flex items-center space-x-2 flex-grow min-w-0"> 
                        <GrabHandleIcon className="w-5 h-5 cursor-grab text-gray-400 hover:text-gray-600 shrink-0" />
                        <span className="text-sm text-gray-800 truncate flex-grow" title={option.label}>{option.label}</span>
                        
                        <div className="flex items-center space-x-1 shrink-0">
                            <button 
                                type="button"
                                onClick={() => handleSortInModal(option.id)} 
                                className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                aria-label={`Toggle sort for ${option.label}. Current sort: ${sortInfo ? (sortInfo.direction === SortDirection.ASC ? 'Ascending' : 'Descending') : 'None'}${sortPriority ? `, Priority ${sortPriority}` : ''}`}
                            >
                                {sortInfo ? (
                                    sortInfo.direction === SortDirection.ASC ? (
                                    <ChevronUpIcon className="w-4 h-4 text-gray-700" />
                                    ) : (
                                    <ChevronDownIcon className="w-4 h-4 text-gray-700" />
                                    )
                                ) : (
                                    <SortGenericIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                            {sortInfo && (
                                <div className="relative group/badge">
                                    <span className="text-xs font-medium text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-md">
                                        {sortPriority}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            handleRemoveSortFromModal(option.id);
                                        }}
                                        className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover/badge:opacity-100 hover:bg-red-700 transition-opacity z-10"
                                        aria-label={`Remove ${option.label} from sort`}
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveFromSelected(id)}
                        aria-label={`Remove ${option.label}`}
                        className="p-1 shrink-0 ml-1" // Added ml-1 for spacing
                      >
                        <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-700" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t space-x-3 shrink-0 sticky bottom-0 bg-white z-10">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleApply} disabled={orderedSelectedIds.length === 0}>
            Apply {orderedSelectedIds.length > 0 ? `(${orderedSelectedIds.length})` : ''} Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ColumnsModal;
