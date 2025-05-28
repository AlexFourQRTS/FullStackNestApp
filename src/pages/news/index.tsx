import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ExternalLink, Calendar } from "lucide-react";
import type { NewsArticle } from "@shared/schema";
import styles from "./styles.module.css";

export default function News() {
  const { toast } = useToast();

  const { data: newsArticles = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  const fetchNewsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/news/fetch");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "Success",
        description: "Latest news articles fetched successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch news articles. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getCategoryColor = (category: string) => {
    switch (category.toUpperCase()) {
      case "TECHNOLOGY":
        return "bg-panda-orange-100 text-panda-orange-800";
      case "MOBILE":
        return "bg-blue-100 text-blue-800";
      case "DATA":
        return "bg-green-100 text-green-800";
      case "AI":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Latest <span className={styles.titleHighlight}>Tech News</span>
          </h1>
          <p className={styles.subtitle}>
            Stay updated with the latest technology trends and breaking news
          </p>
          
          <button
            onClick={() => fetchNewsMutation.mutate()}
            disabled={fetchNewsMutation.isPending}
            className={styles.fetchButton}
          >
            <RefreshCw className={`h-4 w-4 ${fetchNewsMutation.isPending ? "animate-spin" : ""}`} />
            {fetchNewsMutation.isPending ? "Fetching..." : "Fetch Latest News"}
          </button>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.content}>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : newsArticles.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-graphite-900 mb-2">No news articles yet</h3>
            <p className="text-graphite-600 mb-4">Click the button above to fetch the latest tech news!</p>
            <Button
              onClick={() => fetchNewsMutation.mutate()}
              disabled={fetchNewsMutation.isPending}
              className="bg-panda-orange-500 hover:bg-panda-orange-600 text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${fetchNewsMutation.isPending ? "animate-spin" : ""}`} />
              {fetchNewsMutation.isPending ? "Fetching..." : "Fetch News"}
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                {article.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Badge className={getCategoryColor(article.category)}>
                      {article.category}
                    </Badge>
                    <span className="ml-2 text-gray-500 text-sm flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(article.publishedAt!)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-graphite-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-graphite-600 text-sm mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  
                  {article.sourceUrl && (
                    <a 
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-panda-orange-500 hover:text-panda-orange-600 font-medium text-sm inline-flex items-center group"
                    >
                      Read more 
                      <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {newsArticles.length > 0 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => fetchNewsMutation.mutate()}
              disabled={fetchNewsMutation.isPending}
              variant="outline"
              className="border-panda-orange-500 text-panda-orange-500 hover:bg-panda-orange-500 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${fetchNewsMutation.isPending ? "animate-spin" : ""}`} />
              Load More News
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
