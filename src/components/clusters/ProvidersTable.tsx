import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SupplierAny, hasFootprint } from "@/types/supplierNew";
import { onboardingStatusConfig, getStatusLabel, getStatusOrder, OnboardingStatus, CompletedVia } from "@/config/onboardingStatus";
import { cn } from "@/lib/utils";
import { Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, X } from "lucide-react";

interface ProvidersTableProps {
  companies: SupplierAny[];
}

type SortField = 'name' | 'nif' | 'email' | 'status';
type SortDirection = 'asc' | 'desc';

interface SortState {
  field: SortField;
  direction: SortDirection;
}

// Helper to get status info from a company (handles both types)
function getCompanyStatus(company: SupplierAny): { status: OnboardingStatus; completedVia?: CompletedVia } {
  if (hasFootprint(company)) {
    // Empresas com pegada são "completo"
    const completedVia = company.dataSource === 'get2zero' ? 'simple' : 'formulario';
    return { status: 'completo', completedVia };
  }
  // Empresas sem pegada usam o onboardingStatus
  return { status: company.onboardingStatus as OnboardingStatus, completedVia: company.completedVia };
}

// Filter status includes completo split by completedVia
type FilterStatus = OnboardingStatus | 'completo_simple' | 'completo_formulario';

// All possible filter values (completo split into two)
const allFilterStatuses: { value: FilterStatus; label: string }[] = [
  { value: 'por_contactar', label: 'Por contactar' },
  { value: 'sem_interacao', label: 'Sem interação' },
  { value: 'interessada', label: 'Interessada' },
  { value: 'registada_simple', label: 'Registada / Simple' },
  { value: 'em_progresso_simple', label: 'Em progresso / Simple' },
  { value: 'em_progresso_formulario', label: 'Em progresso / Formulário' },
  { value: 'completo_simple', label: 'Completo / Simple' },
  { value: 'completo_formulario', label: 'Completo / Formulário' },
];

// Helper to get the filter status (handles completo split)
function getCompanyFilterStatus(company: SupplierAny): FilterStatus {
  const { status, completedVia } = getCompanyStatus(company);
  if (status === 'completo') {
    return completedVia === 'simple' ? 'completo_simple' : 'completo_formulario';
  }
  return status;
}

// SortableHeader component
interface SortableHeaderProps {
  field: SortField;
  label: string;
  sortState: SortState;
  onSort: (field: SortField) => void;
  children?: React.ReactNode;
}

function SortableHeader({ field, label, sortState, onSort, children }: SortableHeaderProps) {
  const isActive = sortState.field === field;

  return (
    <TableHead>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSort(field)}
          className={cn(
            "flex items-center gap-1 hover:text-foreground transition-colors -ml-2 px-2 py-1 rounded",
            isActive ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
          {isActive ? (
            sortState.direction === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          ) : (
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          )}
        </button>
        {children}
      </div>
    </TableHead>
  );
}

// StatusFilter component
interface StatusFilterProps {
  statusFilters: FilterStatus[];
  setStatusFilters: (filters: FilterStatus[]) => void;
  statusCounts: Record<FilterStatus, number>;
}

function StatusFilter({ statusFilters, setStatusFilters, statusCounts }: StatusFilterProps) {
  const activeCount = statusFilters.length;

  const toggleStatus = (status: FilterStatus) => {
    if (statusFilters.includes(status)) {
      setStatusFilters(statusFilters.filter(s => s !== status));
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };

  const clearFilters = () => {
    setStatusFilters([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-1 rounded hover:bg-muted transition-colors",
            activeCount > 0 && "text-primary"
          )}
        >
          <Filter className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold">Filtrar por estado</span>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {allFilterStatuses.map(({ value, label }) => {
            const count = statusCounts[value] || 0;

            return (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded -mx-1"
              >
                <Checkbox
                  checked={statusFilters.includes(value)}
                  onCheckedChange={() => toggleStatus(value)}
                />
                <span className="flex-1 text-sm">{label}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ProvidersTable({ companies }: ProvidersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortState, setSortState] = useState<SortState>({
    field: 'status',
    direction: 'asc'
  });
  const [statusFilters, setStatusFilters] = useState<FilterStatus[]>([]);

  // Count companies by filter status (for filter display)
  const statusCounts = useMemo(() => {
    const counts: Record<FilterStatus, number> = {} as Record<FilterStatus, number>;
    allFilterStatuses.forEach(({ value }) => counts[value] = 0);

    companies.forEach(company => {
      const filterStatus = getCompanyFilterStatus(company);
      counts[filterStatus] = (counts[filterStatus] || 0) + 1;
    });

    return counts;
  }, [companies]);

  // Filter and sort companies
  const filteredAndSortedCompanies = useMemo(() => {
    let result = [...companies];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.contact.nif.toLowerCase().includes(query) ||
        company.contact.email.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilters.length > 0) {
      result = result.filter(company => {
        const filterStatus = getCompanyFilterStatus(company);
        return statusFilters.includes(filterStatus);
      });
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortState.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'pt');
          break;
        case 'nif':
          comparison = a.contact.nif.localeCompare(b.contact.nif);
          break;
        case 'email':
          comparison = a.contact.email.localeCompare(b.contact.email, 'pt');
          break;
        case 'status':
          const statusA = getCompanyStatus(a);
          const statusB = getCompanyStatus(b);
          comparison = getStatusOrder(statusA.status) - getStatusOrder(statusB.status);
          break;
      }

      return sortState.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [companies, searchQuery, statusFilters, sortState]);

  const handleSort = (field: SortField) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilters([]);
  };

  // Empty state: no companies at all
  if (companies.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma empresa neste cluster.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por nome, NIF ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table or empty state */}
      {filteredAndSortedCompanies.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-3">
            Nenhuma empresa encontrada com os filtros actuais.
          </p>
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                field="name"
                label="Nome"
                sortState={sortState}
                onSort={handleSort}
              />
              <SortableHeader
                field="nif"
                label="NIF"
                sortState={sortState}
                onSort={handleSort}
              />
              <SortableHeader
                field="email"
                label="Email"
                sortState={sortState}
                onSort={handleSort}
              />
              <SortableHeader
                field="status"
                label="Estado"
                sortState={sortState}
                onSort={handleSort}
              >
                <StatusFilter
                  statusFilters={statusFilters}
                  setStatusFilters={setStatusFilters}
                  statusCounts={statusCounts}
                />
              </SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCompanies.map((company) => {
              const { status, completedVia } = getCompanyStatus(company);
              const config = onboardingStatusConfig[status];
              const label = getStatusLabel(status, completedVia);

              return (
                <TableRow key={company.id}>
                  <TableCell className="font-normal">{company.name}</TableCell>
                  <TableCell>{company.contact.nif}</TableCell>
                  <TableCell className="text-muted-foreground">{company.contact.email}</TableCell>
                  <TableCell>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            <Badge className={`text-xs py-0 ${config?.color || 'bg-muted text-muted-foreground'}`}>
                              {label}
                            </Badge>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className={cn("border", config?.borderColor)}>
                          {config?.tooltip || ''}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
