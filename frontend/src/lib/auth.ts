import { apiRequest } from "./queryClient";
import type { User, LoginRequest, RegisterRequest } from "@shared/schema";

interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("auth_user");
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    const data = await response.json();
    
    this.token = data.token;
    this.user = data.user;
    
    localStorage.setItem("auth_token", this.token);
    localStorage.setItem("auth_user", JSON.stringify(this.user));
    
    return data;
  }

  async register(userData: RegisterRequest): Promise<{ message: string; user: User }> {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    return await response.json();
  }

  async initializeAdmin(userData: RegisterRequest): Promise<{ message: string; user: User }> {
    const response = await apiRequest("POST", "/api/init", userData);
    return await response.json();
  }

  async logout(): Promise<void> {
    if (this.token) {
      try {
        await apiRequest("POST", "/api/auth/logout");
      } catch {
        // Ignore errors during logout
      }
    }
    
    this.token = null;
    this.user = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null;
    
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        this.user = data.user;
        localStorage.setItem("auth_user", JSON.stringify(this.user));
        return this.user;
      } else {
        this.logout();
        return null;
      }
    } catch {
      this.logout();
      return null;
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return !!this.user && roles.includes(this.user.role);
  }
}

export const authService = new AuthService();
