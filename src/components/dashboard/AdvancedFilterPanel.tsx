import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, RotateCcw } from "lucide-react";
import { AdvancedFilters } from "@/types/supplier";

interface AdvancedFilterPanelProps {
  filters: AdvancedFilters;
  onFilterChange: (key: keyof AdvancedFilters, value: any) => void;
  onReset: () => void;
}

export const AdvancedFilterPanel = ({
  filters,
  onFilterChange,
  onReset,
}: AdvancedFilterPanelProps) => {
  return (
    <Card className="p-6 shadow-md mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1 */}
        <div className="space-y-2">
          <Label htmlFor="nif-group" className="text-xs text-muted-foreground">
            Selecionar grupo de NIF/NIPC
          </Label>
          <Select 
            value={filters.nifGroup} 
            onValueChange={(value) => onFilterChange('nifGroup', value)}
          >
            <SelectTrigger id="nif-group">
              <SelectValue placeholder="Todos os grupos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os grupos</SelectItem>
              <SelectItem value="group1">Grupo A</SelectItem>
              <SelectItem value="group2">Grupo B</SelectItem>
              <SelectItem value="group3">Grupo C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nif" className="text-xs text-muted-foreground">
            Selecionar NIF/NIPC
          </Label>
          <Select 
            value={filters.nif} 
            onValueChange={(value) => onFilterChange('nif', value)}
          >
            <SelectTrigger id="nif">
              <SelectValue placeholder="Todos os NIF/NIPC" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os NIF/NIPC</SelectItem>
              <SelectItem value="nif1">500000000</SelectItem>
              <SelectItem value="nif2">510000000</SelectItem>
              <SelectItem value="nif3">520000000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="district" className="text-xs text-muted-foreground">
            Selecionar distrito
          </Label>
          <Select 
            value={filters.district} 
            onValueChange={(value) => onFilterChange('district', value)}
          >
            <SelectTrigger id="district">
              <SelectValue placeholder="Todos os distritos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os distritos</SelectItem>
              <SelectItem value="porto">Porto</SelectItem>
              <SelectItem value="lisboa">Lisboa</SelectItem>
              <SelectItem value="braga">Braga</SelectItem>
              <SelectItem value="coimbra">Coimbra</SelectItem>
              <SelectItem value="faro">Faro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="municipality" className="text-xs text-muted-foreground">
            Selecionar município
          </Label>
          <Select 
            value={filters.municipality} 
            onValueChange={(value) => onFilterChange('municipality', value)}
          >
            <SelectTrigger id="municipality">
              <SelectValue placeholder="Todos os municípios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os municípios</SelectItem>
              <SelectItem value="porto">Porto</SelectItem>
              <SelectItem value="lisboa">Lisboa</SelectItem>
              <SelectItem value="braga">Braga</SelectItem>
              <SelectItem value="coimbra">Coimbra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Row 2 */}
        <div className="space-y-2">
          <Label htmlFor="company-size" className="text-xs text-muted-foreground">
            Selecionar dimensão
          </Label>
          <Select 
            value={filters.companySize} 
            onValueChange={(value) => onFilterChange('companySize', value)}
          >
            <SelectTrigger id="company-size">
              <SelectValue placeholder="Todas as dimensões" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as dimensões</SelectItem>
              <SelectItem value="micro">Microempresa</SelectItem>
              <SelectItem value="small">Pequena Empresa</SelectItem>
              <SelectItem value="medium">Média Empresa</SelectItem>
              <SelectItem value="large">Grande Empresa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenue" className="text-xs text-muted-foreground">
            Selecionar faturação
          </Label>
          <Select 
            value={filters.revenue} 
            onValueChange={(value) => onFilterChange('revenue', value)}
          >
            <SelectTrigger id="revenue">
              <SelectValue placeholder="Todas as faixas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as faixas</SelectItem>
              <SelectItem value="0-1m">0 - 1M €</SelectItem>
              <SelectItem value="1m-10m">1M - 10M €</SelectItem>
              <SelectItem value="10m-50m">10M - 50M €</SelectItem>
              <SelectItem value="50m+">50M+ €</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cae-section" className="text-xs text-muted-foreground">
            Selecionar secção - CAE
          </Label>
          <Select 
            value={filters.caeSection} 
            onValueChange={(value) => onFilterChange('caeSection', value)}
          >
            <SelectTrigger id="cae-section">
              <SelectValue placeholder="Todas as secções" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as secções</SelectItem>
              <SelectItem value="a">A - Agricultura</SelectItem>
              <SelectItem value="c">C - Indústrias transformadoras</SelectItem>
              <SelectItem value="f">F - Construção</SelectItem>
              <SelectItem value="g">G - Comércio</SelectItem>
              <SelectItem value="j">J - Informação e comunicação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cae-division" className="text-xs text-muted-foreground">
            Selecionar divisão - CAE
          </Label>
          <Select 
            value={filters.caeDivision} 
            onValueChange={(value) => onFilterChange('caeDivision', value)}
          >
            <SelectTrigger id="cae-division">
              <SelectValue placeholder="Todas as divisões" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as divisões</SelectItem>
              <SelectItem value="62">62 - Programação informática</SelectItem>
              <SelectItem value="41">41 - Construção de edifícios</SelectItem>
              <SelectItem value="46">46 - Comércio por grosso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Row 3 */}
        <div className="space-y-2">
          <Label htmlFor="company" className="text-xs text-muted-foreground">
            Selecionar empresa
          </Label>
          <Select 
            value={filters.company} 
            onValueChange={(value) => onFilterChange('company', value)}
          >
            <SelectTrigger id="company">
              <SelectValue placeholder="Todas as empresas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as empresas</SelectItem>
              <SelectItem value="1">EcoTech Solutions</SelectItem>
              <SelectItem value="2">GreenBuild Construtores</SelectItem>
              <SelectItem value="3">TransporteVerde Logística</SelectItem>
              <SelectItem value="4">Indústrias SustentaPT</SelectItem>
              <SelectItem value="5">CleanServices Lda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="carbon-year" className="text-xs text-muted-foreground">
            Selecionar ano da Pegada de Carbono
          </Label>
          <Select 
            value={filters.carbonYear} 
            onValueChange={(value) => onFilterChange('carbonYear', value)}
          >
            <SelectTrigger id="carbon-year">
              <SelectValue placeholder="Todos os anos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os anos</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 lg:col-span-2">
          <Label className="text-xs text-muted-foreground">
            Período de análise
          </Label>
          <div className="flex gap-2 items-center">
            <Input 
              type="month"
              value={filters.dateRange.start}
              onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
              className="flex-1"
            />
            <span className="text-muted-foreground">-</span>
            <Input 
              type="month"
              value={filters.dateRange.end}
              onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
