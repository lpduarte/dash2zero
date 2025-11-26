import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CreateClusterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => void;
}

export function CreateClusterDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateClusterDialogProps) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Por favor, insira um nome para o cluster");
      return;
    }

    onCreate(name);
    toast.success("Cluster criado com sucesso!");
    onOpenChange(false);
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Cluster</DialogTitle>
          <DialogDescription>
            Crie um novo cluster para organizar os seus fornecedores
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cluster</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Parceiros, Clientes, Subcontratados..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>Criar Cluster</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
