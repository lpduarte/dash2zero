export interface Supplier {
  id: string;
  name: string;
  sector: string;
  region: string;
  scope1: number; // tons CO2e
  scope2: number;
  scope3: number;
  totalEmissions: number;
  emissionsPerRevenue: number; // tons CO2e per million EUR
  renewableEnergy: number; // percentage
  wasteRecycled: number; // percentage
  hasSBTi: boolean;
  certifications: string[];
  yearlyProgress: {
    year: number;
    emissions: number;
  }[];
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  sustainabilityReport?: string;
  rating: 'A' | 'B' | 'C' | 'D' | 'E';
}

export type SectorFilter = 'all' | 'manufacturing' | 'technology' | 'construction' | 'transport' | 'services';
export type RegionFilter = 'all' | 'north' | 'center' | 'south' | 'islands';
