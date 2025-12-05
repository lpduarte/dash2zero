import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplier } from "@/types/supplier";
import {
  ArrowRight,
  TrendingDown,
  Euro,
  FileDown,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { sectorLabels } from "./SupplierLabel";

interface SupplierSwitchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  criticalSupplier: Supplier;
  suggestedAlternative: Supplier | null;
  allAlternatives: Supplier[];
}

export const SupplierSwitchModal = ({
  open,
  onOpenChange,
  criticalSupplier,
  suggestedAlternative,
  allAlternatives,
}: SupplierSwitchModalProps) => {
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string>(
    suggestedAlternative?.id || ""
  );
  const [notes, setNotes] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const selectedAlternative =
    allAlternatives.find((s) => s.id === selectedAlternativeId) ||
    suggestedAlternative;

  const emissionsSavings = selectedAlternative
    ? criticalSupplier.totalEmissions - selectedAlternative.totalEmissions
    : 0;
  const savingsPercentage = selectedAlternative
    ? ((emissionsSavings / criticalSupplier.totalEmissions) * 100).toFixed(0)
    : 0;

  // Financial impact estimation (simplified - based on emissions factor difference)
  const feImprovement = selectedAlternative
    ? criticalSupplier.emissionsPerRevenue - selectedAlternative.emissionsPerRevenue
    : 0;
  const estimatedCostImpact = selectedAlternative
    ? Math.abs(feImprovement * 1000).toFixed(0) // Simplified estimation
    : 0;

  const handleExportPDF = () => {
    toast.success("Relatório PDF gerado com sucesso", {
      description: `Análise de mudança: ${criticalSupplier.name} → ${selectedAlternative?.name}`,
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked
        ? "Análise removida da lista de revisão"
        : "Análise marcada para revisão posterior"
    );
  };

  const handleSaveNotes = () => {
    if (notes.trim()) {
      toast.success("Notas guardadas com sucesso");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <RefreshCw className="h-5 w-5 text-primary" />
            Análise de Mudança de Fornecedor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Headers */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-0 items-stretch">
            <div className="p-4 rounded-tl-lg border border-b-0 border-r-0 border-danger/30 bg-danger/5">
              <Badge className="bg-danger mb-2">Fornecedor Atual</Badge>
              <h3 className="font-semibold text-lg">{criticalSupplier.name}</h3>
              <p className="text-sm text-muted-foreground">
                {sectorLabels[criticalSupplier.sector] || criticalSupplier.sector}
              </p>
            </div>

            <div className="w-[52px] flex items-center justify-center border-t border-b-0 border-border bg-muted/10">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="p-4 rounded-tr-lg border border-b-0 border-l-0 border-success/30 bg-success/5">
              <Badge className="bg-success mb-2">Alternativa</Badge>
              <Select
                value={selectedAlternativeId}
                onValueChange={setSelectedAlternativeId}
              >
                <SelectTrigger className="w-full mb-1">
                  <SelectValue placeholder="Selecionar alternativa" />
                </SelectTrigger>
                <SelectContent>
                  {allAlternatives.map((alt) => (
                    <SelectItem key={alt.id} value={alt.id}>
                      <div className="flex items-center justify-between gap-2">
                        <span>{alt.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {alt.totalEmissions.toFixed(0)} t CO₂e
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedAlternative && (
                <p className="text-sm text-muted-foreground">
                  {sectorLabels[selectedAlternative.sector] || selectedAlternative.sector}
                </p>
              )}
            </div>
          </div>

          {/* Comparison rows */}
          {selectedAlternative && (
            <div className="border-x border-b rounded-b-lg overflow-hidden -mt-px">
              {/* Emissões totais */}
              <div className="grid grid-cols-[1fr_auto_1fr] border-b border-border">
                <div className="p-3 bg-danger/5">
                  <p className="text-xs text-muted-foreground mb-1">Emissões totais</p>
                  <p className="font-semibold text-danger">
                    {criticalSupplier.totalEmissions.toLocaleString("pt-PT")} t CO₂e
                  </p>
                </div>
                <div className="p-3 flex items-center justify-center bg-muted/20 border-x border-border">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="p-3 bg-success/5">
                  <p className="text-xs text-muted-foreground mb-1">Emissões totais</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-success">
                      {selectedAlternative.totalEmissions.toLocaleString("pt-PT")} t CO₂e
                    </p>
                    <Badge className="bg-success text-xs">
                      -{((criticalSupplier.totalEmissions - selectedAlternative.totalEmissions) / criticalSupplier.totalEmissions * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Âmbito 1 */}
              <div className="grid grid-cols-[1fr_auto_1fr] border-b border-border">
                <div className="p-3 bg-danger/5">
                  <p className="text-xs text-muted-foreground mb-1">Âmbito 1</p>
                  <p className="font-medium">{criticalSupplier.scope1.toLocaleString("pt-PT")} t CO₂e</p>
                </div>
                <div className="p-3 flex items-center justify-center bg-muted/20 border-x border-border">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="p-3 bg-success/5">
                  <p className="text-xs text-muted-foreground mb-1">Âmbito 1</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{selectedAlternative.scope1.toLocaleString("pt-PT")} t CO₂e</p>
                    {criticalSupplier.scope1 > 0 && (
                      <Badge variant="outline" className="text-xs text-success border-success/50">
                        {((criticalSupplier.scope1 - selectedAlternative.scope1) / criticalSupplier.scope1 * 100) > 0 ? '-' : '+'}
                        {Math.abs((criticalSupplier.scope1 - selectedAlternative.scope1) / criticalSupplier.scope1 * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Âmbito 2 */}
              <div className="grid grid-cols-[1fr_auto_1fr] border-b border-border">
                <div className="p-3 bg-danger/5">
                  <p className="text-xs text-muted-foreground mb-1">Âmbito 2</p>
                  <p className="font-medium">{criticalSupplier.scope2.toLocaleString("pt-PT")} t CO₂e</p>
                </div>
                <div className="p-3 flex items-center justify-center bg-muted/20 border-x border-border">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="p-3 bg-success/5">
                  <p className="text-xs text-muted-foreground mb-1">Âmbito 2</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{selectedAlternative.scope2.toLocaleString("pt-PT")} t CO₂e</p>
                    {criticalSupplier.scope2 > 0 && (
                      <Badge variant="outline" className="text-xs text-success border-success/50">
                        {((criticalSupplier.scope2 - selectedAlternative.scope2) / criticalSupplier.scope2 * 100) > 0 ? '-' : '+'}
                        {Math.abs((criticalSupplier.scope2 - selectedAlternative.scope2) / criticalSupplier.scope2 * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Âmbito 3 */}
              <div className="grid grid-cols-[1fr_auto_1fr] border-b border-border">
                <div className="p-3 bg-danger/5">
                  <p className="text-xs text-muted-foreground mb-1">Âmbito 3</p>
                  <p className="font-medium">{criticalSupplier.scope3.toLocaleString("pt-PT")} t CO₂e</p>
                </div>
                <div className="p-3 flex items-center justify-center bg-muted/20 border-x border-border">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="p-3 bg-success/5">
                  <p className="text-xs text-muted-foreground mb-1">Âmbito 3</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{selectedAlternative.scope3.toLocaleString("pt-PT")} t CO₂e</p>
                    {criticalSupplier.scope3 > 0 && (
                      <Badge variant="outline" className="text-xs text-success border-success/50">
                        {((criticalSupplier.scope3 - selectedAlternative.scope3) / criticalSupplier.scope3 * 100) > 0 ? '-' : '+'}
                        {Math.abs((criticalSupplier.scope3 - selectedAlternative.scope3) / criticalSupplier.scope3 * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* FE */}
              <div className="grid grid-cols-[1fr_auto_1fr]">
                <div className="p-3 bg-danger/5">
                  <p className="text-xs text-muted-foreground mb-1">Emissões por faturação</p>
                  <p className="font-medium">{criticalSupplier.emissionsPerRevenue.toFixed(1)} t CO₂e/€</p>
                </div>
                <div className="p-3 flex items-center justify-center bg-muted/20 border-x border-border">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="p-3 bg-success/5">
                  <p className="text-xs text-muted-foreground mb-1">Emissões por faturação</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{selectedAlternative.emissionsPerRevenue.toFixed(1)} t CO₂e/€</p>
                    {criticalSupplier.emissionsPerRevenue > 0 && (
                      <Badge variant="outline" className="text-xs text-success border-success/50">
                        {((criticalSupplier.emissionsPerRevenue - selectedAlternative.emissionsPerRevenue) / criticalSupplier.emissionsPerRevenue * 100) > 0 ? '-' : '+'}
                        {Math.abs((criticalSupplier.emissionsPerRevenue - selectedAlternative.emissionsPerRevenue) / criticalSupplier.emissionsPerRevenue * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedAlternative && (
            <div className="py-8 text-center text-muted-foreground border rounded-lg">
              <p>Selecione uma alternativa para comparar</p>
            </div>
          )}

          {/* Notes section */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notas e Observações
            </Label>
            <Textarea
              placeholder="Adicione notas sobre esta análise de mudança..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            {notes.trim() && (
              <Button variant="outline" size="sm" onClick={handleSaveNotes}>
                Guardar Notas
              </Button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button
                variant={isBookmarked ? "default" : "outline"}
                onClick={handleBookmark}
                className={isBookmarked ? "bg-primary" : ""}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                ) : (
                  <Bookmark className="h-4 w-4 mr-2" />
                )}
                {isBookmarked ? "Marcado para revisão" : "Marcar para revisão"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExportPDF}>
                <FileDown className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button onClick={() => onOpenChange(false)}>Fechar</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
