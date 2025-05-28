import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./src/contexts/AuthContext";
import Header from "./src/components/layout/header";
import Footer from "./src/components/layout/footer";

// Pages
import Home from "./src/pages/home/index";
import Blog from "./src/pages/blog/index";
import Chat from "./src/pages/chat/index";
import Media from "./src/pages/media/index";
import Technologies from "./src/pages/technologies/index";
import About from "./src/pages/about/index";
import News from "./src/pages/news/index";
import NotFound from "./src/pages/not-found";

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
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}