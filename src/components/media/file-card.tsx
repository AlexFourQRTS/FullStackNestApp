import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  Image, 
  Music, 
  Video, 
  File, 
  Trash2, 
  Link, 
  Shield, 
  ShieldOff,
  AlertTriangle
} from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { MediaFile } from "@shared/schema";

interface FileCardProps {
  file: MediaFile;
  onDelete?: (id: number) => void;
}

export default function FileCard({ file, onDelete }: FileCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getFileIcon = (mediaType: string, mimeType: string) => {
    switch (mediaType) {
      case "photo":
        return <Image className="h-8 w-8 text-blue-500" />;
      case "video":
        return <Video className="h-8 w-8 text-purple-500" />;
      case "audio":
        return <Music className="h-8 w-8 text-green-500" />;
      case "document":
        if (mimeType.includes("pdf")) {
          return <FileText className="h-8 w-8 text-red-500" />;
        } else if (mimeType.includes("text")) {
          return <FileText className="h-8 w-8 text-gray-500" />;
        } else {
          return <File className="h-8 w-8 text-panda-orange-500" />;
        }
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const toggleProtectionMutation = useMutation({
    mutationFn: async (isProtected: boolean) => {
      return apiRequest({
        method: "PATCH",
        endpoint: `/api/media/${file.id}/protection`,
        body: { protected: isProtected },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({
        title: file.protected ? "File unprotected" : "File protected",
        description: file.protected 
          ? "File can now be deleted" 
          : "File is now protected from deletion",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update file protection",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest({
        method: "DELETE",
        endpoint: `/api/media/${file.id}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      if (onDelete) onDelete(file.id);
      toast({
        title: "File deleted",
        description: "File has been permanently deleted",
      });
    },
    onError: (error: any) => {
      const message = error.message === "This file is protected and cannot be deleted" 
        ? "This file is protected and cannot be deleted"
        : "Failed to delete file";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleDownload = () => {
    const downloadUrl = `/api/media/${file.id}/download`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyDirectLink = async () => {
    const directUrl = `${window.location.origin}/api/media/${file.id}/${encodeURIComponent(file.originalName)}`;
    try {
      await navigator.clipboard.writeText(directUrl);
      toast({
        title: "Link copied",
        description: "Direct link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleToggleProtection = () => {
    toggleProtectionMutation.mutate(!file.protected);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    setIsDeleteDialogOpen(false);
  };

  const canPreview = (mediaType: string, mimeType: string) => {
    return mediaType === "photo" || 
           mediaType === "video" || 
           mediaType === "audio" ||
           mimeType.includes("pdf") ||
           mimeType.includes("text");
  };

  const handlePreview = () => {
    if (file.mediaType === "photo" || file.mediaType === "video" || file.mediaType === "audio") {
      window.open(`/api/media/file/${file.fileName}`, '_blank');
    } else if (file.mimeType.includes("pdf") || file.mimeType.includes("text")) {
      window.open(`/api/media/file/${file.fileName}`, '_blank');
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getFileIcon(file.mediaType, file.mimeType)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {file.originalName}
                </h3>
                {file.protected && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Protected
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {getFileExtension(file.originalName)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.fileSize)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(file.uploadedAt || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {canPreview(file.mediaType, file.mimeType) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                className="flex-1"
              >
                Preview
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyDirectLink}
              className="flex-1"
            >
              <Link className="h-4 w-4 mr-1" />
              Copy Link
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleProtection}
              disabled={toggleProtectionMutation.isPending}
              className="px-3"
            >
              {file.protected ? (
                <ShieldOff className="h-4 w-4" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
            </Button>
          </div>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={file.protected}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {file.protected ? "Protected" : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Delete File
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{file.originalName}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}