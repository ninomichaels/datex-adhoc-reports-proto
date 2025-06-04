
import React from 'react';
import { ColumnOption, DataRow, SelectOption, OperatorOption } from './types';

export const ITEMS_PER_PAGE = 25; // Default items per page

export const ITEMS_PER_PAGE_OPTIONS: SelectOption[] = [
  { value: '5', label: '5 rows' },
  { value: '10', label: '10 rows' },
  { value: '15', label: '15 rows' },
  { value: '25', label: '25 rows' },
  { value: '50', label: '50 rows' },
  { value: '100', label: '100 rows' },
];

export const MANAGERS_OPTIONS: SelectOption[] = [
  { value: 'Alice Smith', label: 'Alice Smith' },
  { value: 'Bob Johnson', label: 'Bob Johnson' },
  { value: 'Carol Williams', label: 'Carol Williams' },
  { value: 'David Brown', label: 'David Brown' },
];

export const PROPERTY_TYPE_OPTIONS: SelectOption[] = [
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Mixed-Use', label: 'Mixed-Use' },
];

export const PROPERTY_SUBTYPE_OPTIONS: SelectOption[] = [
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Condo', label: 'Condo' },
  { value: 'Single Family Home', label: 'Single Family Home' },
  { value: 'Townhouse', label: 'Townhouse' },
  { value: 'Multi-Family', label: 'Multi-Family' },
  { value: 'Office', label: 'Office' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Healthcare', label: 'Healthcare' },
];

export const REGION_OPTIONS: SelectOption[] = [
  { value: 'North', label: 'North' },
  { value: 'South', label: 'South' },
  { value: 'East', label: 'East' },
  { value: 'West', label: 'West' },
  { value: 'Central', label: 'Central' },
  { value: 'Northeast', label: 'Northeast' },
  { value: 'Southwest', label: 'Southwest' },
];

export const BUILDING_OPTIONS: SelectOption[] = [
  { value: 'Alpha Tower', label: 'Alpha Tower' },
  { value: 'Beta Complex', label: 'Beta Complex' },
  { value: 'Gamma Plaza', label: 'Gamma Plaza' },
  { value: 'Delta Heights', label: 'Delta Heights' },
  { value: 'Epsilon Lofts', label: 'Epsilon Lofts' },
  { value: 'Zeta Point', label: 'Zeta Point' },
  { value: 'Omega Business Park', label: 'Omega Business Park' },
];

export const GROUP_BY_OPTIONS: SelectOption[] = [
  { value: '', label: 'None' }, 
  { value: 'manager', label: 'Manager' },
  { value: 'propertyType', label: 'Property Type' },
  { value: 'propertySubType', label: 'Property SubType'},
  { value: 'region', label: 'Region' },
  { value: 'building', label: 'Building Name' },
  { value: 'buildingClass', label: 'Building Class' },
  { value: 'propertyStatus', label: 'Property Status' },
  { value: 'yearBuilt', label: 'Year Built' },
];

// SUBGROUP_BY_OPTIONS are initially the same, but will be filtered in App.tsx
export const SUBGROUP_BY_OPTIONS: SelectOption[] = [...GROUP_BY_OPTIONS];


export const ALL_COLUMN_CONFIG: ColumnOption[] = [
  // General
  { id: 'id', label: 'Record ID', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'manager', label: 'Manager', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'propertyType', label: 'Property Type', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'propertySubType', label: 'Property SubType', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'region', label: 'Region', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'building', label: 'Building Name', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'address', label: 'Address', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'city', label: 'City', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'state', label: 'State', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'zipCode', label: 'Zip Code', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'country', label: 'Country', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'yearBuilt', label: 'Year Built', category: 'General', isSummable: false, dataType: 'number' }, 
  { id: 'lastRenovated', label: 'Last Renovated', category: 'General', isSummable: false, dataType: 'number' }, 
  { id: 'propertyStatus', label: 'Property Status', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'buildingClass', label: 'Building Class', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'totalSquareFootage', label: 'Total Sq. Footage', category: 'General', isSummable: true, dataType: 'number' },
  { id: 'lotSize', label: 'Lot Size (Acres)', category: 'General', isSummable: true, dataType: 'number' },
  { id: 'zoningCode', label: 'Zoning Code', category: 'General', isSummable: false, dataType: 'string' },
  { id: 'numberOfFloors', label: 'Number of Floors', category: 'General', isSummable: false, dataType: 'number' },
  { id: 'portfolio', label: 'Portfolio Name', category: 'General', isSummable: false, dataType: 'string' },

  // Occupancy
  { id: 'units', label: 'Total Units', category: 'Occupancy', isSummable: true, dataType: 'number' },
  { id: 'occupiedUnits', label: 'Occupied Units', category: 'Occupancy', isSummable: true, dataType: 'number' },
  { id: 'vacantUnits', label: 'Vacant Units', category: 'Occupancy', isSummable: true, dataType: 'number' },
  { id: 'vacancyRate', label: 'Vacancy Rate (%)', category: 'Occupancy', isSummable: false, dataType: 'number' }, 
  { id: 'averageOccupancy', label: 'Avg. Occupancy (Last 90d)', category: 'Occupancy', isSummable: false, dataType: 'number' },
  { id: 'occupancyTrend', label: 'Occupancy Trend (MoM %)', category: 'Occupancy', isSummable: false, dataType: 'number' },
  { id: 'turnoverRate', label: 'Turnover Rate (%)', category: 'Occupancy', isSummable: false, dataType: 'number' },
  { id: 'avgLeaseTerm', label: 'Avg. Lease Term (Months)', category: 'Occupancy', isSummable: false, dataType: 'number' },
  { id: 'leasesExpiringNext90d', label: 'Leases Expiring (Next 90d)', category: 'Occupancy', isSummable: true, dataType: 'number' },
  { id: 'preleasedUnits', label: 'Pre-leased Units', category: 'Occupancy', isSummable: true, dataType: 'number' },
  { id: 'noticeToVacate', label: 'Notices to Vacate', category: 'Occupancy', isSummable: true, dataType: 'number' },
  { id: 'avgResidentTenure', label: 'Avg. Resident Tenure (Years)', category: 'Occupancy', isSummable: false, dataType: 'number' },
  { id: 'leaseStartDate', label: 'Lease Start Date', category: 'General', isSummable: false, dataType: 'date' },
  
  // Financials
  { id: 'rentCollected', label: 'Rent Collected ($)', category: 'Financials', isSummable: true, dataType: 'number' },
  { id: 'potentialRent', label: 'Potential Gross Rent ($)', category: 'Financials', isSummable: true, dataType: 'number' },
  { id: 'scheduledRent', label: 'Scheduled Rent ($)', category: 'Financials', isSummable: true, dataType: 'number' },
  { id: 'effectiveRent', label: 'Effective Rent ($)', category: 'Financials', isSummable: true, dataType: 'number' },
  { id: 'operatingExpenses', label: 'Operating Expenses ($)', category: 'Financials', isSummable: true, dataType: 'number' },
  { id: 'netOperatingIncome', label: 'Net Operating Income ($)', category: 'Financials', isSummable: true, dataType: 'number' },
  { id: 'capRate', label: 'Cap Rate (%)', category: 'Financials', isSummable: false, dataType: 'number' },
  { id: 'delinquencyRate', label: 'Delinquency Rate (%)', category: 'Financials', isSummable: false, dataType: 'number' },
  { id: 'badDebt', label: 'Bad Debt ($)', category: 'Financials', isSummable: true, dataType: 'number' },
  { id: 'averageRentPerUnit', label: 'Avg. Rent/Unit ($)', category: 'Financials', isSummable: false, dataType: 'number' },
  { id: 'rentGrowthYTD', label: 'Rent Growth YTD (%)', category: 'Financials', isSummable: false, dataType: 'number' },
  { id: 'otherIncome', label: 'Other Income ($)', category: 'Financials', isSummable: true, dataType: 'number' },

  // Marketing
  { id: 'marketingSpend', label: 'Marketing Spend ($)', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'leadsGenerated', label: 'Leads Generated', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'costPerLead', label: 'Cost Per Lead ($)', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'websiteVisits', label: 'Website Visits', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'conversionRate', label: 'Lead to Lease Conversion (%)', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'socialMediaEngagement', label: 'Social Media Engagement', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'emailCampaignOpenRate', label: 'Email Open Rate (%)', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'adImpressions', label: 'Ad Impressions', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'clickThroughRate', label: 'Click-Through Rate (%)', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'uniqueWebsiteVisitors', label: 'Unique Website Visitors', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'bounceRate', label: 'Bounce Rate (%)', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'avgSessionDuration', label: 'Avg. Session Duration (sec)', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'pagesPerVisit', label: 'Pages Per Visit', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'organicTraffic', label: 'Organic Traffic (#)', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'paidTraffic', label: 'Paid Traffic (#)', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'seoKeywordRankings', label: 'Avg. SEO Keyword Rank', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'backlinksCount', label: 'Backlinks Count', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'facebookFollowers', label: 'Facebook Followers', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'instagramFollowers', label: 'Instagram Followers', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'socialMediaReach', label: 'Social Media Reach', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'socialShares', label: 'Social Shares', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'emailListSize', label: 'Email List Size', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'emailClickThroughRate', label: 'Email CTR (%)', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'unsubscribeRate', label: 'Email Unsubscribe Rate (%)', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'costPerClick', label: 'Cost Per Click ($)', category: 'Marketing', isSummable: false, dataType: 'number' }, 
  { id: 'returnOnAdSpend', label: 'Return On Ad Spend (ROAS)', category: 'Marketing', isSummable: false, dataType: 'number' }, 
  { id: 'campaignReach', label: 'Campaign Reach', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'blogPostsPublished', label: 'Blog Posts Published', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'contentDownloads', label: 'Content Downloads', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'eventAttendees', label: 'Event Attendees', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'onlineReviewsCount', label: 'Online Reviews Count', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'averageReviewRating', label: 'Average Review Rating (1-5)', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'videoViews', label: 'Video Views', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'webinarAttendees', label: 'Webinar Attendees', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'leadQualityScore', label: 'Lead Quality Score (Avg)', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'marketingQualifiedLeads', label: 'Marketing Qualified Leads (MQLs)', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'landingPageConversionRate', label: 'Landing Page Conversion Rate (%)', category: 'Marketing', isSummable: false, dataType: 'number' },
  { id: 'formSubmissions', label: 'Form Submissions', category: 'Marketing', isSummable: true, dataType: 'number' },
  { id: 'brandMentions', label: 'Brand Mentions (Online)', category: 'Marketing', isSummable: true, dataType: 'number' },

  // Sales
  { id: 'toursConducted', label: 'Tours Conducted', category: 'Sales', isSummable: true, dataType: 'number' },
  { id: 'applicationsReceived', label: 'Applications Received', category: 'Sales', isSummable: true, dataType: 'number' },
  { id: 'leasesSigned', label: 'Leases Signed', category: 'Sales', isSummable: true, dataType: 'number' },
  { id: 'applicationFeeCollected', label: 'Application Fees ($)', category: 'Sales', isSummable: true, dataType: 'number' },
  { id: 'renewalRate', label: 'Renewal Rate (%)', category: 'Sales', isSummable: false, dataType: 'number' },
  { id: 'averageClosingTime', label: 'Avg. Closing Time (Days)', category: 'Sales', isSummable: false, dataType: 'number' },
  { id: 'salesCycleLength', label: 'Sales Cycle Length (Days)', category: 'Sales', isSummable: false, dataType: 'number' },
  { id: 'leaseNegotiationRate', label: 'Lease Negotiation Rate (%)', category: 'Sales', isSummable: false, dataType: 'number' },
  { id: 'maintenanceRequests', label: 'Maintenance Requests', category: 'General', isSummable: true, dataType: 'number' }, 
  { id: 'outstandingRequests', label: 'Outstanding Requests', category: 'General', isSummable: true, dataType: 'number' }, 
];

export const DEFAULT_VISIBLE_COLUMN_IDS: string[] = [
  'id', 'manager', 'propertyType', 'region', 'units', 'occupiedUnits', 'rentCollected'
];

export const FILTER_OPERATORS: OperatorOption[] = [
  // String
  { value: 'is', label: 'Is', applicableDataTypes: ['string'] },
  { value: 'is_not', label: 'Is not', applicableDataTypes: ['string'] },
  { value: 'contains', label: 'Contains', applicableDataTypes: ['string'] },
  { value: 'does_not_contain', label: 'Does not contain', applicableDataTypes: ['string'] },
  { value: 'starts_with', label: 'Starts with', applicableDataTypes: ['string'] },
  { value: 'ends_with', label: 'Ends with', applicableDataTypes: ['string'] },
  // Number
  { value: 'eq', label: 'Equals (=)', applicableDataTypes: ['number'] },
  { value: 'neq', label: 'Not equals (!=)', applicableDataTypes: ['number'] },
  { value: 'gt', label: 'Greater than (>)', applicableDataTypes: ['number'] },
  { value: 'lt', label: 'Less than (<)', applicableDataTypes: ['number'] },
  { value: 'gte', label: 'Greater than or equal to (>=)', applicableDataTypes: ['number'] },
  { value: 'lte', label: 'Less than or equal to (<=)', applicableDataTypes: ['number'] },
  // Date
  { value: 'date_is', label: 'Is on', applicableDataTypes: ['date'] },
  { value: 'date_is_not', label: 'Is not on', applicableDataTypes: ['date'] },
  { value: 'date_is_before', label: 'Is before', applicableDataTypes: ['date'] },
  { value: 'date_is_after', label: 'Is after', applicableDataTypes: ['date'] },
  { value: 'date_is_on_or_before', label: 'Is on or before', applicableDataTypes: ['date'] },
  { value: 'date_is_on_or_after', label: 'Is on or after', applicableDataTypes: ['date'] },
  // Boolean
  { value: 'is_true', label: 'Is true', applicableDataTypes: ['boolean'], requiresValue: false },
  { value: 'is_false', label: 'Is false', applicableDataTypes: ['boolean'], requiresValue: false },
  // Common
  { value: 'is_empty', label: 'Is empty', applicableDataTypes: ['string', 'number', 'date'], requiresValue: false },
  { value: 'is_not_empty', label: 'Is not empty', applicableDataTypes: ['string', 'number', 'date'], requiresValue: false },
];


export const EXAMPLE_DATA: DataRow[] = Array.from({ length: 100 }, (_, i) => ({ 
  id: `REC-${1001 + i}`,
  manager: MANAGERS_OPTIONS.length > 0 ? MANAGERS_OPTIONS[i % MANAGERS_OPTIONS.length].value : 'N/A',
  propertyType: PROPERTY_TYPE_OPTIONS.length > 0 ? PROPERTY_TYPE_OPTIONS[i % PROPERTY_TYPE_OPTIONS.length].value : 'N/A',
  propertySubType: PROPERTY_SUBTYPE_OPTIONS.length > 0 ? PROPERTY_SUBTYPE_OPTIONS[i % PROPERTY_SUBTYPE_OPTIONS.length].value : 'N/A',
  region: REGION_OPTIONS.length > 0 ? REGION_OPTIONS[i % REGION_OPTIONS.length].value : 'N/A',
  building: BUILDING_OPTIONS.length > 0 ? BUILDING_OPTIONS[i % BUILDING_OPTIONS.length].value : 'N/A',
  units: 50 + Math.floor(Math.random() * 150),
  occupiedUnits: Math.floor((50 + Math.floor(Math.random() * 150)) * (0.7 + Math.random() * 0.29)),
  get vacancyRate() { return parseFloat(((this.units - this.occupiedUnits) / this.units * 100).toFixed(2)); },
  get vacantUnits() { return this.units - this.occupiedUnits; },
  rentCollected: 50000 + Math.floor(Math.random() * 100000),
  potentialRent: 60000 + Math.floor(Math.random() * 120000),
  scheduledRent: 58000 + Math.floor(Math.random() * 110000),
  effectiveRent: 57000 + Math.floor(Math.random() * 100000),
  marketingSpend: 1000 + Math.floor(Math.random() * 4000),
  leadsGenerated: 20 + Math.floor(Math.random() * 80),
  toursConducted: 10 + Math.floor(Math.random() * 40),
  applicationsReceived: 5 + Math.floor(Math.random() * 20),
  leasesSigned: 3 + Math.floor(Math.random() * 15),
  applicationFeeCollected: (5 + Math.floor(Math.random() * 20)) * 50,
  leaseStartDate: `2023-${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}-${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}`,
  renewalRate: parseFloat((60 + Math.random() * 35).toFixed(2)),
  averageLeaseTerm: 12 + Math.floor(Math.random() * 12),
  maintenanceRequests: 5 + Math.floor(Math.random() * 25),
  outstandingRequests: Math.floor(Math.random() * 10),
  address: `${100 + i} Main St`,
  city: ['Springfield', 'Riverdale', 'Gotham', 'Metropolis'][i % 4],
  state: ['IL', 'CA', 'NY', 'TX'][i % 4],
  zipCode: String(Math.floor(10000 + Math.random() * 89999)),
  country: 'USA',
  yearBuilt: 1980 + Math.floor(Math.random() * 40),
  lastRenovated: 2010 + Math.floor(Math.random() * 13),
  propertyStatus: ['Active', 'Under Renovation', 'Development'][i % 3],
  buildingClass: ['A', 'B', 'C'][i % 3],
  totalSquareFootage: 50000 + Math.floor(Math.random() * 100000),
  lotSize: parseFloat((0.5 + Math.random() * 5).toFixed(2)),
  zoningCode: ['C1', 'R2', 'MU1'][i % 3],
  numberOfFloors: 2 + Math.floor(Math.random() * 20),
  portfolio: ['Core Portfolio', 'Value-Add Fund', 'Development Pipeline'][i % 3],
  averageOccupancy: parseFloat((70 + Math.random() * 29).toFixed(2)),
  occupancyTrend: parseFloat((-2 + Math.random() * 4).toFixed(2)),
  leasesExpiringNext90d: Math.floor(Math.random() * 10),
  preleasedUnits: Math.floor(Math.random() * 15),
  noticeToVacate: Math.floor(Math.random() * 5),
  avgResidentTenure: parseFloat((1.5 + Math.random() * 5).toFixed(1)),
  turnoverRate: parseFloat((5 + Math.random() * 15).toFixed(2)),
  operatingExpenses: 20000 + Math.floor(Math.random() * 50000),
  get netOperatingIncome() { return this.rentCollected - this.operatingExpenses; }, 
  capRate: parseFloat((4 + Math.random() * 4).toFixed(2)),
  delinquencyRate: parseFloat((1 + Math.random() * 9).toFixed(2)),
  badDebt: Math.floor(Math.random() * 5000),
  get averageRentPerUnit() { return this.occupiedUnits > 0 ? parseFloat((this.rentCollected / this.occupiedUnits).toFixed(2)) : 0; },
  rentGrowthYTD: parseFloat((1 + Math.random() * 5).toFixed(2)),
  otherIncome: Math.floor(Math.random() * 10000),
  get costPerLead() { return this.leadsGenerated > 0 ? parseFloat((this.marketingSpend / this.leadsGenerated).toFixed(2)) : 0; },
  websiteVisits: 500 + Math.floor(Math.random() * 1500),
  get conversionRate() { return this.leadsGenerated > 0 ? parseFloat((this.leasesSigned / this.leadsGenerated * 100).toFixed(2)) : 0; },
  socialMediaEngagement: Math.floor(Math.random() * 1000),
  emailCampaignOpenRate: parseFloat((10 + Math.random() * 30).toFixed(2)),
  adImpressions: Math.floor(Math.random() * 100000),
  clickThroughRate: parseFloat((0.5 + Math.random() * 5).toFixed(2)),
  averageClosingTime: 5 + Math.floor(Math.random() * 25),
  salesCycleLength: 10 + Math.floor(Math.random() * 50),
  leaseNegotiationRate: parseFloat((5 + Math.random() * 20).toFixed(2)),
  uniqueWebsiteVisitors: 100 + Math.floor(Math.random() * 1000),
  bounceRate: parseFloat((30 + Math.random() * 40).toFixed(2)),
  avgSessionDuration: 60 + Math.floor(Math.random() * 240),
  pagesPerVisit: parseFloat((1.5 + Math.random() * 5).toFixed(1)), 
  organicTraffic: 50 + Math.floor(Math.random() * 500),
  paidTraffic: 20 + Math.floor(Math.random() * 300),
  seoKeywordRankings: Math.floor(Math.random() * 50) + 1,
  backlinksCount: 10 + Math.floor(Math.random() * 200),
  facebookFollowers: 1000 + Math.floor(Math.random() * 10000),
  instagramFollowers: 500 + Math.floor(Math.random() * 5000),
  socialMediaReach: 5000 + Math.floor(Math.random() * 50000),
  socialShares: 10 + Math.floor(Math.random() * 100),
  emailListSize: 2000 + Math.floor(Math.random() * 20000),
  emailClickThroughRate: parseFloat((1 + Math.random() * 10).toFixed(2)),
  unsubscribeRate: parseFloat((0.1 + Math.random() * 2).toFixed(2)),
  costPerClick: parseFloat((0.5 + Math.random() * 5).toFixed(2)),
  returnOnAdSpend: parseFloat((1.5 + Math.random() * 10).toFixed(1)),
  campaignReach: 10000 + Math.floor(Math.random() * 100000),
  blogPostsPublished: 1 + Math.floor(Math.random() * 10),
  contentDownloads: 5 + Math.floor(Math.random() * 50),
  eventAttendees: Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0,
  onlineReviewsCount: 5 + Math.floor(Math.random() * 100),
  averageReviewRating: parseFloat((3.0 + Math.random() * 2).toFixed(1)),
  videoViews: 100 + Math.floor(Math.random() * 5000),
  webinarAttendees: Math.random() > 0.8 ? Math.floor(Math.random() * 200) : 0,
  leadQualityScore: parseFloat((50 + Math.random() * 50).toFixed(0)),
  marketingQualifiedLeads: 10 + Math.floor(Math.random() * 40),
  landingPageConversionRate: parseFloat((1 + Math.random() * 15).toFixed(2)),
  formSubmissions: 5 + Math.floor(Math.random() * 50),
  brandMentions: 5 + Math.floor(Math.random() * 100),
}));

// SVG Icons
export const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" {...props}><path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.033a.75.75 0 01-1.11.67L9.08 15.68a.75.75 0 01-.33-.67V12.5a2.25 2.25 0 00-.659-1.59L3.408 6.23A2.25 2.25 0 012.75 4.64V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" /></svg>;
export const ClearIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0L12 14.25m2.25-2.25L14.25 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
export const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
export const SaveIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5M16.5 12h.008v.008H16.5V12zm-7.5 0h.008v.008H9V12zm4.5-4.5h.008v.008H13.5V7.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.782.93l-.149.894c-.09.542-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93-.398-.164-.855-.142-1.205.108l-.737.527a1.125 1.125 0 01-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.093c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.893z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);

export const ChevronUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832l-3.71 3.938a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
  </svg>
);

export const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
  </svg>
);


export const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const GrabHandleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
  </svg>
);

export const AdvancedFiltersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 7.973.648V5.75a.75.75 0 01-1.06.707L12 4.282 5.087 6.457a.75.75 0 01-1.06-.707V3.648A31.045 31.045 0 0112 3zm0 0V21m0-18h.008M12 12.75h.008m-3.008 0h.007m6.001 0h.008m-3.008 3h.008m-3.008 0h.007m6.001 0h.008m0-3h.008m0 0h.008m0 0h.008m0 0h.007M12 9h.008M9 12.75h.008M15 12.75h.008M12 16.5h.008M9 16.5h.008M15 16.5h.008" />
    </svg>
);