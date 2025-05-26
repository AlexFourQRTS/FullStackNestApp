import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import AuthGuard from "@/components/auth-guard";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoleBadge from "@/components/role-badge";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Heart,
  UserPlus,
  BarChart3,
  Settings as SettingsIcon
} from "lucide-react";
import { authService } from "@/lib/auth";

interface Stats {
  totalUsers: number;
  pendingRequests: number;
  activeTasks: number;
}

interface RoleRequest {
  id: number;
  userId: number;
  requestedRole: string;
  status: string;
  justification: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, hasAnyRole } = useAuth();

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    enabled: hasAnyRole(["ADMIN"]),
  });

  const { data: recentRequests } = useQuery<RoleRequest[]>({
    queryKey: ["/api/role-requests/pending"],
    enabled: hasAnyRole(["ADMIN"]),
  });

  if (!user) return null;

  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header 
            title={`${user.role === 'ADMIN' ? 'Admin' : user.role === 'MANAGER' ? 'Manager' : 'User'} Dashboard`}
            subtitle="Manage your tasks and role requests"
          />
          
          <div className="p-6 space-y-6">
            {/* Stats Cards - Admin Only */}
            {hasAnyRole(["ADMIN"]) && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalUsers}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Users className="text-primary h-6 w-6" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-green-600 font-medium">+12%</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.pendingRequests}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                        <Clock className="text-yellow-600 h-6 w-6" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-yellow-600 font-medium">3 urgent</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">require attention</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Tasks</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.activeTasks}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                        <CheckCircle className="text-green-600 h-6 w-6" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-green-600 font-medium">89%</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">completion rate</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">99.8%</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                        <Heart className="text-green-600 h-6 w-6" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <span className="text-green-600 font-medium">Excellent</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">uptime</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Role Requests - Admin Only */}
              {hasAnyRole(["ADMIN"]) && (
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Role Requests</CardTitle>
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentRequests && recentRequests.length > 0 ? (
                        recentRequests.slice(0, 3).map((request) => (
                          <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <UserPlus className="text-primary h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">User #{request.userId}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Requesting:</span>
                                  <RoleBadge role={request.requestedRole} />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="status-badge pending">
                                {request.status}
                              </span>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="default">
                                  Approve
                                </Button>
                                <Button size="sm" variant="destructive">
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                          No pending role requests
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Quick Actions & Recent Activity */}
              <div className={`space-y-6 ${!hasAnyRole(["ADMIN"]) ? "lg:col-span-3" : ""}`}>
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {hasAnyRole(["ADMIN"]) && (
                      <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center space-x-3">
                          <UserPlus className="h-4 w-4" />
                          <span>Create New User</span>
                        </div>
                        <span>→</span>
                      </Button>
                    )}
                    
                    {hasAnyRole(["MANAGER", "ADMIN"]) && (
                      <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="h-4 w-4" />
                          <span>View Reports</span>
                        </div>
                        <span>→</span>
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full justify-between">
                      <div className="flex items-center space-x-3">
                        <SettingsIcon className="h-4 w-4" />
                        <span>Settings</span>
                      </div>
                      <span>→</span>
                    </Button>
                  </CardContent>
                </Card>

                {/* Welcome Message */}
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome back, {user.username}!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      You are logged in with <RoleBadge role={user.role} className="mx-1" /> permissions.
                      {user.role === "USER" && " You can request role upgrades from the sidebar."}
                      {user.role === "MANAGER" && " You can manage team tasks and view reports."}
                      {user.role === "ADMIN" && " You have full system access."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
