import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import AuthGuard from "@/components/auth-guard";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoleBadge from "@/components/role-badge";
import { ClipboardCheck, User, Calendar, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { RoleRequest } from "@shared/schema";

export default function RoleRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery<RoleRequest[]>({
    queryKey: ["/api/role-requests"],
  });

  const approveRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await apiRequest("PUT", `/api/role-requests/${requestId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/role-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Role request approved successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve request",
        variant: "destructive",
      });
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await apiRequest("PUT", `/api/role-requests/${requestId}/reject`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/role-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Role request rejected.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject request",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (requestId: number) => {
    approveRequestMutation.mutate(requestId);
  };

  const handleReject = (requestId: number) => {
    if (confirm("Are you sure you want to reject this role request?")) {
      rejectRequestMutation.mutate(requestId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "status-badge pending";
      case "APPROVED":
        return "status-badge approved";
      case "REJECTED":
        return "status-badge rejected";
      default:
        return "status-badge";
    }
  };

  if (!user) return null;

  const pendingRequests = requests?.filter(req => req.status === "PENDING") || [];
  const processedRequests = requests?.filter(req => req.status !== "PENDING") || [];

  return (
    <AuthGuard requiredRoles={["ADMIN"]}>
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header title="Role Requests" subtitle="Review and manage user role elevation requests" />
          
          <div className="p-6 space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {requests?.length || 0}
                      </p>
                    </div>
                    <ClipboardCheck className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {pendingRequests.length}
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                      <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processed</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {processedRequests.length}
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardCheck className="h-5 w-5 mr-2 text-yellow-600" />
                    Pending Requests ({pendingRequests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="p-4 border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                User #{request.userId}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Current role:
                                </span>
                                <RoleBadge role={request.currentRole} />
                                <span className="text-sm text-gray-600 dark:text-gray-400">→</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Requesting:
                                </span>
                                <RoleBadge role={request.requestedRole} />
                              </div>
                              <div className="mt-3">
                                <div className="flex items-start space-x-2">
                                  <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Justification:
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      {request.justification}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center text-xs text-gray-500 mt-2">
                                <Calendar className="h-3 w-3 mr-1" />
                                Requested {new Date(request.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 ml-4">
                            <span className={getStatusColor(request.status)}>
                              {request.status}
                            </span>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleApprove(request.id)}
                                disabled={approveRequestMutation.isPending}
                              >
                                {approveRequestMutation.isPending ? "Approving..." : "Approve"}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleReject(request.id)}
                                disabled={rejectRequestMutation.isPending}
                              >
                                {rejectRequestMutation.isPending ? "Rejecting..." : "Reject"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Requests */}
            <Card>
              <CardHeader>
                <CardTitle>All Role Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : requests && requests.length > 0 ? (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                User #{request.userId}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <RoleBadge role={request.currentRole} />
                                <span className="text-sm text-gray-600 dark:text-gray-400">→</span>
                                <RoleBadge role={request.requestedRole} />
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {request.justification}
                              </p>
                              <div className="flex items-center text-xs text-gray-500 mt-2">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(request.createdAt).toLocaleDateString()}
                                {request.reviewedAt && (
                                  <>
                                    <span className="mx-2">•</span>
                                    Reviewed {new Date(request.reviewedAt).toLocaleDateString()}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={getStatusColor(request.status)}>
                              {request.status}
                            </span>
                            {request.status === "PENDING" && (
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApprove(request.id)}
                                  disabled={approveRequestMutation.isPending}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject(request.id)}
                                  disabled={rejectRequestMutation.isPending}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No role requests
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Users haven't submitted any role elevation requests yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
