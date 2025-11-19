import { Leaf } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-gradient-primary text-primary-foreground py-6 px-8 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/20 p-3 rounded-lg">
            <Leaf className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Get2Zero Simple</h1>
            <p className="text-primary-foreground/90 text-sm">
              Dashboard de Sustentabilidade de Fornecedores
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
