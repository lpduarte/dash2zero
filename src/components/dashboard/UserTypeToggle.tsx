import { Building2, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/user";

interface UserTypeToggleProps {
  currentType: UserType;
  onTypeChange: (type: UserType) => void;
}

export const UserTypeToggle = ({ currentType, onTypeChange }: UserTypeToggleProps) => {
  return (
    <div className="flex items-center bg-primary-foreground/10 rounded-lg p-1">
      <button
        onClick={() => onTypeChange('empresa')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
          currentType === 'empresa'
            ? "bg-primary-foreground text-primary shadow-sm"
            : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
        )}
      >
        <Building2 className="h-3.5 w-3.5" />
        Empresa
      </button>
      <button
        onClick={() => onTypeChange('municipio')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
          currentType === 'municipio'
            ? "bg-primary-foreground text-primary shadow-sm"
            : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
        )}
      >
        <Landmark className="h-3.5 w-3.5" />
        Município
      </button>
    </div>
  );
};
