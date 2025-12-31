import { InfrastructureData } from "@/types/infrastructure";

export const mockInfrastructure: InfrastructureData[] = [
  // Porto District
  {
    municipality: "Matosinhos",
    chargingStations: 38,
    ecoPoints: 95,
    bikeStations: 22,
    organicBins: 65
  },
  {
    municipality: "Vila Nova de Gaia",
    chargingStations: 52,
    ecoPoints: 130,
    bikeStations: 35,
    organicBins: 90
  },
  {
    municipality: "Maia",
    chargingStations: 28,
    ecoPoints: 72,
    bikeStations: 18,
    organicBins: 48
  },
  {
    municipality: "Gondomar",
    chargingStations: 22,
    ecoPoints: 58,
    bikeStations: 12,
    organicBins: 38
  },
  
  // Lisboa District
  {
    municipality: "Lisboa",
    chargingStations: 85,
    ecoPoints: 210,
    bikeStations: 55,
    organicBins: 145
  },
  {
    municipality: "Oeiras",
    chargingStations: 42,
    ecoPoints: 98,
    bikeStations: 28,
    organicBins: 68
  },
  {
    municipality: "Sintra",
    chargingStations: 48,
    ecoPoints: 115,
    bikeStations: 32,
    organicBins: 78
  },
  {
    municipality: "Cascais",
    chargingStations: 55,
    ecoPoints: 125,
    bikeStations: 38,
    organicBins: 85
  },
  
  // Braga District
  {
    municipality: "Braga",
    chargingStations: 35,
    ecoPoints: 88,
    bikeStations: 20,
    organicBins: 55
  },
  {
    municipality: "Guimarães",
    chargingStations: 28,
    ecoPoints: 72,
    bikeStations: 15,
    organicBins: 45
  },
  {
    municipality: "Barcelos",
    chargingStations: 18,
    ecoPoints: 52,
    bikeStations: 10,
    organicBins: 32
  },
  
  // Faro District
  {
    municipality: "Faro",
    chargingStations: 32,
    ecoPoints: 78,
    bikeStations: 18,
    organicBins: 48
  },
  {
    municipality: "Portimão",
    chargingStations: 28,
    ecoPoints: 68,
    bikeStations: 15,
    organicBins: 42
  },
  {
    municipality: "Loulé",
    chargingStations: 35,
    ecoPoints: 85,
    bikeStations: 22,
    organicBins: 55
  },
  
  // Coimbra District
  {
    municipality: "Coimbra",
    chargingStations: 38,
    ecoPoints: 92,
    bikeStations: 25,
    organicBins: 58
  },
  {
    municipality: "Figueira da Foz",
    chargingStations: 22,
    ecoPoints: 55,
    bikeStations: 12,
    organicBins: 35
  },
  
  // Aveiro District
  {
    municipality: "Aveiro",
    chargingStations: 32,
    ecoPoints: 78,
    bikeStations: 20,
    organicBins: 52
  },
  {
    municipality: "Ílhavo",
    chargingStations: 15,
    ecoPoints: 42,
    bikeStations: 8,
    organicBins: 28
  },
  
  // Setúbal District
  {
    municipality: "Setúbal",
    chargingStations: 28,
    ecoPoints: 72,
    bikeStations: 15,
    organicBins: 45
  },
  {
    municipality: "Almada",
    chargingStations: 42,
    ecoPoints: 105,
    bikeStations: 28,
    organicBins: 72
  },
];

// Helper function to get infrastructure data for specific municipalities
export const getInfrastructureByMunicipalities = (municipalities: string[]): InfrastructureData => {
  if (municipalities.length === 0) {
    // Return aggregated data for all municipalities
    return mockInfrastructure.reduce(
      (acc, data) => ({
        municipality: "Todos",
        chargingStations: acc.chargingStations + data.chargingStations,
        ecoPoints: acc.ecoPoints + data.ecoPoints,
        bikeStations: acc.bikeStations + data.bikeStations,
        organicBins: acc.organicBins + data.organicBins,
      }),
      { municipality: "Todos", chargingStations: 0, ecoPoints: 0, bikeStations: 0, organicBins: 0 }
    );
  }
  
  if (municipalities.length === 1) {
    const found = mockInfrastructure.find(d => d.municipality === municipalities[0]);
    if (found) return found;
  }
  
  // Aggregate for selected municipalities
  const filtered = mockInfrastructure.filter(d => municipalities.includes(d.municipality));
  return filtered.reduce(
    (acc, data) => ({
      municipality: municipalities.length === 1 ? municipalities[0] : `${municipalities.length} municípios`,
      chargingStations: acc.chargingStations + data.chargingStations,
      ecoPoints: acc.ecoPoints + data.ecoPoints,
      bikeStations: acc.bikeStations + data.bikeStations,
      organicBins: acc.organicBins + data.organicBins,
    }),
    { municipality: "", chargingStations: 0, ecoPoints: 0, bikeStations: 0, organicBins: 0 }
  );
};
