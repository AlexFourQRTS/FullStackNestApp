import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import AuthGuard from "@/components/auth-guard";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RoleBadge from "@/components/role-badge";
import { ArrowUp, Clock, CheckCircle, XCircle, Calendar, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { RoleRequest } from "@shared/schema";

export default function RequestRole() {
  const { user, hasAnyRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    requestedRole: "",
    justification: "",
  });

  const { data: requests, isLoading } = useQuery<RoleRequest[]>({
    queryKey: ["/api/role-requests"],
    enabled: !!user,
  });

  const createRequestMutation = useMutation({
    mutationFn: async (requestData: typeof newRequest) => {
      const response = await apiRequest("POST", "/api/role-requests", requestData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/role-requests"] });
      setIsRequestOpen(false);
      setNewRequest({
        requestedRole: "",
        justification: "",
      });
      toast({
        title: "Success",
        description: "Role request submitted successfully! It will be reviewed by an administrator.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit role request",
        variant: "destructive",
      });
    },
  });

  const handleSubmitRequest = () => {
    if (!newRequest.requestedRole || !newRequest.justification.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    createRequestMutation.mutate(newRequest);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
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

  const getAvailableRoles = () => {
    if (!user) return [];
    
    const roles = [];
    if (user.role === "USER") {
      roles.push("MANAGER", "ADMIN");
    } else if (user.role === "MANAGER") {
      roles.push("ADMIN");
    }
    return roles;
  };

  const hasPendingRequest = requests?.some(request => request.status === "PENDING");

  if (!user) return null;

  // Admin users can't request role upgrades
  if (hasAnyRole(["ADMIN"])) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex bg-background">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Header title="Role Requests" subtitle="Manage your role elevation requests" />
            
            <div className="p-6">
              <Card>
                <CardContent className="p-12 text-center">
                  <ArrowUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Maximum Role Achieved
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You already have the highest role (ADMIN) in the system.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header title="Role Requests" subtitle="Request role elevation and track your requests" />
          
          <div className="p-6 space-y-6">
            {/* Current Role & Request Action */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowUp className="h-5 w-5 mr-2" />
                  Request Role Elevation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your current role:</p>
                    <RoleBadge role={user.role} className="text-base px-3 py-1" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                      {user.role === "USER" && "You can request Manager or Admin role to gain additional permissions."}
                      {user.role === "MANAGER" && "You can request Admin role to gain full system access."}
                    </p>
                  </div>
                  <div>
                    {hasPendingRequest ? (
                      <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Request Pending
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          Wait for admin approval
                        </p>
                      </div>
                    ) : (
                      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                        <DialogTrigger asChild>
                          <Button size="lg">
                            <ArrowUp className="h-4 w-4 mr-2" />
                            Request Role Upgrade
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Request Role Elevation</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="requestedRole">Requested Role</Label>
                              <Select 
                                value={newRequest.requestedRole} 
                                onValueChange={(value) => setNewRequest({ ...newRequest, requestedRole: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableRoles().map(role => (
                                    <SelectItem key={role} value={role}>
                                      {role}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="justification">Justification</Label>
                              <Textarea
                                id="justification"
                                value={newRequest.justification}
                                onChange={(e) => setNewRequest({ ...newRequest, justification: e.target.value })}
                                placeholder="Please explain why you need this role elevation..."
                                className="h-24 resize-none"
                                maxLength={500}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {newRequest.justification.length}/500 characters
                              </p>
                            </div>
                            
                            <div className="flex space-x-3 pt-4">
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="flex-1" 
                                onClick={() => setIsRequestOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="button" 
                                className="flex-1" 
                                onClick={handleSubmitRequest}
                                disabled={createRequestMutation.isPending}
                              >
                                {createRequestMutation.isPending ? "Submitting..." : "Submit Request"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request History */}
            <Card>
              <CardHeader>
                <CardTitle>Your Request History</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
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
                              {getStatusIcon(request.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <RoleBadge role={request.currentRole} />
                                <span className="text-sm text-gray-600 dark:text-gray-400">→</span>
                                <RoleBadge role={request.requestedRole} />
                              </div>
                              <div className="flex items-start space-x-2 mb-3">
                                <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {request.justification}
                                </p>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                Requested {new Date(request.createdAt).toLocaleDateString()}
                                {request.reviewedAt && (
                                  <>
                                    <span className="mx-2">•</span>
                                    Reviewed {new Date(request.reviewedAt).toLocaleDateString()}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <span className={getStatusColor(request.status)}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ArrowUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No requests yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You haven't submitted any role elevation requests.
                    </p>
                    <Button onClick={() => setIsRequestOpen(true)} disabled={hasPendingRequest}>
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Submit Your First Request
                    </Button>
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
