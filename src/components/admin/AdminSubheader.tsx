import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ArrowLeft,
  Building2,
  MapPin,
  Search,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { Client } from '@/types/user';

// Componente wrapper que faz early return se condições não forem cumpridas
export const AdminSubheader = () => {
  const { isGet2C, activeClient } = useUser();

  // Early return ANTES de qualquer hook condicional
  if (!isGet2C || !activeClient) {
    return null;
  }

  // Renderizar componente interno apenas quando temos cliente garantido
  return <AdminSubheaderContent client={activeClient} />;
};

// Componente interno com toda a lógica - client está garantidamente definido
interface AdminSubheaderContentProps {
  client: Client;
}

const AdminSubheaderContent = ({ client }: AdminSubheaderContentProps) => {
  const navigate = useNavigate();
  const { setActiveClient, clients } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar clientes para o dropdown
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.contactEmail.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  // Trocar de cliente
  const handleSelectClient = (selectedClient: Client) => {
    setActiveClient(selectedClient);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Voltar ao admin
  const handleBackToAdmin = () => {
    setActiveClient(null);
    navigate('/admin');
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-40",
        "border-b border-border/50",
        // Efeito frost - consistente com liquid glass do header
        "bg-background/80 backdrop-blur-xl",
        "supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center justify-between h-12">
          {/* Lado esquerdo: Cliente ativo + switcher */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">A ver como:</span>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-8 gap-2 px-3",
                    "bg-primary/5 hover:bg-primary/10",
                    "border border-primary/20"
                  )}
                >
                  {client.type === 'municipio'
                    ? <MapPin className="h-4 w-4 text-primary" />
                    : <Building2 className="h-4 w-4 text-primary" />
                  }
                  <span className="font-bold max-w-[200px] truncate">
                    {client.name}
                  </span>
                  <Badge variant="outline" className="text-xs ml-1">
                    {client.type === 'municipio' ? 'Município' : 'Empresa'}
                  </Badge>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-80 p-0"
                align="start"
                sideOffset={8}
              >
                {/* Pesquisa */}
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar cliente..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Lista de clientes */}
                <ScrollArea className="max-h-[300px]">
                  <div className="p-2">
                    {filteredClients.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum cliente encontrado
                      </p>
                    ) : (
                      filteredClients.map(c => (
                        <button
                          key={c.id}
                          onClick={() => handleSelectClient(c)}
                          className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-md text-left",
                            "hover:bg-muted transition-colors",
                            c.id === client.id && "bg-primary/5"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                            c.type === 'municipio' ? "bg-primary/10" : "bg-muted"
                          )}>
                            {c.type === 'municipio'
                              ? <MapPin className="h-4 w-4 text-primary" />
                              : <Building2 className="h-4 w-4 text-muted-foreground" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{c.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {c.metrics.totalCompanies} empresas · {c.metrics.totalClusters} clusters
                            </p>
                          </div>
                          {c.id === client.id && (
                            <Check className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Footer com link para admin */}
                <div className="p-2 border-t bg-muted/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                    onClick={handleBackToAdmin}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Ver todos os clientes
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Lado direito: Botão voltar */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleBackToAdmin}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à administração
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSubheader;
