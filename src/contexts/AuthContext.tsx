import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChange, signInWithGoogle, logOut, handleRedirectResult, type User } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Mock auth is disabled, set loading to false immediately
    setIsLoading(false);
    setUser(null);
  }, []);

  const signIn = async () => {
    // Mock implementation - authentication disabled
    toast({
      title: "Authentication Disabled",
      description: "Google authentication is temporarily disabled. Use anonymous chat instead.",
    });
  };

  const signOut = async () => {
    // Mock implementation - authentication disabled
    toast({
      title: "Authentication Disabled", 
      description: "Google authentication is temporarily disabled.",
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}