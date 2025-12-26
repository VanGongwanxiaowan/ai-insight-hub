import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import AcademicCircle from "./pages/AcademicCircle";
import ClassicHall from "./pages/ClassicHall";
import Notebook from "./pages/Notebook";
import AgentLab from "./pages/AgentLab";
import Settings from "./pages/Settings";
import Reading from "./pages/Reading";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/read/:id" element={<Reading />} />
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/academic-circle" element={<AcademicCircle />} />
                  <Route path="/classic-hall" element={<ClassicHall />} />
                  <Route path="/notebook" element={<Notebook />} />
                  <Route path="/agent-lab" element={<AgentLab />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
