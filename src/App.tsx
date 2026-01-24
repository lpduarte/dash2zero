import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";
import Index from "./pages/Index";
import Overview from "./pages/Overview";
import ClusterManagement from "./pages/ClusterManagement";
import Incentive from "./pages/Incentive";
import Onboarding from "./pages/Onboarding";
import FormularioTotais from "./pages/FormularioTotais";
import EmailTemplate from "./pages/EmailTemplate";
import StyleGuide from "./pages/StyleGuide";
import Methodology from "./pages/Methodology";
import Pipeline from "./pages/Pipeline";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Componente para proteger a rota /admin - apenas Get2C pode aceder
const ProtectedAdminRoute = () => {
  const { isGet2C } = useUser();
  if (!isGet2C) {
    return <Navigate to="/" replace />;
  }
  return <Admin />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <BrowserRouter>
          <div className="bg-grain">
            <Routes>
              <Route path="/index" element={<Index />} />
              <Route path="/" element={<Overview />} />
              <Route path="/analise" element={<Navigate to="/" replace />} />
              <Route path="/clusters" element={<ClusterManagement />} />
              <Route path="/incentivo" element={<Incentive />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/formulario-totais" element={<FormularioTotais />} />
              <Route path="/email-template" element={<EmailTemplate />} />
              <Route path="/style-guide" element={<StyleGuide />} />
              <Route path="/metodologia" element={<Methodology />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/admin" element={<ProtectedAdminRoute />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
