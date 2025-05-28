import React from "react";
import { Route, Switch } from "wouter";
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

export default function App() {
  return (
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
  );
}