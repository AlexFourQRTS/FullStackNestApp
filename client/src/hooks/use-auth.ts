import { useState, useEffect } from "react";
import { authService } from "@/lib/auth";
import type { User } from "@shared/schema";

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    const result = await authService.login(credentials);
    setUser(result.user);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const hasRole = (role: string) => authService.hasRole(role);
  const hasAnyRole = (roles: string[]) => authService.hasAnyRole(roles);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };
}
