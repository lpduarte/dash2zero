import type { InfrastructureData } from '@/types/infrastructure';

export const mockInfrastructure: InfrastructureData[] = [
  {
    municipality: "Cascais",
    chargingStations: 89,
    ecoPoints: 245,
    bikeStations: 52,
    organicBins: 178
  },
  {
    municipality: "Porto",
    chargingStations: 145,
    ecoPoints: 320,
    bikeStations: 78,
    organicBins: 245
  },
  {
    municipality: "Lisboa",
    chargingStations: 210,
    ecoPoints: 450,
    bikeStations: 105,
    organicBins: 380
  },
  {
    municipality: "Braga",
    chargingStations: 85,
    ecoPoints: 180,
    bikeStations: 42,
    organicBins: 150
  },
  {
    municipality: "Aveiro",
    chargingStations: 65,
    ecoPoints: 140,
    bikeStations: 35,
    organicBins: 110
  },
  {
    municipality: "Coimbra",
    chargingStations: 95,
    ecoPoints: 210,
    bikeStations: 55,
    organicBins: 165
  },
  {
    municipality: "Faro",
    chargingStations: 55,
    ecoPoints: 120,
    bikeStations: 28,
    organicBins: 95
  },
  {
    municipality: "Setúbal",
    chargingStations: 70,
    ecoPoints: 155,
    bikeStations: 38,
    organicBins: 125
  }
];

// Infraestrutura detalhada de Cascais para validação de medidas
export const cascaisInfrastructure = {
  // Mobilidade
  chargingStations: 47,
  cyclingNetworkKm: 85,
  publicTransportCoverage: 92, // % área coberta
  bikeShareStations: 23,
  
  // Energia
  renewableEnergyAccess: true,
  solarPotentialZones: 12,
  greenEnergySuppliers: 3,
  
  // Resíduos
  recyclingCenters: 8,
  compostingFacilities: 3,
  wasteCollectionCoverage: 98, // %
  
  // Água
  waterReuseInfrastructure: true,
  rainwaterHarvestingZones: 5,
  
  // Apoios municipais
  activeFundingPrograms: 4,
  totalAvailableFunding: 500000, // €
  technicalSupportTeam: true,
  
  // Cobertura geográfica
  industrialZonesCovered: 85, // %
  commercialZonesCovered: 92, // %
};

export type InfrastructureKey = keyof typeof cascaisInfrastructure;
