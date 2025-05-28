import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, User } from "lucide-react";

export default function AuthButton() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <div className="w-4 h-4 border-2 border-panda-orange-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button 
        onClick={signIn}
        variant="outline" 
        size="sm"
        className="border-panda-orange-500 text-panda-orange-500 hover:bg-panda-orange-500 hover:text-white"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign In with Google
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
            <AvatarFallback>
              {user?.displayName?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.displayName && (
              <p className="font-medium">{user.displayName}</p>
            )}
            {user?.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}