// src/types/index.ts

// Email analysis result
export interface EmailAnalysis {
  clientName: string;
  broker?: string;
  effectiveDate?: string;
  caseType: "renewal" | "new_business" | "first_time_benefit";

  products: ProductInfo[];
  census?: CensusInfo;
  commission?: string;
  specialNotes?: string[];
}

// Product information
export interface ProductInfo {
  productType: string;
  currentCarrier?: string;
  quoteInstructions?: string;

  classes: ClassInfo[];
  renewalRates?: RenewalRates;
  options?: string[];
}

// Class information
export interface ClassInfo {
  className: string;
  description: string;
  eligibility?: string;
}

// Renewal rates
export interface RenewalRates {
  activeRate?: string;
  retireeRate?: string;
  rateIncrease?: string;
}

// Census information
export interface CensusInfo {
  active?: number;
  retirees?: number;
  total?: number;
  password?: string;
}
