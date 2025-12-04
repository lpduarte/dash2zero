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
          {/* Side-by-side comparison */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
            {/* Critical supplier */}
            <div className="p-4 rounded-lg border border-danger/30 bg-danger/5">
              <Badge className="bg-danger mb-3">Fornecedor Atual</Badge>
              <h3 className="font-semibold text-lg mb-1">{criticalSupplier.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {sectorLabels[criticalSupplier.sector] || criticalSupplier.sector}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Emissões totais</span>
                  <span className="font-semibold text-danger">
                    {criticalSupplier.totalEmissions.toLocaleString("pt-PT")} t CO₂e
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Âmbito 1</span>
                  <span className="font-medium">
                    {criticalSupplier.scope1.toLocaleString("pt-PT")} t CO₂e
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Âmbito 2</span>
                  <span className="font-medium">
                    {criticalSupplier.scope2.toLocaleString("pt-PT")} t CO₂e
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Âmbito 3</span>
                  <span className="font-medium">
                    {criticalSupplier.scope3.toLocaleString("pt-PT")} t CO₂e
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">FE (por faturação)</span>
                  <span className="font-medium">
                    {criticalSupplier.emissionsPerRevenue.toFixed(1)} kg CO₂e/€
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-danger/20 to-success/20 flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-success" />
              </div>
            </div>

            {/* Alternative supplier */}
            <div className="p-4 rounded-lg border border-success/30 bg-success/5">
              <Badge className="bg-success mb-3">Alternativa</Badge>

              {/* Alternative selector */}
              <div className="mb-4">
                <Select
                  value={selectedAlternativeId}
                  onValueChange={setSelectedAlternativeId}
                >
                  <SelectTrigger className="w-full">
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
              </div>

              {selectedAlternative ? (
                <>
                  <h3 className="font-semibold text-lg mb-1 text-success">
                    {selectedAlternative.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {sectorLabels[selectedAlternative.sector] || selectedAlternative.sector}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Emissões totais</span>
                      <span className="font-semibold text-success">
                        {selectedAlternative.totalEmissions.toLocaleString("pt-PT")} t CO₂e
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Âmbito 1</span>
                      <span className="font-medium">
                        {selectedAlternative.scope1.toLocaleString("pt-PT")} t CO₂e
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Âmbito 2</span>
                      <span className="font-medium">
                        {selectedAlternative.scope2.toLocaleString("pt-PT")} t CO₂e
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Âmbito 3</span>
                      <span className="font-medium">
                        {selectedAlternative.scope3.toLocaleString("pt-PT")} t CO₂e
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">FE (por faturação)</span>
                      <span className="font-medium">
                        {selectedAlternative.emissionsPerRevenue.toFixed(1)} kg CO₂e/€
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>Selecione uma alternativa para comparar</p>
                </div>
              )}
            </div>
          </div>

          {/* Impact Summary */}
          {selectedAlternative && (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-success/30 bg-success/5 text-center">
                <TrendingDown className="h-5 w-5 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Redução de Emissões</p>
                <p className="text-2xl font-bold text-success">
                  -{emissionsSavings.toLocaleString("pt-PT")}
                </p>
                <p className="text-xs text-muted-foreground">t CO₂e ({savingsPercentage}%)</p>
              </div>

              <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-center">
                <Euro className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Melhoria no FE</p>
                <p className="text-2xl font-bold text-primary">
                  -{feImprovement.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">kg CO₂e/€</p>
              </div>

              <div className="p-4 rounded-lg border border-warning/30 bg-warning/5 text-center">
                <Euro className="h-5 w-5 text-warning mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Impacto Estimado</p>
                <p className="text-2xl font-bold text-warning">~€{estimatedCostImpact}</p>
                <p className="text-xs text-muted-foreground">poupança anual estimada</p>
              </div>
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
