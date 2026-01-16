import { useState, useEffect } from "react";
import { 
  Palette, Type, Square, Layers, MousePointerClick, Tag, LayoutGrid, 
  FormInput, ListFilter, BarChart3, AlertCircle, Activity, Columns, 
  Table2, PieChart, Star, Hash, Ban, Moon, Sun, Factory, Building2, 
  Zap, TrendingUp, TrendingDown, Download, Filter, Search, Settings, 
  Info, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight, 
  Eye, Mail, Users, Leaf, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KPICard } from "@/components/ui/kpi-card";
import { 
  formatNumber, formatEmissions, formatPercentage, formatIntensity, 
  formatCurrency, formatRevenue 
} from "@/lib/formatters";
import { riskColors, scopeColors, cardStyles, textStyles, spacing, iconSizes } from "@/lib/styles";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell 
} from "recharts";

const sections = [
  { id: 'cores', label: 'Cores', icon: Palette },
  { id: 'tipografia', label: 'Tipografia', icon: Type },
  { id: 'espacamento', label: 'Espaçamento', icon: Square },
  { id: 'sombras', label: 'Sombras', icon: Layers },
  { id: 'botoes', label: 'Botões', icon: MousePointerClick },
  { id: 'badges', label: 'Badges', icon: Tag },
  { id: 'cards', label: 'Cards', icon: LayoutGrid },
  { id: 'inputs', label: 'Inputs', icon: FormInput },
  { id: 'select', label: 'Select', icon: ListFilter },
  { id: 'kpi-cards', label: 'KPI Cards', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: AlertCircle },
  { id: 'progress', label: 'Progress', icon: Activity },
  { id: 'tabs', label: 'Tabs', icon: Columns },
  { id: 'tabelas', label: 'Tabelas', icon: Table2 },
  { id: 'graficos', label: 'Gráficos', icon: PieChart },
  { id: 'icones', label: 'Ícones', icon: Star },
  { id: 'formatacao', label: 'Formatação', icon: Hash },
  { id: 'anti-padroes', label: 'Anti-padrões', icon: Ban },
];

const primaryColors = [
  { name: '--background', tailwind: 'bg-background', hsl: '170 15% 97%' },
  { name: '--foreground', tailwind: 'text-foreground', hsl: '175 25% 12%' },
  { name: '--card', tailwind: 'bg-card', hsl: '0 0% 100%' },
  { name: '--card-foreground', tailwind: 'text-card-foreground', hsl: '175 25% 12%' },
  { name: '--primary', tailwind: 'bg-primary', hsl: '175 66% 38%' },
  { name: '--primary-foreground', tailwind: 'text-primary-foreground', hsl: '0 0% 100%' },
  { name: '--primary-light', tailwind: 'bg-primary-light', hsl: '175 55% 48%' },
  { name: '--primary-dark', tailwind: 'bg-primary-dark', hsl: '175 70% 28%' },
  { name: '--secondary', tailwind: 'bg-secondary', hsl: '185 50% 25%' },
  { name: '--muted', tailwind: 'bg-muted', hsl: '170 15% 94%' },
  { name: '--muted-foreground', tailwind: 'text-muted-foreground', hsl: '175 15% 40%' },
  { name: '--accent', tailwind: 'bg-accent', hsl: '175 70% 28%' },
  { name: '--border', tailwind: 'border-border', hsl: '175 20% 88%' },
  { name: '--input', tailwind: 'border-input', hsl: '175 20% 88%' },
  { name: '--ring', tailwind: 'ring-ring', hsl: '175 66% 38%' },
];

const semanticColors = [
  { name: '--success', tailwind: 'text-success', hsl: '160 65% 40%', label: 'Sucesso / Baixo Risco' },
  { name: '--warning', tailwind: 'text-warning', hsl: '42 90% 50%', label: 'Atenção / Médio Risco' },
  { name: '--danger', tailwind: 'text-danger', hsl: '0 70% 55%', label: 'Erro / Alto Risco' },
];

const commonIcons = [
  { icon: Factory, name: "Factory" },
  { icon: Building2, name: "Building2" },
  { icon: Zap, name: "Zap" },
  { icon: TrendingUp, name: "TrendingUp" },
  { icon: TrendingDown, name: "TrendingDown" },
  { icon: Download, name: "Download" },
  { icon: Filter, name: "Filter" },
  { icon: Search, name: "Search" },
  { icon: Settings, name: "Settings" },
  { icon: Info, name: "Info" },
  { icon: AlertTriangle, name: "AlertTriangle" },
  { icon: CheckCircle, name: "CheckCircle" },
  { icon: XCircle, name: "XCircle" },
  { icon: ChevronDown, name: "ChevronDown" },
  { icon: ChevronRight, name: "ChevronRight" },
  { icon: Eye, name: "Eye" },
  { icon: Mail, name: "Mail" },
  { icon: Users, name: "Users" },
];

const chartData = [
  { name: 'Jan', value: 400 },
  { name: 'Fev', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Abr', value: 450 },
];

const scopeChartData = [
  { name: 'Âmbito 1', value: 27, fill: 'hsl(263 70% 50%)' },
  { name: 'Âmbito 2', value: 18, fill: 'hsl(175 66% 38%)' },
  { name: 'Âmbito 3', value: 55, fill: 'hsl(25 85% 55%)' },
];

const ColorSwatch = ({ 
  color, 
  label, 
  hsl, 
  tailwind 
}: { 
  color: string; 
  label: string; 
  hsl: string; 
  tailwind: string;
}) => (
  <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
    <div className={`w-12 h-12 rounded-lg border ${color}`} />
    <div className="flex-1 min-w-0">
      <p className="font-mono text-xs text-muted-foreground truncate">{label}</p>
      <p className="font-mono text-xs text-muted-foreground/70 truncate">{tailwind}</p>
      <p className="font-mono text-xs text-muted-foreground/50 truncate">{hsl}</p>
    </div>
  </div>
);

const SectionHeader = ({ 
  title, 
  id, 
  description 
}: { 
  title: string; 
  id: string; 
  description?: string;
}) => (
  <div id={id} className="scroll-mt-6 mb-6 pt-8 border-t first:border-t-0 first:pt-0">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    {description && <p className="text-muted-foreground">{description}</p>}
  </div>
);

const CodeBlock = ({ children }: { children: string }) => (
  <pre className="p-3 bg-muted rounded-lg text-xs font-mono overflow-x-auto">
    <code>{children}</code>
  </pre>
);

const StyleGuide = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('cores');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar de navegação */}
      <aside className="w-64 border-r bg-card fixed h-screen overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Logo + Título */}
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold">Dash2Zero</h1>
                <p className="text-xs text-muted-foreground">Design System</p>
              </div>
            </div>

            {/* Toggle Dark Mode */}
            <div className="flex items-center justify-between p-3 mb-6 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="text-sm">{darkMode ? 'Dark' : 'Light'}</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Lista de links para secções */}
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                      ${isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 p-3 border rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">
                v1.0 · Janeiro 2026
              </p>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 ml-64 p-8 max-w-5xl">
        {/* Header da página */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dash2Zero Design System</h1>
          <p className="text-lg text-muted-foreground">
            Guia visual de componentes e padrões
          </p>
        </div>

        {/* === SECÇÃO: CORES === */}
        <SectionHeader 
          id="cores" 
          title="Cores" 
          description="Paleta de cores do design system baseada em HSL"
        />

        <div className="space-y-8">
          {/* Cores Primárias */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cores Primárias</h3>
            <div className="grid grid-cols-2 gap-3">
              {primaryColors.map((c) => (
                <ColorSwatch
                  key={c.name}
                  color={c.tailwind}
                  label={c.name}
                  hsl={c.hsl}
                  tailwind={c.tailwind}
                />
              ))}
            </div>
          </div>

          {/* Cores Semânticas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cores Semânticas</h3>
            <div className="grid grid-cols-3 gap-3">
              {semanticColors.map((c) => (
                <div key={c.name} className="p-4 border rounded-lg bg-card">
                  <div className={`w-full h-16 rounded-lg mb-3 ${c.tailwind.replace('text-', 'bg-')}`} />
                  <p className="font-medium text-sm">{c.label}</p>
                  <p className="font-mono text-xs text-muted-foreground">{c.name}</p>
                  <p className="font-mono text-xs text-muted-foreground/70">{c.tailwind}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cores de Âmbito */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cores de Âmbito (Scopes)</h3>
            <div className="grid grid-cols-3 gap-4">
              {([1, 2, 3] as const).map((scope) => (
                <div key={scope} className={`p-4 rounded-lg border ${scopeColors[scope].bgLight} ${scopeColors[scope].border}`}>
                  <Badge className={scopeColors[scope].badge}>Âmbito {scope}</Badge>
                  <p className={`mt-3 font-semibold ${scopeColors[scope].text}`}>
                    Texto de exemplo
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {scopeColors[scope].label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Gradientes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Gradientes</h3>
            <div className="space-y-3">
              <div className="h-12 rounded-lg bg-gradient-primary" />
              <p className="font-mono text-xs text-muted-foreground">--gradient-primary · bg-gradient-primary</p>
              
              <div className="h-12 rounded-lg bg-gradient-secondary" />
              <p className="font-mono text-xs text-muted-foreground">--gradient-secondary · bg-gradient-secondary</p>
              
              <div className="h-12 rounded-lg bg-gradient-accent" />
              <p className="font-mono text-xs text-muted-foreground">--gradient-accent · bg-gradient-accent</p>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: TIPOGRAFIA === */}
        <SectionHeader 
          id="tipografia" 
          title="Tipografia" 
          description="Escala de tamanhos e pesos tipográficos"
        />

        <div className="space-y-8">
          {/* Escala de Tamanhos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Escala de Tamanhos</h3>
            <div className="space-y-4 border rounded-lg p-4 bg-card">
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-xs (12px)</span>
                <span className="text-xs">Labels pequenos</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-sm (14px)</span>
                <span className="text-sm">Texto secundário</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-base (16px)</span>
                <span className="text-base">Texto normal</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-lg (18px)</span>
                <span className="text-lg">Títulos de secção</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-xl (20px)</span>
                <span className="text-xl">Títulos de cards</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-2xl (24px)</span>
                <span className="text-2xl">Valores de KPI</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-3xl (30px)</span>
                <span className="text-3xl">Números em destaque</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs w-24 text-muted-foreground">text-4xl (36px)</span>
                <span className="text-4xl">Headers principais</span>
              </div>
            </div>
          </div>

          {/* Pesos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pesos</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xl font-normal">Aa</p>
                <p className="text-xs text-muted-foreground mt-2">font-normal (400)</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xl font-medium">Aa</p>
                <p className="text-xs text-muted-foreground mt-2">font-medium (500)</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xl font-semibold">Aa</p>
                <p className="text-xs text-muted-foreground mt-2">font-semibold (600)</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xl font-bold">Aa</p>
                <p className="text-xs text-muted-foreground mt-2">font-bold (700)</p>
              </div>
            </div>
          </div>

          {/* Padrões de Texto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Padrões de Texto (textStyles)</h3>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg bg-card">
                <p className={textStyles.kpiTitle}>Título de KPI</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">textStyles.kpiTitle</p>
              </div>
              <div className="p-4 border rounded-lg bg-card">
                <p className={textStyles.kpiValue}>15.749</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">textStyles.kpiValue</p>
              </div>
              <div className="p-4 border rounded-lg bg-card">
                <p className={textStyles.kpiUnit}>t CO₂e</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">textStyles.kpiUnit</p>
              </div>
              <div className="p-4 border rounded-lg bg-card">
                <p className={textStyles.sectionTitle}>Título de Secção</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">textStyles.sectionTitle</p>
              </div>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: ESPAÇAMENTO === */}
        <SectionHeader 
          id="espacamento" 
          title="Espaçamento" 
          description="Escala de padding, margin e gap"
        />

        <div className="space-y-8">
          {/* Escala Visual */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Escala Visual</h3>
            <div className="space-y-3">
              {[
                { size: 1, px: 4 },
                { size: 2, px: 8 },
                { size: 3, px: 12 },
                { size: 4, px: 16 },
                { size: 5, px: 20 },
                { size: 6, px: 24 },
                { size: 8, px: 32 },
              ].map((s) => (
                <div key={s.size} className="flex items-center gap-4">
                  <div 
                    className="bg-primary rounded" 
                    style={{ width: s.px * 3, height: 24 }}
                  />
                  <span className="text-sm font-mono w-16">p-{s.size}</span>
                  <span className="text-xs text-muted-foreground">{s.px}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* Padrões de Spacing */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Padrões de Spacing (lib/styles.ts)</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(spacing).map(([key, value]) => (
                <div key={key} className="p-3 border rounded-lg bg-card flex justify-between items-center">
                  <span className="text-sm font-mono">spacing.{key}</span>
                  <Badge variant="outline">{value}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === SECÇÃO: SOMBRAS === */}
        <SectionHeader 
          id="sombras" 
          title="Sombras & Elevação" 
          description="Níveis de profundidade e arredondamento"
        />

        <div className="space-y-8">
          {/* Sombras */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Níveis de Sombra</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg bg-card shadow-sm text-center">
                <p className="font-medium">shadow-sm</p>
                <p className="text-xs text-muted-foreground mt-2">Cards pequenos</p>
              </div>
              <div className="p-6 border rounded-lg bg-card shadow-md text-center">
                <p className="font-medium">shadow-md</p>
                <p className="text-xs text-muted-foreground mt-2">Cards principais</p>
              </div>
              <div className="p-6 border rounded-lg bg-card shadow-lg text-center">
                <p className="font-medium">shadow-lg</p>
                <p className="text-xs text-muted-foreground mt-2">Modais</p>
              </div>
            </div>
          </div>

          {/* Shadow Glow */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shadow Glow (Marca)</h3>
            <div 
              className="p-6 border rounded-lg bg-card text-center"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <p className="font-medium">shadow-glow</p>
              <p className="text-xs text-muted-foreground mt-2">Elementos de destaque da marca</p>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Border Radius</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 border bg-card rounded-md text-center">
                <p className="font-medium">rounded-md</p>
                <p className="text-xs text-muted-foreground mt-2">Elementos pequenos</p>
              </div>
              <div className="p-6 border bg-card rounded-lg text-center">
                <p className="font-medium">rounded-lg</p>
                <p className="text-xs text-muted-foreground mt-2">Cards, botões (padrão)</p>
              </div>
              <div className="p-6 border bg-card rounded-full text-center">
                <p className="font-medium">rounded-full</p>
                <p className="text-xs text-muted-foreground mt-2">Badges, avatars</p>
              </div>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: BOTÕES === */}
        <SectionHeader 
          id="botoes" 
          title="Botões" 
          description="Variantes, tamanhos e estados"
        />

        <div className="space-y-8">
          {/* Variantes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Variantes</h3>
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Tamanhos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tamanhos</h3>
            <div className="flex items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* Estados */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Estados</h3>
            <div className="flex items-center gap-3">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Hover: passe o cursor sobre o botão "Normal"
            </p>
          </div>

          {/* Com Ícone */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Com Ícone</h3>
            <div className="flex flex-wrap gap-3">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
              <Button size="icon" variant="ghost">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: BADGES === */}
        <SectionHeader 
          id="badges" 
          title="Badges" 
          description="Etiquetas e indicadores visuais"
        />

        <div className="space-y-8">
          {/* Variantes Padrão */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Variantes Padrão</h3>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>

          {/* Badges Semânticos (Risco) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Badges de Risco (riskColors)</h3>
            <div className="flex flex-wrap gap-3">
              <Badge className={riskColors.baixo.badge}>Baixo</Badge>
              <Badge className={riskColors.medio.badge}>Médio</Badge>
              <Badge className={riskColors.alto.badge}>Alto</Badge>
              <Badge className={riskColors.critico.badge}>Crítico</Badge>
            </div>
            <CodeBlock>
              {`import { riskColors } from "@/lib/styles";
<Badge className={riskColors.baixo.badge}>Baixo</Badge>`}
            </CodeBlock>
          </div>

          {/* Badges de Âmbito */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Badges de Âmbito (scopeColors)</h3>
            <div className="flex flex-wrap gap-3">
              <Badge className={scopeColors[1].badge}>Âmbito 1</Badge>
              <Badge className={scopeColors[2].badge}>Âmbito 2</Badge>
              <Badge className={scopeColors[3].badge}>Âmbito 3</Badge>
            </div>
            <CodeBlock>
              {`import { scopeColors } from "@/lib/styles";
<Badge className={scopeColors[1].badge}>Âmbito 1</Badge>`}
            </CodeBlock>
          </div>
        </div>

        {/* === SECÇÃO: CARDS === */}
        <SectionHeader 
          id="cards" 
          title="Cards" 
          description="Estilos de contentor"
        />

        <div className="space-y-8">
          {/* Estilos de Card */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Estilos (cardStyles)</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className={cardStyles.kpi}>
                <p className="font-medium">Card KPI</p>
                <p className="text-xs text-muted-foreground mt-1">cardStyles.kpi</p>
                <p className="font-mono text-xs text-muted-foreground/70">{cardStyles.kpi}</p>
              </Card>
              <Card className={cardStyles.section}>
                <p className="font-medium">Card Secção</p>
                <p className="text-xs text-muted-foreground mt-1">cardStyles.section</p>
                <p className="font-mono text-xs text-muted-foreground/70">{cardStyles.section}</p>
              </Card>
              <Card className={cardStyles.nested}>
                <p className="font-medium">Card Nested</p>
                <p className="text-xs text-muted-foreground mt-1">cardStyles.nested</p>
                <p className="font-mono text-xs text-muted-foreground/70">{cardStyles.nested}</p>
              </Card>
              <Card className={`${cardStyles.kpi} ${cardStyles.clickable}`}>
                <p className="font-medium">Card Clicável</p>
                <p className="text-xs text-muted-foreground mt-1">cardStyles.clickable</p>
                <p className="font-mono text-xs text-muted-foreground/70">{cardStyles.clickable}</p>
              </Card>
              <Card className={`${cardStyles.kpi} ${cardStyles.selected}`}>
                <p className="font-medium">Card Seleccionado</p>
                <p className="text-xs text-muted-foreground mt-1">cardStyles.selected</p>
                <p className="font-mono text-xs text-muted-foreground/70">{cardStyles.selected}</p>
              </Card>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: INPUTS === */}
        <SectionHeader 
          id="inputs" 
          title="Inputs" 
          description="Campos de entrada de dados"
        />

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="input-example">Input</Label>
              <Input id="input-example" placeholder="Escreva aqui..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-disabled">Input Disabled</Label>
              <Input id="input-disabled" placeholder="Desactivado" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textarea-example">Textarea</Label>
              <Textarea id="textarea-example" placeholder="Texto longo..." />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="checkbox" />
                <Label htmlFor="checkbox">Checkbox com label</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="switch" />
                <Label htmlFor="switch">Switch com label</Label>
              </div>
            </div>
          </div>
        </div>

        {/* === SECÇÃO: SELECT === */}
        <SectionHeader 
          id="select" 
          title="Select" 
          description="Seletores dropdown"
        />

        <div className="space-y-4">
          <Select>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Seleccione uma opção..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="opt1">Opção 1</SelectItem>
              <SelectItem value="opt2">Opção 2</SelectItem>
              <SelectItem value="opt3">Opção 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* === SECÇÃO: KPI CARDS === */}
        <SectionHeader 
          id="kpi-cards" 
          title="KPI Cards" 
          description="Cards de métricas padronizados"
        />

        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Emissões Totais"
              value="15.749"
              unit="t CO₂e"
              icon={Factory}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <KPICard
              title="Intensidade"
              value="0,45"
              unit="kg CO₂e/€"
              icon={Zap}
              iconColor="text-warning"
              iconBgColor="bg-warning/10"
            />
            <KPICard
              title="Redução Possível"
              value="-30%"
              icon={TrendingDown}
              iconColor="text-success"
              iconBgColor="bg-success/10"
              valueColor="text-success"
            />
            <KPICard
              title="Empresas"
              value="42"
              inlineSubtitle="monitorizadas"
              icon={Building2}
            />
          </div>
          <CodeBlock>
            {`import { KPICard } from "@/components/ui/kpi-card";

<KPICard
  title="Emissões Totais"
  value="15.749"
  unit="t CO₂e"
  icon={Factory}
  iconColor="text-primary"
  iconBgColor="bg-primary/10"
/>`}
          </CodeBlock>
        </div>

        {/* === SECÇÃO: ALERTS === */}
        <SectionHeader 
          id="alerts" 
          title="Alerts" 
          description="Mensagens de feedback"
        />

        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>Mensagem informativa neutra.</AlertDescription>
          </Alert>
          <Alert className="border-success/30 bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">Sucesso</AlertTitle>
            <AlertDescription>Operação concluída com êxito.</AlertDescription>
          </Alert>
          <Alert className="border-warning/30 bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Atenção</AlertTitle>
            <AlertDescription>Verifique os dados antes de continuar.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>Ocorreu um problema.</AlertDescription>
          </Alert>
        </div>

        {/* === SECÇÃO: PROGRESS === */}
        <SectionHeader 
          id="progress" 
          title="Progress" 
          description="Indicadores de progresso"
        />

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>25%</span>
            </div>
            <Progress value={25} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>50%</span>
            </div>
            <Progress value={50} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>75%</span>
            </div>
            <Progress value={75} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>100%</span>
            </div>
            <Progress value={100} />
          </div>
        </div>

        {/* === SECÇÃO: TABS === */}
        <SectionHeader 
          id="tabs" 
          title="Tabs" 
          description="Navegação por separadores"
        />

        <div>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="p-4 border rounded-lg mt-2">
              Conteúdo do Tab 1
            </TabsContent>
            <TabsContent value="tab2" className="p-4 border rounded-lg mt-2">
              Conteúdo do Tab 2
            </TabsContent>
            <TabsContent value="tab3" className="p-4 border rounded-lg mt-2">
              Conteúdo do Tab 3
            </TabsContent>
          </Tabs>
        </div>

        {/* === SECÇÃO: TABELAS === */}
        <SectionHeader 
          id="tabelas" 
          title="Tabelas" 
          description="Apresentação de dados tabulares"
        />

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Emissões</TableHead>
                <TableHead>Risco</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Empresa A</TableCell>
                <TableCell>Indústria</TableCell>
                <TableCell className="text-right">1.234 t CO₂e</TableCell>
                <TableCell><Badge className={riskColors.alto.badge}>Alto</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Empresa B</TableCell>
                <TableCell>Serviços</TableCell>
                <TableCell className="text-right">456 t CO₂e</TableCell>
                <TableCell><Badge className={riskColors.medio.badge}>Médio</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Empresa C</TableCell>
                <TableCell>Comércio</TableCell>
                <TableCell className="text-right">89 t CO₂e</TableCell>
                <TableCell><Badge className={riskColors.baixo.badge}>Baixo</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* === SECÇÃO: GRÁFICOS === */}
        <SectionHeader 
          id="graficos" 
          title="Gráficos" 
          description="Visualizações de dados com Recharts"
        />

        <div className="grid grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="p-4">
            <h4 className="font-semibold mb-4">Bar Chart</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pie Chart */}
          <Card className="p-4">
            <h4 className="font-semibold mb-4">Pie Chart (Âmbitos)</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={scopeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {scopeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {scopeChartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.fill }} />
                  <span className="text-xs">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* === SECÇÃO: ÍCONES === */}
        <SectionHeader 
          id="icones" 
          title="Ícones" 
          description="Biblioteca de ícones Lucide React"
        />

        <div className="space-y-8">
          {/* Grid de Ícones */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ícones Mais Usados</h3>
            <div className="grid grid-cols-6 gap-4">
              {commonIcons.map(({ icon: Icon, name }) => (
                <div key={name} className="flex flex-col items-center gap-2 p-3 border rounded-lg">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tamanhos de Ícone */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tamanhos (iconSizes)</h3>
            <div className="flex items-end gap-6">
              {Object.entries(iconSizes).map(([size, classes]) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <Factory className={classes} />
                  <span className="text-xs text-muted-foreground">{size}</span>
                  <span className="font-mono text-xs text-muted-foreground/70">{classes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === SECÇÃO: FORMATAÇÃO === */}
        <SectionHeader 
          id="formatacao" 
          title="Formatação de Dados" 
          description="Funções de formatação em lib/formatters.ts"
        />

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Função</TableHead>
                <TableHead>Input</TableHead>
                <TableHead>Output</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-sm">formatNumber(1234.5, 0)</TableCell>
                <TableCell>1234.5</TableCell>
                <TableCell className="font-medium">{formatNumber(1234.5, 0)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">formatNumber(1234.5, 2)</TableCell>
                <TableCell>1234.5</TableCell>
                <TableCell className="font-medium">{formatNumber(1234.5, 2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">formatEmissions(1500)</TableCell>
                <TableCell>1500</TableCell>
                <TableCell className="font-medium">{formatEmissions(1500)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">formatPercentage(75.5)</TableCell>
                <TableCell>75.5</TableCell>
                <TableCell className="font-medium">{formatPercentage(75.5)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">formatIntensity(0.45)</TableCell>
                <TableCell>0.45</TableCell>
                <TableCell className="font-medium">{formatIntensity(0.45)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">formatCurrency(1500)</TableCell>
                <TableCell>1500</TableCell>
                <TableCell className="font-medium">{formatCurrency(1500)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">formatRevenue(2.5)</TableCell>
                <TableCell>2.5</TableCell>
                <TableCell className="font-medium">{formatRevenue(2.5)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* === SECÇÃO: ANTI-PADRÕES === */}
        <SectionHeader 
          id="anti-padroes" 
          title="Anti-padrões" 
          description="O que NÃO fazer vs o que fazer"
        />

        <div className="space-y-6">
          {/* Cores */}
          <Card className="p-4">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Cores
            </h4>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex gap-4">
                <span className="text-danger w-48">❌ text-green-600</span>
                <span className="text-success">✅ text-success</span>
              </div>
              <div className="flex gap-4">
                <span className="text-danger w-48">❌ bg-red-100</span>
                <span className="text-success">✅ bg-danger/10</span>
              </div>
              <div className="flex gap-4">
                <span className="text-danger w-48">❌ text-blue-500</span>
                <span className="text-success">✅ text-primary</span>
              </div>
              <div className="flex gap-4">
                <span className="text-danger w-48">❌ bg-yellow-50</span>
                <span className="text-success">✅ bg-warning/10</span>
              </div>
            </div>
          </Card>

          {/* Formatação */}
          <Card className="p-4">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Formatação
            </h4>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex gap-4">
                <span className="text-danger w-64">❌ value.toFixed(2)</span>
                <span className="text-success">✅ formatNumber(value, 2)</span>
              </div>
              <div className="flex gap-4">
                <span className="text-danger w-64">❌ value.toLocaleString()</span>
                <span className="text-success">✅ formatEmissions(value)</span>
              </div>
              <div className="flex gap-4">
                <span className="text-danger w-64">❌ `${'{'}value{'}'}%`</span>
                <span className="text-success">✅ formatPercentage(value)</span>
              </div>
            </div>
          </Card>

          {/* Componentes */}
          <Card className="p-4">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Componentes
            </h4>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex gap-4">
                <span className="text-danger w-64">❌ &lt;div className="..."&gt;</span>
                <span className="text-success">✅ &lt;Card className={'{'}cardStyles.kpi{'}'}&gt;</span>
              </div>
              <div className="flex gap-4">
                <span className="text-danger w-64">❌ criar input custom</span>
                <span className="text-success">✅ &lt;Input /&gt; de shadcn/ui</span>
              </div>
              <div className="flex gap-4">
                <span className="text-danger w-64">❌ badge custom</span>
                <span className="text-success">✅ &lt;Badge className={'{'}riskColors.alto.badge{'}'}&gt;</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>Dash2Zero Design System v1.0 · Janeiro 2026</p>
          <p className="mt-1">Desenvolvido com React, TypeScript, Tailwind CSS e shadcn/ui</p>
        </div>
      </main>
    </div>
  );
};

export default StyleGuide;
