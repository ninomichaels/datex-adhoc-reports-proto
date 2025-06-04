import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ColumnDefinition, AdvancedFilterRule, OperatorOption, SelectOption } from '../types'; 
import { FILTER_OPERATORS, GrabHandleIcon } from '../constants'; 
import Button from './Button';
import SearchableSelect from './SearchableSelect';
import { XMarkIcon } from '../constants';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (rules: AdvancedFilterRule[]) => void;
  columns: ColumnDefinition[]; 
  initialRules: AdvancedFilterRule[];
}

const CONJUNCTION_OPTIONS: SelectOption[] = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
];

const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  columns, 
  initialRules,
}) => {
  const [rules, setRules] = useState<AdvancedFilterRule[]>([]);
  const [draggedRuleId, setDraggedRuleId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const visibleColumnIds = new Set(columns.map(col => col.id));
      const relevantInitialRules = initialRules.filter(rule => visibleColumnIds.has(rule.field));
      
      setRules(relevantInitialRules.map((rule, index) => ({ 
        ...rule,
        // Ensure conjunction is set for rules after the first, default to AND if missing
        conjunction: index > 0 ? (rule.conjunction || 'AND') : undefined,
      })));
    }
  }, [isOpen, initialRules, columns]);

  const columnOptionsForSelect: SelectOption[] = useMemo(() => {
    return columns.map(col => ({ value: col.id, label: col.label }));
  }, [columns]);

  const getOperatorsForField = useCallback((fieldId: string): OperatorOption[] => {
    const column = columns.find(col => col.id === fieldId); 
    if (!column || !column.dataType) return [];
    return FILTER_OPERATORS.filter(op => op.applicableDataTypes.includes(column.dataType!));
  }, [columns]);

  const handleAddRule = () => {
    const defaultColumn = columns[0];
    if (!defaultColumn) return; 

    const defaultOperators = getOperatorsForField(defaultColumn.id);
    const defaultOperator = defaultOperators[0] || FILTER_OPERATORS.find(op => op.applicableDataTypes.includes(defaultColumn.dataType!));

    const newRule: AdvancedFilterRule = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      field: defaultColumn.id,
      dataType: defaultColumn.dataType!,
      operator: defaultOperator?.value || '',
      value: '',
      conjunction: rules.length > 0 ? 'AND' : undefined, // Set conjunction if not the first rule
    };
    setRules(prevRules => [...prevRules, newRule]);
  };

  const handleRemoveRule = (ruleId: string) => {
    setRules(prevRules => {
        const newRules = prevRules.filter(rule => rule.id !== ruleId);
        // Adjust conjunction for the new first rule if necessary
        if (newRules.length > 0 && newRules[0].conjunction) {
            newRules[0] = { ...newRules[0], conjunction: undefined };
        }
        // Ensure subsequent rules have conjunctions
        for (let i = 1; i < newRules.length; i++) {
            if (!newRules[i].conjunction) {
                newRules[i] = { ...newRules[i], conjunction: 'AND' };
            }
        }
        return newRules;
    });
  };
  
  const handleRuleChange = (ruleId: string, field: keyof AdvancedFilterRule | 'conjunction', value: any) => {
    setRules(prevRules =>
      prevRules.map(rule => {
        if (rule.id === ruleId) {
          const updatedRule = { ...rule, [field]: value };
          if (field === 'field') { 
            const newColumn = columns.find(col => col.id === value); 
            if (newColumn && newColumn.dataType) {
              updatedRule.dataType = newColumn.dataType;
              const newOperators = getOperatorsForField(newColumn.id);
              updatedRule.operator = newOperators[0]?.value || '';
              updatedRule.value = ''; 
            }
          }
          if (field === 'operator') { 
            const op = getOperatorsForField(updatedRule.field).find(o => o.value === value);
            if (op && op.requiresValue === false) {
                updatedRule.value = '';
            }
          }
          return updatedRule;
        }
        return rule;
      })
    );
  };
  
  const handleClearAll = () => {
    setRules([]);
  };

  const handleApply = () => {
    // Ensure conjunction logic is sound before applying (e.g., first rule no conjunction, others must have one)
    const validatedRules = rules.map((rule, index) => ({
      ...rule,
      conjunction: index === 0 ? undefined : (rule.conjunction || 'AND')
    }));
    onApplyFilters(validatedRules);
    onClose();
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, ruleId: string) => {
    setDraggedRuleId(ruleId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetRuleId: string) => {
    e.preventDefault();
    if (!draggedRuleId || draggedRuleId === targetRuleId) {
      setDraggedRuleId(null);
      return;
    }

    const draggedIndex = rules.findIndex(r => r.id === draggedRuleId);
    const targetIndex = rules.findIndex(r => r.id === targetRuleId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedRuleId(null);
      return;
    }

    let newRules = [...rules];
    const [draggedItem] = newRules.splice(draggedIndex, 1);
    newRules.splice(targetIndex, 0, draggedItem);

    // Adjust conjunctions based on new positions
    newRules = newRules.map((rule, index) => {
      if (index === 0) {
        return { ...rule, conjunction: undefined }; // First rule has no conjunction
      }
      // Ensure subsequent rules have a conjunction, default to AND if missing
      return { ...rule, conjunction: rule.conjunction || 'AND' }; 
    });

    setRules(newRules);
    setDraggedRuleId(null);
  };

  if (!isOpen) return null;
  
  const canAddRule = columns.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 md:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Advanced Filters</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
            <XMarkIcon className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow space-y-3">
          {rules.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              {canAddRule ? 'No filters defined. Click "Add Rule" to start.' : 'No columns available to filter.'}
            </p>
          )}
          {rules.map((rule, index) => {
            const availableOperators = getOperatorsForField(rule.field);
            const selectedOperatorDefinition = availableOperators.find(op => op.value === rule.operator);
            const showValueInput = selectedOperatorDefinition?.requiresValue !== false;

            return (
              <div
                key={rule.id}
                draggable={canAddRule}
                onDragStart={(e) => canAddRule && handleDragStart(e, rule.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => canAddRule && handleDrop(e, rule.id)}
                className={`flex items-center gap-2 p-3 border rounded-md bg-gray-50 group ${draggedRuleId === rule.id ? 'opacity-50 ring-2 ring-blue-500' : ''} ${canAddRule ? '' : 'opacity-75'}`}
              >
                <GrabHandleIcon className={`w-5 h-5 text-gray-400 shrink-0 group-hover:text-gray-600 ${canAddRule ? 'cursor-grab' : 'cursor-not-allowed'}`} />
                
                {index === 0 ? (
                  <div className="w-24 text-sm font-semibold text-gray-600 shrink-0 self-center text-center">WHERE</div>
                ) : (
                  <div className="w-24 shrink-0">
                    <SearchableSelect
                      label=""
                      options={CONJUNCTION_OPTIONS}
                      value={rule.conjunction || 'AND'}
                      onChange={(val) => handleRuleChange(rule.id, 'conjunction', val)}
                      allowClear={false}
                      showSearch={false}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-[130px]">
                  <SearchableSelect
                    label=""
                    options={columnOptionsForSelect}
                    value={rule.field}
                    onChange={(val) => handleRuleChange(rule.id, 'field', val)}
                    placeholder="Select field..."
                    allowClear={false}
                  />
                </div>
                <div className="flex-1 min-w-[130px]">
                  <SearchableSelect
                    label=""
                    options={availableOperators.map(op => ({ value: op.value, label: op.label }))}
                    value={rule.operator}
                    onChange={(val) => handleRuleChange(rule.id, 'operator', val)}
                    placeholder="Select operator..."
                    allowClear={false}
                    showSearch={availableOperators.length > 5} // Only show search if many operators
                  />
                </div>
                {showValueInput ? (
                  <div className="flex-1 min-w-[130px]">
                    {rule.dataType === 'date' ? (
                      <input
                        type="date"
                        aria-label="Value for date"
                        value={String(rule.value || '')}
                        onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : rule.dataType === 'boolean' ? (
                       <div>
                        <select
                            aria-label="Value for boolean"
                            value={String(rule.value === undefined ? 'true' : rule.value)} 
                            onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value === 'true')}
                            className="w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                       </div>
                    ) : (
                      <input
                        type={rule.dataType === 'number' ? 'number' : 'text'}
                        aria-label="Value for filter"
                        value={String(rule.value || '')} 
                        onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                        placeholder="Enter value..."
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                ) : <div className="flex-1 min-w-[130px] h-[42px]" /> }
                <Button variant="ghost" size="sm" onClick={() => handleRemoveRule(rule.id)} className="p-1 self-center shrink-0" disabled={!canAddRule}>
                  <XMarkIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                </Button>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t shrink-0">
          <Button variant="secondary" onClick={handleAddRule} disabled={!canAddRule}>
            Add Rule
          </Button>
        </div>

        <div className="flex justify-end p-4 border-t space-x-3 shrink-0 sticky bottom-0 bg-white z-10">
          <Button variant="outline" onClick={handleClearAll} disabled={rules.length === 0}>
            Clear All
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApply} disabled={rules.length === 0 && initialRules.length === 0 && !canAddRule}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersModal;