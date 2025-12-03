import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2, ChevronDown, ChevronRight, History, Building2 } from "lucide-react";
import { mockMissingCompanies, emailTemplates, MissingCompany, EmailRecord } from "@/data/mockMissingCompanies";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface IncentiveEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companiesMissing: number;
}

export const IncentiveEmailDialog = ({
  open,
  onOpenChange,
  companiesMissing,
}: IncentiveEmailDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("t1");
  const [subject, setSubject] = useState(emailTemplates[0].subject);
  const [message, setMessage] = useState(emailTemplates[0].body);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  const companies = useMemo(() => {
    return mockMissingCompanies.slice(0, companiesMissing);
  }, [companiesMissing]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setMessage(template.body);
    }
  };

  const handleSelectAll = () => {
    if (selectedCompanies.length === companies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(companies.map(c => c.id));
    }
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const toggleExpandCompany = (companyId: string) => {
    setExpandedCompany(prev => prev === companyId ? null : companyId);
  };

  const getEmailCountColor = (count: number) => {
    if (count === 0) return "bg-slate-100 text-slate-600";
    if (count === 1) return "bg-blue-100 text-blue-700";
    if (count === 2) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const handleSend = async () => {
    if (selectedCompanies.length === 0) {
      toast({
        title: "Nenhuma empresa selecionada",
        description: "Selecione pelo menos uma empresa para enviar o convite.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onOpenChange(false);
    setSelectedCompanies([]);
    
    toast({
      title: "Convites enviados com sucesso!",
      description: `${selectedCompanies.length} email(s) enviado(s) para incentivar o cálculo de pegadas.`,
    });
  };

  const formatEmailDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: pt });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Incentivar cálculo de pegadas
          </DialogTitle>
          <DialogDescription>
            Selecione as empresas e o template de mensagem para enviar convites.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Lista de Empresas */}
          <div className="flex flex-col border rounded-lg overflow-hidden">
            <div className="p-3 bg-muted/50 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Empresas ({companies.length})</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs h-7">
                {selectedCompanies.length === companies.length ? "Desmarcar todas" : "Selecionar todas"}
              </Button>
            </div>
            <ScrollArea className="flex-1 h-[280px]">
              <div className="p-2 space-y-1">
                {companies.map((company) => (
                  <Collapsible key={company.id} open={expandedCompany === company.id}>
                    <div className="rounded-md border bg-card hover:bg-accent/5 transition-colors">
                      <div className="flex items-center gap-2 p-2">
                        <Checkbox
                          checked={selectedCompanies.includes(company.id)}
                          onCheckedChange={() => handleSelectCompany(company.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{company.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{company.contactPerson}</p>
                        </div>
                        <Badge className={`text-xs ${getEmailCountColor(company.emailsSent)}`}>
                          {company.emailsSent} email{company.emailsSent !== 1 ? "s" : ""}
                        </Badge>
                        {company.emailHistory.length > 0 && (
                          <CollapsibleTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0"
                              onClick={() => toggleExpandCompany(company.id)}
                            >
                              {expandedCompany === company.id ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        )}
                      </div>
                      <CollapsibleContent>
                        <div className="px-2 pb-2 pt-1 border-t bg-muted/30">
                          <div className="flex items-center gap-1 mb-2">
                            <History className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">Histórico de emails</span>
                          </div>
                          <div className="space-y-2">
                            {company.emailHistory.map((email) => (
                              <div key={email.id} className="bg-background rounded p-2 text-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <Badge variant="outline" className="text-[10px] h-5">{email.templateUsed}</Badge>
                                  <span className="text-muted-foreground text-[10px]">
                                    {formatEmailDate(email.sentAt)}
                                  </span>
                                </div>
                                <p className="font-medium text-xs mb-1">{email.subject}</p>
                                <p className="text-muted-foreground line-clamp-2">{email.preview}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
            <div className="p-2 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                {selectedCompanies.length} de {companies.length} selecionada(s)
              </p>
            </div>
          </div>

          {/* Composição do Email */}
          <div className="flex flex-col gap-3">
            <div className="grid gap-2">
              <Label htmlFor="template" className="text-xs">Template de mensagem</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col">
                        <span>{template.name}</span>
                        <span className="text-xs text-muted-foreground">{template.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject" className="text-xs">Assunto</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Assunto do email"
              />
            </div>
            <div className="grid gap-2 flex-1">
              <Label htmlFor="message" className="text-xs">Mensagem</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Corpo do email"
                className="min-h-[200px] flex-1 resize-none"
              />
              <p className="text-[10px] text-muted-foreground">
                Variáveis disponíveis: {"{contactPerson}"}, {"{companyName}"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={isLoading || selectedCompanies.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                A enviar...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar para {selectedCompanies.length} empresa{selectedCompanies.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
