import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2 } from "lucide-react";

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
  const [subject, setSubject] = useState(
    "Convite para calcular a sua pegada de carbono"
  );
  const [message, setMessage] = useState(
    `Prezado parceiro,

Gostaríamos de convidá-lo a calcular a pegada de carbono da sua organização através da plataforma Get2Zero.

O cálculo da pegada de carbono é fundamental para:
• Identificar oportunidades de redução de emissões
• Cumprir requisitos regulamentares
• Demonstrar compromisso com a sustentabilidade

Para começar, aceda à plataforma através do link abaixo e siga as instruções.

Estamos disponíveis para qualquer esclarecimento.

Com os melhores cumprimentos,
Equipa de Sustentabilidade`
  );

  const handleSend = async () => {
    setIsLoading(true);
    
    // Simular envio (delay de 1.5s)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onOpenChange(false);
    
    toast({
      title: "Convites enviados com sucesso!",
      description: `${companiesMissing} emails foram enviados para incentivar o cálculo de pegadas.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Incentivar cálculo de pegadas
          </DialogTitle>
          <DialogDescription>
            Enviar email de convite a {companiesMissing} empresas que ainda não
            calcularam a sua pegada de carbono.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto do email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Corpo do email"
              className="min-h-[200px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                A enviar...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar para {companiesMissing} empresas
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
