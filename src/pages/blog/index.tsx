import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogPostSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Clock, FileText } from "lucide-react";
import { z } from "zod";
import BlogCard from "@/components/blog/blog-card";
import type { BlogPost } from "@shared/schema";
import styles from "./styles.module.css";

const createBlogPostSchema = insertBlogPostSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog", searchQuery],
    queryFn: async () => {
      const url = searchQuery ? `/api/blog?search=${encodeURIComponent(searchQuery)}` : "/api/blog";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      return response.json();
    },
  });

  const form = useForm<z.infer<typeof createBlogPostSchema>>({
    resolver: zodResolver(createBlogPostSchema),
    defaultValues: {
      title: "",
      description: "",
      codeSnippet: "",
      language: "javascript",
      fileName: "main.js",
      readTime: 5,
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createBlogPostSchema>) => {
      const response = await apiRequest("POST", "/api/blog", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof createBlogPostSchema>) => {
    createPostMutation.mutate(data);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Tech <span className={styles.titleHighlight}>Blog</span>
          </h1>
          <p className={styles.subtitle}>
            Code snippets, tutorials, and tech insights for developers
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 w-full bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <button className={styles.createButton}>
                  <Plus className="h-4 w-4" />
                  Create Post
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter post title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter post description" rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="typescript">TypeScript</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="java">Java</SelectItem>
                                <SelectItem value="css">CSS</SelectItem>
                                <SelectItem value="html">HTML</SelectItem>
                                <SelectItem value="sql">SQL</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fileName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>File Name</FormLabel>
                            <FormControl>
                              <Input placeholder="main.js" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="codeSnippet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code Snippet (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter your code here..." rows={6} className="font-mono" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="readTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Read Time (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="5" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-panda-orange-500 hover:bg-panda-orange-600"
                        disabled={createPostMutation.isPending}
                      >
                        {createPostMutation.isPending ? "Creating..." : "Create Post"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.content}>
        {isLoading ? (
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonTitle}></div>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
              </div>
            ))}
          </div>
        ) : blogPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>
              {searchQuery ? "No posts found" : "No blog posts yet"}
            </h3>
            <p className={styles.emptyDescription}>
              {searchQuery 
                ? `No posts match "${searchQuery}". Try a different search term.`
                : "Be the first to create a blog post!"
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-panda-orange-500 hover:bg-panda-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Post
              </Button>
            )}
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
