import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTechnologySchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Zap, ChevronDown } from "lucide-react";
import { z } from "zod";
import type { Technology } from "@shared/schema";
import styles from "./styles.module.css";

const createTechnologySchema = insertTechnologySchema.extend({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
});

export default function Technologies() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: technologies = [], isLoading } = useQuery<Technology[]>({
    queryKey: ["/api/technologies"],
  });

  const form = useForm<z.infer<typeof createTechnologySchema>>({
    resolver: zodResolver(createTechnologySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "fas fa-cog",
      tags: [],
    },
  });

  const createTechMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createTechnologySchema>) => {
      const response = await apiRequest("POST", "/api/technologies", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/technologies"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Technology added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add technology. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTechMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/technologies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/technologies"] });
      toast({
        title: "Success",
        description: "Technology deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete technology. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof createTechnologySchema>) => {
    const processedData = {
      ...data,
      tags: data.tags || [],
    };
    createTechMutation.mutate(processedData);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this technology?")) {
      deleteTechMutation.mutate(id);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            <span className={styles.titleHighlight}>Tech</span> Stack
          </h1>
          <p className={styles.subtitle}>
            Explore the cutting-edge technologies that power our platform
          </p>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <button className={styles.addButton}>
                <Plus className="h-4 w-4" />
                Add Technology
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Technology</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="React" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon (Font Awesome class)</FormLabel>
                        <FormControl>
                          <Input placeholder="fab fa-react" {...field} />
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
                          <Textarea placeholder="Enter technology description" rows={4} {...field} />
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
                      disabled={createTechMutation.isPending}
                    >
                      {createTechMutation.isPending ? "Adding..." : "Add Technology"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.content}>
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : technologies.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-graphite-900 mb-2">No technologies yet</h3>
              <p className="text-graphite-600 mb-4">Add your first technology to get started!</p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-panda-orange-500 hover:bg-panda-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Technology
              </Button>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {technologies.map((tech) => (
                <AccordionItem key={tech.id} value={tech.id.toString()}>
                  <Card className="overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors [&[data-state=open]>div>div:last-child]:rotate-180">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <i className={`${tech.icon} text-2xl mr-4 text-panda-orange-500`}></i>
                          <h3 className="text-lg font-semibold text-graphite-900">{tech.name}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(tech.id);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-6 pb-6">
                        <p className="text-graphite-600 mb-4">{tech.description}</p>
                        {tech.tags && tech.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tech.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="bg-panda-orange-100 text-panda-orange-800">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>
    </div>
  );
}
