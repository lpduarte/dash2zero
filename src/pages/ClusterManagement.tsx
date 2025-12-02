import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Header } from "@/components/dashboard/Header";
import { ClusterStats } from "@/components/clusters/ClusterStats";
import { ProvidersTable } from "@/components/clusters/ProvidersTable";
import { EmailDialog } from "@/components/clusters/EmailDialog";
import { ImportDialog } from "@/components/clusters/ImportDialog";
import { CreateClusterDialog } from "@/components/clusters/CreateClusterDialog";
import { mockClusters, emailTemplates } from "@/data/mockClusters";
import { mockSuppliers } from "@/data/mockSuppliers";
import { Cluster, ClusterProvider } from "@/types/cluster";
import { Mail, Upload, Download, Search, X, Building2, Users, Handshake, Briefcase, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

type ClusterType = 'all' | 'fornecedor' | 'cliente' | 'parceiro' | 'subcontratado';

const clusterOptions = [
  { value: 'all' as ClusterType, label: 'Todas', icon: LayoutGrid },
  { value: 'fornecedor' as ClusterType, label: 'Fornecedores', icon: Building2 },
  { value: 'cliente' as ClusterType, label: 'Clientes', icon: Users },
  { value: 'parceiro' as ClusterType, label: 'Parceiros', icon: Handshake },
  { value: 'subcontratado' as ClusterType, label: 'Subcontratados', icon: Briefcase },
];

export default function ClusterManagement() {
  const [clusters] = useState<Cluster[]>(mockClusters);
  const [selectedClusterType, setSelectedClusterType] = useState<ClusterType>('all');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [createClusterDialogOpen, setCreateClusterDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ClusterProvider | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>(["NIF/NIPC", "Email", "Setor"]);

  // Get cluster counts
  const clusterCounts = useMemo(() => ({
    all: mockSuppliers.length,
    fornecedor: mockSuppliers.filter(s => s.cluster === 'fornecedor').length,
    cliente: mockSuppliers.filter(s => s.cluster === 'cliente').length,
    parceiro: mockSuppliers.filter(s => s.cluster === 'parceiro').length,
    subcontratado: mockSuppliers.filter(s => s.cluster === 'subcontratado').length,
  }), []);

  // Get selected cluster data for email functionality
  const selectedCluster = clusters.find((c) => c.id === selectedClusterType);

  // Filter suppliers by selected cluster
  const filteredSuppliers = useMemo(() => {
    let filtered = mockSuppliers;
    
    if (selectedClusterType !== 'all') {
      filtered = filtered.filter(s => s.cluster === selectedClusterType);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.id.toLowerCase().includes(query) ||
          company.contact.email.toLowerCase().includes(query) ||
          company.sector.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedClusterType, searchQuery]);

  // Get providers for selected cluster (for email functionality)
  const selectedClusterProviders = useMemo(() => {
    if (selectedClusterType === 'all') {
      return clusters.flatMap(c => c.providers);
    }
    return clusters.find(c => c.id === selectedClusterType)?.providers || [];
  }, [selectedClusterType, clusters]);

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSendEmail = (providerId?: string) => {
    if (providerId) {
      const provider = selectedClusterProviders.find((p) => p.id === providerId);
      setSelectedProvider(provider);
    } else {
      setSelectedProvider(undefined);
    }
    setEmailDialogOpen(true);
  };

  const handleImport = (file: File) => {
    console.log("Importing file:", file.name);
  };

  const handleExport = () => {
    const headers = [
      "Nome", "NIF/NIPC", "Email", "Setor", "Cluster", "Distrito", "Faturação anual (€)",
      "Colaboradores", "Área (m²)", "Âmbito 1 (tCO2-e)", "Âmbito 2 (tCO2-e)",
      "Âmbito 3 (tCO2-e)", "Emissões Totais (tCO2-e)", "Rating"
    ];

    const csvContent = [
      headers.join(","),
      ...filteredSuppliers.map((company) =>
        [
          `"${company.name}"`,
          company.id,
          company.contact.email,
          company.sector,
          company.cluster,
          company.region,
          company.revenue * 1000000,
          company.employees,
          company.area,
          company.scope1,
          company.scope2,
          company.scope3,
          company.totalEmissions,
          company.rating,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `cluster_${selectedClusterType}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  const getRatingColor = (rating: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-green-500 text-white',
      'B': 'bg-lime-500 text-white',
      'C': 'bg-amber-500 text-white',
      'D': 'bg-orange-500 text-white',
      'E': 'bg-red-500 text-white',
    };
    return colors[rating] || 'bg-muted text-muted-foreground';
  };

  const getClusterLabel = () => {
    const option = clusterOptions.find(o => o.value === selectedClusterType);
    return option?.label || 'Cluster';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Cluster Selector */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Filtrar por Cluster</h3>
          <div className="flex flex-wrap gap-2">
            {clusterOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedClusterType(option.value);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200",
                    "hover:shadow-md hover:scale-[1.02]",
                    selectedClusterType === option.value
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{option.label}</span>
                  <span
                    className={cn(
                      "ml-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                      selectedClusterType === option.value
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {clusterCounts[option.value]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Header with actions */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{getClusterLabel()}</h2>
            <p className="text-sm text-muted-foreground">
              {filteredSuppliers.length} empresas {selectedClusterType !== 'all' ? 'neste cluster' : 'no total'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button
              onClick={() => handleSendEmail()}
              disabled={selectedClusterProviders.length === 0}
            >
              <Mail className="h-4 w-4 mr-2" />
              Enviar Email
            </Button>
          </div>
        </div>

        <Tabs defaultValue="resumo" className="space-y-6">
          <TabsList>
            <TabsTrigger value="resumo">Vista Resumida</TabsTrigger>
            <TabsTrigger value="detalhes">Vista Detalhada</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="space-y-6">
            <ClusterStats providers={selectedClusterProviders} />
            <Card className="p-6">
              <ProvidersTable
                providers={selectedClusterProviders}
                onSendEmail={handleSendEmail}
              />
            </Card>
          </TabsContent>

          <TabsContent value="detalhes" className="space-y-6">
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2 border border-border rounded-md px-4 py-2 bg-card">
                {activeFilters.map((filter) => (
                  <Badge key={filter} variant="secondary" className="gap-1 bg-secondary/50">
                    {filter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter)} />
                  </Badge>
                ))}
              </div>
              <div className="relative sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Full details table */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-primary-foreground min-w-[180px]">Nome</TableHead>
                    <TableHead className="text-primary-foreground min-w-[100px]">Rating</TableHead>
                    <TableHead className="text-primary-foreground min-w-[200px]">Email</TableHead>
                    <TableHead className="text-primary-foreground min-w-[120px]">Setor</TableHead>
                    <TableHead className="text-primary-foreground min-w-[100px]">Região</TableHead>
                    <TableHead className="text-primary-foreground min-w-[120px]">Faturação (€)</TableHead>
                    <TableHead className="text-primary-foreground min-w-[100px]">Colab.</TableHead>
                    <TableHead className="text-primary-foreground min-w-[100px]">Área (m²)</TableHead>
                    <TableHead className="text-primary-foreground min-w-[120px]">Âmbito 1</TableHead>
                    <TableHead className="text-primary-foreground min-w-[120px]">Âmbito 2</TableHead>
                    <TableHead className="text-primary-foreground min-w-[120px]">Âmbito 3</TableHead>
                    <TableHead className="text-primary-foreground min-w-[140px]">Total (tCO2-e)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSuppliers.map((company, index) => (
                    <TableRow
                      key={company.id}
                      className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}
                    >
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>
                        <Badge className={getRatingColor(company.rating)}>{company.rating}</Badge>
                      </TableCell>
                      <TableCell>{company.contact.email}</TableCell>
                      <TableCell className="capitalize">{company.sector}</TableCell>
                      <TableCell className="capitalize">{company.region}</TableCell>
                      <TableCell>{(company.revenue * 1000000).toLocaleString('pt-PT')}</TableCell>
                      <TableCell>{company.employees}</TableCell>
                      <TableCell>{company.area.toLocaleString('pt-PT')}</TableCell>
                      <TableCell>{company.scope1.toFixed(1)}</TableCell>
                      <TableCell>{company.scope2.toFixed(1)}</TableCell>
                      <TableCell>{company.scope3.toFixed(1)}</TableCell>
                      <TableCell className="font-semibold">{company.totalEmissions.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(1)} className="cursor-pointer">1</PaginationLink>
                    </PaginationItem>
                  )}
                  {currentPage > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(currentPage - 1)} className="cursor-pointer">
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink isActive className="cursor-pointer">{currentPage}</PaginationLink>
                  </PaginationItem>
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(currentPage + 1)} className="cursor-pointer">
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {currentPage < totalPages - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(totalPages)} className="cursor-pointer">
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        templates={emailTemplates}
        provider={selectedProvider}
        providers={selectedProvider ? undefined : selectedClusterProviders}
      />

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        clusterId={selectedClusterType}
        onImport={handleImport}
      />

      <CreateClusterDialog
        open={createClusterDialogOpen}
        onOpenChange={setCreateClusterDialogOpen}
        onCreate={() => {}}
      />
    </div>
  );
}
