import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/dashboard/Header";
import { ClusterStats } from "@/components/clusters/ClusterStats";
import { ProvidersTable } from "@/components/clusters/ProvidersTable";
import { AddCompaniesDialog, NewCompanyData } from "@/components/clusters/AddCompaniesDialog";
import { CreateClusterDialog } from "@/components/clusters/CreateClusterDialog";
import { ClusterSelector } from "@/components/dashboard/ClusterSelector";
import {
  getSuppliersWithFootprintByOwnerType,
  getSuppliersWithoutFootprintByOwnerType,
} from "@/data/suppliers";
import {
  getClustersByOwnerType,
  createCluster,
  updateCluster,
  deleteCluster,
} from "@/data/clusters";
import { ClusterDefinition, CreateClusterInput } from "@/types/clusterNew";
import { Supplier, UniversalFilterState } from "@/types/supplier";
import { SupplierWithoutFootprint, SupplierAny } from "@/types/supplierNew";
import { CircleDot } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { getClusterConfig } from "@/config/clusters";

export default function ClusterManagement() {
  const { isMunicipio, userType } = useUser();
  const navigate = useNavigate();
  const ownerType = isMunicipio ? 'municipio' : 'empresa';

  const [selectedClusterType, setSelectedClusterType] = useState<string>('all');
  const [addCompaniesDialogOpen, setAddCompaniesDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCluster, setEditingCluster] = useState<ClusterDefinition | undefined>();
  const [universalFilters, setUniversalFilters] = useState<UniversalFilterState>({
    companySize: [],
    district: [],
    municipality: [],
    parish: [],
    sector: [],
  });
  // Trigger para forçar refresh dos clusters
  const [clustersVersion, setClustersVersion] = useState(0);
  const refreshClusters = () => setClustersVersion(v => v + 1);

  // Base suppliers - filtrados por ownerType
  const baseSuppliers = useMemo(() => {
    return getSuppliersWithFootprintByOwnerType(ownerType) as Supplier[];
  }, [ownerType]);

  // Companies without footprint - for onboarding stats
  const companiesWithoutFootprint = useMemo(() => {
    return getSuppliersWithoutFootprintByOwnerType(ownerType);
  }, [ownerType]);

  // Clusters dinâmicos (depende de clustersVersion para refresh)
  const clusters = useMemo(() => {
    return getClustersByOwnerType(ownerType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerType, clustersVersion]);

  // Cluster options (para o selector)
  const clusterOptions = useMemo(() => {
    return getClusterConfig(userType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, clustersVersion]);

  // Combinar todas as empresas (com e sem pegada) num formato normalizado
  const allCompanies = useMemo((): SupplierAny[] => {
    // Empresas com pegada - são tratadas como "completo"
    const withFootprint = baseSuppliers.map(s => ({
      ...s,
      onboardingStatus: 'completo' as const,
      completedVia: (s.dataSource === 'get2zero' ? 'simple' : 'formulario') as const,
      // Campos extra que SupplierWithoutFootprint tem
      emailsSent: 0,
    }));

    const withoutFootprint = companiesWithoutFootprint as SupplierWithoutFootprint[];

    return [...withFootprint, ...withoutFootprint];
  }, [baseSuppliers, companiesWithoutFootprint]);

  // Get cluster counts - baseado em TODAS as empresas
  const clusterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allCompanies.length };
    clusters.forEach(cluster => {
      counts[cluster.id] = allCompanies.filter(c => c.clusterId === cluster.id).length;
    });
    return counts;
  }, [allCompanies, clusters]);

  // State detection for empty states
  const hasNoClusters = clusters.length === 0;
  const selectedClusterId = selectedClusterType !== 'all' ? selectedClusterType : null;

  // Filter suppliers by selected cluster and universal filters
  const filteredSuppliers = useMemo(() => {
    let filtered = baseSuppliers;
    
    if (selectedClusterType !== 'all') {
      filtered = filtered.filter(s => s.clusterId === selectedClusterType);
    }
    
    // Filtro de dimensão (multiselect)
    if (universalFilters.companySize.length > 0) {
      filtered = filtered.filter(s => universalFilters.companySize.includes(s.companySize));
    }
    
    // Filtros de localização - apenas para empresa
    if (!isMunicipio) {
      if (universalFilters.district.length > 0) {
        filtered = filtered.filter(s => universalFilters.district.includes(s.district));
      }
      if (universalFilters.municipality.length > 0) {
        filtered = filtered.filter(s => universalFilters.municipality.includes(s.municipality));
      }
    }
    
    // Filtro freguesia (ambos os tipos)
    if (universalFilters.parish.length > 0) {
      filtered = filtered.filter(s => universalFilters.parish.includes(s.parish));
    }

    // Filtro de setor/atividade
    if (universalFilters.sector.length > 0) {
      filtered = filtered.filter(s => universalFilters.sector.includes(s.sector));
    }

    return filtered;
  }, [selectedClusterType, universalFilters, baseSuppliers, isMunicipio]);

  // Filter all companies by selected cluster
  const filteredAllCompanies = useMemo(() => {
    if (selectedClusterType === 'all') {
      return allCompanies;
    }
    return allCompanies.filter(c => c.clusterId === selectedClusterType);
  }, [allCompanies, selectedClusterType]);

  const handleAddCompanies = (companies: NewCompanyData[]) => {
    console.log("Adding companies:", companies);
    // TODO: Implement actual company addition logic
  };

  const handleAddCompaniesInline = (companies: NewCompanyData[]) => {
    console.log("Adding companies inline:", companies);
    // TODO: Implement actual company addition logic
  };

  // CRUD Handlers
  const handleCreateCluster = (input: CreateClusterInput) => {
    const newCluster = createCluster(input, ownerType);
    refreshClusters();
    // Automatically select the newly created cluster
    if (newCluster) {
      setSelectedClusterType(newCluster.id);
    }
  };

  const handleEditCluster = (cluster: ClusterDefinition) => {
    setEditingCluster(cluster);
    setCreateDialogOpen(true);
  };

  const handleUpdateCluster = (input: CreateClusterInput) => {
    if (!editingCluster) return;
    updateCluster(editingCluster.id, input);
    refreshClusters();
    setEditingCluster(undefined);
  };

  const handleDeleteCluster = (cluster: ClusterDefinition) => {
    const success = deleteCluster(cluster.id);
    if (success) {
      if (selectedClusterType === cluster.id) {
        setSelectedClusterType('all');
      }
      refreshClusters();
    }
  };

  const handleDialogClose = (open: boolean) => {
    setCreateDialogOpen(open);
    if (!open) {
      setEditingCluster(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative z-10 max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CircleDot className="h-6 w-6 text-primary" />
            Gerir clusters
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize e monitorize os seus grupos de empresas
          </p>
        </div>

        {/* Cluster Selector */}
        <ClusterSelector
          selectedCluster={selectedClusterType}
          onClusterChange={setSelectedClusterType}
          clusterCounts={clusterCounts}
          showPotential={false}
          showFilterButton={false}
          suppliers={baseSuppliers}
          universalFilters={universalFilters}
          onUniversalFiltersChange={setUniversalFilters}
          onEdit={handleEditCluster}
          onDelete={handleDeleteCluster}
          onCreateNew={() => setCreateDialogOpen(true)}
        />

        <div className="space-y-6">
          <ClusterStats
            selectedCluster={selectedClusterType}
            companies={filteredAllCompanies}
          />
          <Card className="p-6 shadow-md">
            <ProvidersTable
              companies={filteredAllCompanies}
              onAddCompanies={() => setAddCompaniesDialogOpen(true)}
              onAddCompaniesInline={handleAddCompaniesInline}
              onIncentivize={() => navigate(`/incentivo?cluster=${selectedClusterType}`)}
              hasNoClusters={hasNoClusters}
              selectedClusterId={selectedClusterId}
            />
          </Card>
        </div>
      </main>

      <AddCompaniesDialog
        open={addCompaniesDialogOpen}
        onOpenChange={setAddCompaniesDialogOpen}
        clusterId={selectedClusterType === 'all' ? '' : selectedClusterType}
        onClusterChange={setSelectedClusterType}
        clusters={clusters}
        onAddCompanies={handleAddCompanies}
      />

      <CreateClusterDialog
        open={createDialogOpen}
        onOpenChange={handleDialogClose}
        onSave={editingCluster ? handleUpdateCluster : handleCreateCluster}
        existingCluster={editingCluster}
      />
    </div>
  );
}
