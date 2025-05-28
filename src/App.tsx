import React from "react";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

// Pages
import Home from "./pages/home/index";
import Blog from "./pages/blog/index";
import Chat from "./pages/chat/index";
import Media from "./pages/media/index";
import Technologies from "./pages/technologies/index";
import About from "./pages/about/index";
import News from "./pages/news/index";
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