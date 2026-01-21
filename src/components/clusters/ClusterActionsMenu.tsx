import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Copy, Archive, Trash2 } from "lucide-react";
import { ClusterDefinition } from "@/types/clusterNew";

interface ClusterActionsMenuProps {
  cluster: ClusterDefinition;
  onEdit: (cluster: ClusterDefinition) => void;
  onDuplicate: (cluster: ClusterDefinition) => void;
  onArchive: (cluster: ClusterDefinition) => void;
  onDelete: (cluster: ClusterDefinition) => void;
  triggerClassName?: string;
}

export function ClusterActionsMenu({
  cluster,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  triggerClassName,
}: ClusterActionsMenuProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={triggerClassName}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEdit(cluster);
            }}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Editar cluster
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(cluster);
            }}
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicar cluster
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setShowArchiveConfirm(true);
            }}
          >
            <Archive className="h-4 w-4 mr-2" />
            Arquivar cluster
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-danger focus:text-danger"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar cluster
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Archive Confirmation */}
      <Dialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Arquivar cluster</DialogTitle>
            <DialogDescription>
              O cluster "{cluster.name}" será arquivado e deixará de aparecer na lista.
              As empresas associadas serão mantidas, mas sem associação a este cluster.
              Pode restaurar o cluster mais tarde se necessário.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveConfirm(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                onArchive(cluster);
                setShowArchiveConfirm(false);
              }}
            >
              Arquivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar cluster</DialogTitle>
            <DialogDescription>
              Tem a certeza que pretende eliminar o cluster "{cluster.name}"?
              Esta ação é irreversível. As empresas associadas serão mantidas,
              mas perderão a associação a este cluster.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(cluster);
                setShowDeleteConfirm(false);
              }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
