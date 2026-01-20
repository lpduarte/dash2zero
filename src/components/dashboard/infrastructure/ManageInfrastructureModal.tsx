import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Zap,
  Recycle,
  Bike,
  Leaf,
  Route,
  Bus,
  Wind,
  Settings,
  Link,
  PenLine,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { elements } from '@/lib/styles';

// Keys for each infrastructure type
export type InfrastructureKey =
  | 'chargingStations'
  | 'ecoPoints'
  | 'bikeStations'
  | 'organicBins'
  | 'cycleways'
  | 'publicTransport'
  | 'airQuality';

export type InfrastructureVisibility = Record<InfrastructureKey, boolean>;

const STORAGE_KEY = 'dash2zero-infrastructure-visibility';

// Default: all visible
const defaultVisibility: InfrastructureVisibility = {
  chargingStations: true,
  ecoPoints: true,
  bikeStations: true,
  organicBins: true,
  cycleways: true,
  publicTransport: true,
  airQuality: true,
};

export const getInfrastructureVisibility = (): InfrastructureVisibility => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultVisibility, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultVisibility;
};

const saveVisibility = (visibility: InfrastructureVisibility) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
};

interface ManageInfrastructureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVisibilityChange?: (visibility: InfrastructureVisibility) => void;
}

export const ManageInfrastructureModal = ({
  open,
  onOpenChange,
  onVisibilityChange,
}: ManageInfrastructureModalProps) => {
  // Visibility state
  const [visibility, setVisibility] = useState<InfrastructureVisibility>(getInfrastructureVisibility);

  // Estados dos inputs manuais
  const [ecopontosCount, setEcopontosCount] = useState('245');
  const [organicosCount, setOrganicosCount] = useState('178');
  const [cicloviasKm, setCicloviasKm] = useState('47.3');
  const [transportesCount, setTransportesCount] = useState('312');
  const [bicicletasCount, setBicicletasCount] = useState('52');

  // Fonte seleccionada para bicicletas
  const [bicicletasSource, setBicicletasSource] = useState('gira');

  const toggleVisibility = (key: InfrastructureKey) => {
    const newVisibility = { ...visibility, [key]: !visibility[key] };
    setVisibility(newVisibility);
    saveVisibility(newVisibility);
    onVisibilityChange?.(newVisibility);
  };

  const handleRefreshData = (type: string) => {
    toast.success(`Dados de ${type} actualizados com sucesso`);
  };

  const handleSaveData = (type: string) => {
    toast.success(`${type} guardado com sucesso`);
  };

  const VisibilityToggle = ({
    infraKey,
    label
  }: {
    infraKey: InfrastructureKey;
    label: string;
  }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50">
      <Switch
        checked={visibility[infraKey]}
        onCheckedChange={() => toggleVisibility(infraKey)}
        className="scale-75"
      />
      <span className="text-xs text-muted-foreground">
        {visibility[infraKey] ? 'Visível' : 'Oculto'}
      </span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5" />
            Gerir Infraestruturas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">

          {/* Texto introdutório */}
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-primary">
              Estes dados influenciam as medidas de descarbonização disponíveis para as empresas do concelho.
              Infraestruturas existentes permitem recomendar medidas mais eficazes e de menor investimento.
            </p>
            <p className="text-sm text-primary mt-2">
              <Eye className="h-4 w-4 inline mr-1" />
              Use o interruptor em cada secção para mostrar ou ocultar KPIs que não se aplicam ao seu município.
            </p>
          </div>

          {/* Lista de infraestruturas */}
          <div className="space-y-4">

            {/* POSTOS DE CARREGAMENTO - API */}
            <div className={`border rounded-lg overflow-hidden transition-opacity ${!visibility.chargingStations ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-normal">Postos de Carregamento</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">89</span>
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <VisibilityToggle infraKey="chargingStations" label="Postos" />
                </div>
              </div>
              {visibility.chargingStations && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-primary" />
                      <span className="text-sm">Fonte: API MOBI.E</span>
                      <span className="text-xs px-2 py-0.5 bg-success/20 text-success rounded-full">Recomendada</span>
                    </div>
                    <button
                      onClick={() => handleRefreshData('postos')}
                      className={elements.outlineButtonSm}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Actualizar
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Última actualização: 06/01/2026 · Actualização automática semanal
                  </p>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      A existência de postos de carregamento permite recomendar a transição para frotas eléctricas
                      com menor investimento em infraestrutura própria.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ECOPONTOS - Manual */}
            <div className={`border rounded-lg overflow-hidden transition-opacity ${!visibility.ecoPoints ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Recycle className="h-5 w-5 text-primary" />
                  <span className="font-normal">Ecopontos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">245</span>
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <VisibilityToggle infraKey="ecoPoints" label="Ecopontos" />
                </div>
              </div>
              {visibility.ecoPoints && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-warning" />
                      <span className="text-sm">Fonte: Inserção manual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={ecopontosCount}
                        onChange={(e) => setEcopontosCount(e.target.value)}
                        className={elements.inputSmall}
                      />
                      <button
                        onClick={() => handleSaveData('Ecopontos')}
                        className={elements.primaryButtonSm}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      Ecopontos próximos facilitam a implementação de programas de separação de resíduos
                      nas empresas, reduzindo emissões do Âmbito 3.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ESTAÇÕES DE BICICLETAS - API com escolha */}
            <div className={`border rounded-lg overflow-hidden transition-opacity ${!visibility.bikeStations ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Bike className="h-5 w-5 text-primary" />
                  <span className="font-normal">Estações de Bicicletas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">52</span>
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <VisibilityToggle infraKey="bikeStations" label="Bicicletas" />
                </div>
              </div>
              {visibility.bikeStations && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-primary" />
                      <span className="text-sm">Fonte:</span>
                      <Select value={bicicletasSource} onValueChange={setBicicletasSource}>
                        <SelectTrigger className="w-40 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gira">API GIRA (Lisboa)</SelectItem>
                          <SelectItem value="manual">Inserção manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {bicicletasSource === 'gira' ? (
                      <button
                        onClick={() => handleRefreshData('bicicletas')}
                        className={elements.outlineButtonSm}
                      >
                        <RefreshCw className="h-4 w-4" />
                        Actualizar
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={bicicletasCount}
                          onChange={(e) => setBicicletasCount(e.target.value)}
                          className={elements.inputSmall}
                        />
                        <button
                          onClick={() => handleSaveData('Estações de bicicletas')}
                          className={elements.primaryButtonSm}
                        >
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>
                  {bicicletasSource === 'gira' && (
                    <p className="text-xs text-muted-foreground">
                      Última actualização: 06/01/2026 · Actualização automática semanal
                    </p>
                  )}
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      Bicicletas partilhadas são alternativa para deslocações de curta distância,
                      reduzindo emissões de mobilidade (Âmbito 1 e 3).
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CONTENTORES ORGÂNICOS - Manual */}
            <div className={`border rounded-lg overflow-hidden transition-opacity ${!visibility.organicBins ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-primary" />
                  <span className="font-normal">Contentores Orgânicos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">178</span>
                    {organicosCount ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-warning" />
                    )}
                  </div>
                  <VisibilityToggle infraKey="organicBins" label="Orgânicos" />
                </div>
              </div>
              {visibility.organicBins && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-warning" />
                      <span className="text-sm">Fonte: Inserção manual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={organicosCount}
                        onChange={(e) => setOrganicosCount(e.target.value)}
                        className={elements.inputSmall}
                      />
                      <button
                        onClick={() => handleSaveData('Contentores orgânicos')}
                        className={elements.primaryButtonSm}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      Recolha selectiva de orgânicos permite compostagem e reduz emissões de metano em aterro.
                      Essencial para empresas de restauração e retalho.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CICLOVIAS - Manual */}
            <div className={`border rounded-lg overflow-hidden transition-opacity ${!visibility.cycleways ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Route className="h-5 w-5 text-primary" />
                  <span className="font-normal">Ciclovias</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">47.3</span>
                    <span className="text-sm text-muted-foreground">km</span>
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <VisibilityToggle infraKey="cycleways" label="Ciclovias" />
                </div>
              </div>
              {visibility.cycleways && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-warning" />
                      <span className="text-sm">Fonte: Inserção manual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={cicloviasKm}
                        onChange={(e) => setCicloviasKm(e.target.value)}
                        className={elements.inputSmall}
                      />
                      <span className="text-sm text-muted-foreground">km</span>
                      <button
                        onClick={() => handleSaveData('Ciclovias')}
                        className={elements.primaryButtonSm}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      Rede ciclável extensa incentiva deslocações em bicicleta para colaboradores,
                      reduzindo emissões de mobilidade casa-trabalho.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* TRANSPORTES PÚBLICOS - Manual */}
            <div className={`border rounded-lg overflow-hidden transition-opacity ${!visibility.publicTransport ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Bus className="h-5 w-5 text-primary" />
                  <span className="font-normal">Paragens Transportes Públicos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">312</span>
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <VisibilityToggle infraKey="publicTransport" label="Transportes" />
                </div>
              </div>
              {visibility.publicTransport && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-warning" />
                      <span className="text-sm">Fonte: Inserção manual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={transportesCount}
                        onChange={(e) => setTransportesCount(e.target.value)}
                        className={elements.inputSmall}
                      />
                      <button
                        onClick={() => handleSaveData('Paragens de transportes')}
                        className={elements.primaryButtonSm}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      Boa cobertura de transportes públicos facilita programas de mobilidade sustentável
                      e reduz necessidade de estacionamento nas empresas.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* QUALIDADE DO AR - API */}
            <div className={`border rounded-lg overflow-hidden transition-opacity ${!visibility.airQuality ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Wind className="h-5 w-5 text-primary" />
                  <span className="font-normal">Qualidade do Ar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-success">Bom</span>
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <VisibilityToggle infraKey="airQuality" label="Qualidade do Ar" />
                </div>
              </div>
              {visibility.airQuality && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-primary" />
                      <span className="text-sm">Fonte: API QualAr (APA)</span>
                      <span className="text-xs px-2 py-0.5 bg-success/20 text-success rounded-full">Recomendada</span>
                    </div>
                    <button
                      onClick={() => handleRefreshData('qualidade do ar')}
                      className={elements.outlineButtonSm}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Actualizar
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Última actualização: 09/01/2026 · Actualização automática semanal · 3 estações de monitorização
                  </p>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Info className="h-4 w-4 inline mr-1" />
                      Dados de qualidade do ar permitem sensibilizar empresas para o impacto local das emissões
                      e priorizar medidas em zonas mais afetadas.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className={elements.primaryButton}
          >
            Fechar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
