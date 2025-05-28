import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

// Pages
import Home from "./pages/home";
import Blog from "./pages/blog";
import Chat from "./pages/chat";
import Media from "./pages/media";
import Technologies from "./pages/technologies";
import About from "./pages/about";
import News from "./pages/news";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/blog" component={Blog} />
                <Route path="/chat" component={Chat} />
                <Route path="/media" component={Media} />
                <Route path="/technologies" component={Technologies} />
                <Route path="/about" component={About} />
                <Route path="/news" component={News} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
            <Toaster />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}