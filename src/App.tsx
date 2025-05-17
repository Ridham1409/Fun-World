
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BackgroundAnimation from "./components/BackgroundAnimation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RockPaperScissors from "./pages/RockPaperScissors";
import DiceRoller from "./pages/DiceRoller";
import MemoryGame from "./pages/MemoryGame";
import TicTacToe from "./pages/TicTacToe";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BackgroundAnimation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
          <Route path="/dice-roller" element={<DiceRoller />} />
          <Route path="/memory-game" element={<MemoryGame />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
