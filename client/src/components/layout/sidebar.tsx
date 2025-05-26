import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import RoleBadge from "@/components/role-badge";
import { 
  Users, 
  ListTodo, 
  Gauge, 
  UserCog, 
  ClipboardCheck, 
  ArrowUp, 
  Settings, 
  LogOut,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { user, logout, hasAnyRole } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  const NavLink = ({ href, icon: Icon, children, badge }: {
    href: string;
    icon: any;
    children: React.ReactNode;
    badge?: string;
  }) => {
    const isActive = location === href;
    
    return (
      <Link href={href}>
        <div className={cn("nav-link", isActive && "active")}>
          <Icon className="mr-3 h-4 w-4" />
          {children}
          {badge && (
            <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning-500 text-white">
              {badge}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-surface shadow-card border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
      <div className="h-full flex flex-col">
        {/* Logo & Brand */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <UserCog className="text-primary-foreground h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">RoleFlow</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Role Management</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <UserPlus className="text-primary h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.username}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink href="/dashboard" icon={Gauge}>
            Dashboard
          </NavLink>
          
          <NavLink href="/tasks" icon={ListTodo}>
            My ListTodo
          </NavLink>

          {/* Manager+ Navigation */}
          {hasAnyRole(["MANAGER", "ADMIN"]) && (
            <NavLink href="/team-tasks" icon={Users}>
              Team ListTodo
            </NavLink>
          )}

          {/* Admin Only Navigation */}
          {hasAnyRole(["ADMIN"]) && (
            <>
              <NavLink href="/user-management" icon={UserCog}>
                User Management
              </NavLink>
              
              <NavLink href="/role-requests" icon={ClipboardCheck}>
                Role Requests
              </NavLink>
            </>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-4 space-y-2">
            {!hasAnyRole(["ADMIN"]) && (
              <NavLink href="/request-role" icon={ArrowUp}>
                Request Role Upgrade
              </NavLink>
            )}
            
            <NavLink href="/settings" icon={Settings}>
              Settings
            </NavLink>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
