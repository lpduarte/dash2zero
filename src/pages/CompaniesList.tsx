import { useState, useMemo } from "react";
import { Download, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { mockSuppliers } from "@/data/mockSuppliers";
import { Header } from "@/components/dashboard/Header";

const ITEMS_PER_PAGE = 10;

const CompaniesList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "NIF/NIPC",
    "Email",
    "Setor",
    "Secção",
  ]);

  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return mockSuppliers;
    
    const query = searchQuery.toLowerCase();
    return mockSuppliers.filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        company.id.toLowerCase().includes(query) ||
        company.contact.email.toLowerCase().includes(query) ||
        company.sector.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleExport = () => {
    const headers = [
      "Nome",
      "NIF/NIPC",
      "Email",
      "Setor",
      "Distrito",
      "Município",
      "Faturação anual (€)",
      "Colaboradores",
      "Área (m²)",
      "Âmbito 1 (tCO2-e)",
      "Âmbito 2 (tCO2-e)",
      "Âmbito 3 (tCO2-e)",
      "Emissões Totais (tCO2-e)",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredCompanies.map((company) =>
        [
          `"${company.name}"`,
          company.id,
          company.contact.email,
          company.sector,
          company.region,
          "-",
          company.revenue * 1000000,
          company.employees,
          company.area,
          company.scope1,
          company.scope2,
          company.scope3,
          company.totalEmissions,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `empresas_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-6">Lista de empresas</h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2 border border-border rounded-md px-4 py-2 bg-card">
              {activeFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="gap-1 bg-secondary/50"
                >
                  {filter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
              <span className="text-muted-foreground">...</span>
            </div>

            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="mb-4">
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground">Nome</TableHead>
                  <TableHead className="text-primary-foreground">NIF/NIPC</TableHead>
                  <TableHead className="text-primary-foreground">Email</TableHead>
                  <TableHead className="text-primary-foreground">Setor</TableHead>
                  <TableHead className="text-primary-foreground">Secção</TableHead>
                  <TableHead className="text-primary-foreground">Atividade económica (CAE)</TableHead>
                  <TableHead className="text-primary-foreground">Colaboradores</TableHead>
                  <TableHead className="text-primary-foreground">Faturação (M€)</TableHead>
                  <TableHead className="text-primary-foreground">Emissões (tCO2-e)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompanies.map((company, index) => (
                  <TableRow
                    key={company.id}
                    className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}
                  >
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.id}</TableCell>
                    <TableCell>{company.contact.email}</TableCell>
                    <TableCell>{company.sector}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="max-w-xs truncate">{company.sector}</TableCell>
                    <TableCell>{company.employees}</TableCell>
                    <TableCell>{company.revenue.toFixed(1)} M</TableCell>
                    <TableCell>{company.totalEmissions.toFixed(0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
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
                    <PaginationLink onClick={() => setCurrentPage(1)} className="cursor-pointer">
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}

                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="cursor-pointer"
                    >
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationLink isActive className="cursor-pointer">
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="cursor-pointer"
                    >
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(totalPages)}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={
                      currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompaniesList;
