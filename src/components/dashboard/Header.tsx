import { Leaf, LayoutDashboard, List } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-gradient-primary text-primary-foreground py-6 px-8 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/20 p-3 rounded-lg">
              <Leaf className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">dash2zero</h1>
              <p className="text-primary-foreground/90 text-sm">
                Dashboard de Sustentabilidade de Fornecedores
              </p>
            </div>
          </div>

          <nav className="flex gap-2">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                location.pathname === "/"
                  ? "bg-primary-foreground/20"
                  : "hover:bg-primary-foreground/10"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/empresas"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                location.pathname === "/empresas"
                  ? "bg-primary-foreground/20"
                  : "hover:bg-primary-foreground/10"
              )}
            >
              <List className="h-4 w-4" />
              Empresas
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
