export interface DataRow {
  id: string;
  manager: string;
  propertyType: string;
  propertySubType: string;
  region: string;
  building: string;
  units: number;
  occupiedUnits: number;
  vacancyRate: number;
  rentCollected: number;
  potentialRent: number;
  marketingSpend: number;
  leadsGenerated: number;
  toursConducted: number;
  applicationsReceived: number;
  leasesSigned: number;
  leaseStartDate: string;
  renewalRate: number;
  averageLeaseTerm: number; // in months
  maintenanceRequests: number;
  outstandingRequests: number;
  [key: string]: any; // Allows for dynamic properties
}

export interface ColumnDefinition {
  id: string; // Use keyof DataRow for known properties, string for others
  label: string;
  isDefault?: boolean;
  isSummable?: boolean;
  dataType?: 'string' | 'number' | 'boolean' | 'date'; // Added for advanced filters
}

export interface ColumnOption {
  id: string;
  label:string;
  category: string;
  isSummable?: boolean;
  dataType: 'string' | 'number' | 'boolean' | 'date'; // Added for advanced filters
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SortConfigItem {
  key: keyof DataRow | string;
  direction: SortDirection;
}

export type SortConfig = SortConfigItem[]; // Changed from interface to type alias for an array

export interface FilterValues {
  period: string;
  manager: string[];
  propertyType: string[];
  propertySubType: string[];
  region: string[];
  building: string[];
  groupBy: string; 
  subGroupBy: string; // New field for subgrouping
}

export interface SelectOption {
  value: string;
  label: string;
}

// For Advanced Filters
export interface AdvancedFilterRule {
  id: string; // Unique ID for the rule
  field: string; // Column ID (from ColumnOption.id)
  dataType: 'string' | 'number' | 'boolean' | 'date';
  operator: string; // Operator key (e.g., 'contains', 'eq')
  value: any; // Value to filter by
  conjunction?: 'AND' | 'OR'; // For combining rules, undefined for the first rule
}

export interface OperatorOption {
  value: string; // The actual operator key
  label: string; // User-friendly label
  applicableDataTypes: Array<'string' | 'number' | 'boolean' | 'date'>;
  requiresValue?: boolean; // Defaults to true. False for 'is_empty', 'is_not_empty', etc.
}

// For Grouping
export interface GroupRow {
  id: string; // Unique ID for the group, e.g., "group_region_North" or "group_region_North||subgroup_propertyType_Commercial"
  isGroupHeader: true;
  groupKeyField: string; // e.g., 'region' (for level 0) or 'propertyType' (for level 1)
  groupValue: any; // e.g., 'North' or 'Commercial'
  aggregates: { [key: string]: number | string }; // Calculated sums, counts for visible columns
  subRows: DisplayRow[]; // Can contain DataRow[] or GroupRow[] for nested groups
  subRowCount: number; // Count of direct underlying DataRows or count of subgroups
  level: number; // Nesting level (0 for primary, 1 for subgroup)
}

export type DisplayRow = DataRow | GroupRow;