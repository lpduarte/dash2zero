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
import { ClusterSidebar } from "@/components/clusters/ClusterSidebar";
import { ClusterStats } from "@/components/clusters/ClusterStats";
import { ProvidersTable } from "@/components/clusters/ProvidersTable";
import { EmailDialog } from "@/components/clusters/EmailDialog";
import { ImportDialog } from "@/components/clusters/ImportDialog";
import { CreateClusterDialog } from "@/components/clusters/CreateClusterDialog";
import { mockClusters, emailTemplates } from "@/data/mockClusters";
import { mockSuppliers } from "@/data/mockSuppliers";
import { Cluster, ClusterProvider } from "@/types/cluster";
import { Mail, Upload, Download, Search, X } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function ClusterManagement() {
  const [clusters, setClusters] = useState<Cluster[]>(mockClusters);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(
    mockClusters[0]?.id || null
  );
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [createClusterDialogOpen, setCreateClusterDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ClusterProvider | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>(["NIF/NIPC", "Email", "Setor"]);

  const selectedCluster = clusters.find((c) => c.id === selectedClusterId);

  // Filter suppliers by selected cluster
  const filteredSuppliers = useMemo(() => {
    let filtered = mockSuppliers;
    
    // Filter by cluster type
    if (selectedClusterId && selectedClusterId !== 'all') {
      filtered = filtered.filter(s => s.cluster === selectedClusterId);
    }
    
    // Filter by search query
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
  }, [selectedClusterId, searchQuery]);

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSendEmail = (providerId?: string) => {
    if (providerId) {
      const provider = selectedCluster?.providers.find((p) => p.id === providerId);
      setSelectedProvider(provider);
    } else {
      setSelectedProvider(undefined);
    }
    setEmailDialogOpen(true);
  };

  const handleImport = (file: File) => {
    console.log("Importing file:", file.name);
  };

  const handleCreateCluster = (name: string) => {
    const newCluster: Cluster = {
      id: Date.now().toString(),
      name,
      providers: [],
      createdAt: new Date(),
    };
    setClusters([...clusters, newCluster]);
    setSelectedClusterId(newCluster.id);
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
    link.setAttribute("download", `cluster_${selectedClusterId}_${new Date().toISOString().split("T")[0]}.csv`);
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <ClusterSidebar
          clusters={clusters}
          selectedClusterId={selectedClusterId}
          onSelectCluster={(id) => {
            setSelectedClusterId(id);
            setCurrentPage(1);
          }}
          onCreateCluster={() => setCreateClusterDialogOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-8 py-6">
            {selectedCluster ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedCluster.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredSuppliers.length} empresas neste cluster
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
                      disabled={selectedCluster.providers.length === 0}
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
                    <ClusterStats providers={selectedCluster.providers} />
                    <Card className="p-6">
                      <ProvidersTable
                        providers={selectedCluster.providers}
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
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Nenhum cluster selecionado</p>
                  <Button onClick={() => setCreateClusterDialogOpen(true)}>Criar Primeiro Cluster</Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        templates={emailTemplates}
        provider={selectedProvider}
        providers={selectedProvider ? undefined : selectedCluster?.providers}
      />

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        clusterId={selectedClusterId || ""}
        onImport={handleImport}
      />

      <CreateClusterDialog
        open={createClusterDialogOpen}
        onOpenChange={setCreateClusterDialogOpen}
        onCreate={handleCreateCluster}
      />
    </div>
  );
}
