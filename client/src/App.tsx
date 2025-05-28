import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import TeamTasks from "@/pages/team-tasks";
import UserManagement from "@/pages/user-management";
import RoleRequests from "@/pages/role-requests";
import RequestRole from "@/pages/request-role";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, requiredRoles, ...props }: {
  component: React.ComponentType;
  requiredRoles?: string[];
}) {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <Redirect to="/dashboard" />;
  }

  return <Component {...props} />;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
      
      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/tasks">
        <ProtectedRoute component={Tasks} />
      </Route>
      
      <Route path="/team-tasks">
        <ProtectedRoute component={TeamTasks} requiredRoles={["MANAGER", "ADMIN"]} />
      </Route>
      
      <Route path="/user-management">
        <ProtectedRoute component={UserManagement} requiredRoles={["ADMIN"]} />
      </Route>
      
      <Route path="/role-requests">
        <ProtectedRoute component={RoleRequests} requiredRoles={["ADMIN"]} />
      </Route>
      
      <Route path="/request-role">
        <ProtectedRoute component={RequestRole} />
      </Route>

      {/* Default redirects */}
      <Route path="/" component={Home} />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
