import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, Play, Volume2, Image, Trash2, FileText } from "lucide-react";
import MediaPlayer from "@/components/media/media-player";
import FileCard from "@/components/media/file-card";
import type { MediaFile } from "@shared/schema";
import styles from "./styles.module.css";

export default function Media() {
  const [selectedMediaType, setSelectedMediaType] = useState<"photo" | "video" | "audio" | "document">("photo");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: mediaFiles = [], isLoading } = useQuery<MediaFile[]>({
    queryKey: ["/api/media", selectedMediaType],
    queryFn: async () => {
      const response = await fetch(`/api/media?type=${selectedMediaType}`);
      if (!response.ok) throw new Error("Failed to fetch media files");
      return response.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast({
        title: "Success",
        description: "File uploaded successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({
        title: "Success",
        description: "File deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this file?")) {
      deleteMutation.mutate(id);
    }
  };

  const getFileUrl = (fileName: string) => `/api/media/file/${fileName}`;

  const getIconForMediaType = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-8 w-8 text-white" />;
      case "audio":
        return <Volume2 className="h-8 w-8 text-white" />;
      default:
        return <Image className="h-8 w-8 text-white" />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Media <span className={styles.titleHighlight}>Gallery</span>
          </h1>
          <p className={styles.subtitle}>
            Share and explore photos, videos, audio files, and documents with ease
          </p>
          
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <button className={styles.uploadButton}>
                <Upload className="h-4 w-4" />
                Upload Media
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Media File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="*/*"
                    onChange={handleFileSelect}
                    className="mt-1"
                  />
                </div>
                
                {previewUrl && selectedFile && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <div className="mt-2 border rounded-lg p-4 bg-gray-50">
                      {selectedFile.type.startsWith("image/") && (
                        <img src={previewUrl} alt="Preview" className="max-w-full h-48 object-contain mx-auto" />
                      )}
                      {selectedFile.type.startsWith("video/") && (
                        <video src={previewUrl} controls className="max-w-full h-48 mx-auto" />
                      )}
                      {selectedFile.type.startsWith("audio/") && (
                        <audio src={previewUrl} controls className="w-full" />
                      )}
                      <p className="text-sm text-gray-600 mt-2">
                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpload}
                    disabled={!selectedFile || uploadMutation.isPending}
                    className="bg-panda-orange-500 hover:bg-panda-orange-600"
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.content}>
        <Tabs value={selectedMediaType} onValueChange={(value) => setSelectedMediaType(value as "photo" | "video" | "audio" | "document")} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="photo" className="flex items-center">
                <Image className="h-4 w-4 mr-2" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center">
                <Volume2 className="h-4 w-4 mr-2" />
                Audio
              </TabsTrigger>
              <TabsTrigger value="document" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Files
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="photo">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                  </Card>
                ))}
              </div>
            ) : mediaFiles.length === 0 ? (
              <div className="text-center py-12">
                <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-graphite-900 mb-2">No photos yet</h3>
                <p className="text-graphite-600 mb-4">Upload your first photo to get started!</p>
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="bg-panda-orange-500 hover:bg-panda-orange-600 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaFiles.map((file) => (
                  <Card key={file.id} className="group relative overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative">
                      <img 
                        src={getFileUrl(file.fileName)} 
                        alt={file.originalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                          className="opacity-0 group-hover:opacity-100 text-white hover:text-red-400"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm text-graphite-600 truncate">{file.originalName}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="video">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : mediaFiles.length === 0 ? (
              <div className="text-center py-12">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-graphite-900 mb-2">No videos yet</h3>
                <p className="text-graphite-600 mb-4">Upload your first video to get started!</p>
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="bg-panda-orange-500 hover:bg-panda-orange-600 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaFiles.map((file) => (
                  <Card key={file.id} className="group relative overflow-hidden hover:shadow-lg transition-shadow">
                    <MediaPlayer 
                      src={getFileUrl(file.fileName)} 
                      type="video" 
                      className="w-full h-48"
                    />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-graphite-600 truncate flex-1">{file.originalName}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="audio">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : mediaFiles.length === 0 ? (
              <div className="text-center py-12">
                <Volume2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-graphite-900 mb-2">No audio files yet</h3>
                <p className="text-graphite-600 mb-4">Upload your first audio file to get started!</p>
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="bg-panda-orange-500 hover:bg-panda-orange-600 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Audio
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {mediaFiles.map((file) => (
                  <Card key={file.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-graphite-900">{file.originalName}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <MediaPlayer 
                        src={getFileUrl(file.fileName)} 
                        type="audio" 
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="document">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : mediaFiles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No files yet</h3>
                <p className="text-muted-foreground mb-4">Upload your first document to get started!</p>
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="bg-panda-orange-500 hover:bg-panda-orange-600 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {mediaFiles.map((file) => (
                  <FileCard 
                    key={file.id} 
                    file={file} 
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
