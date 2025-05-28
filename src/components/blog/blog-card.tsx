import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import CodeSnippet from "./code-snippet";
import type { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {post.codeSnippet && (
        <div className="bg-graphite-900 p-4">
          <CodeSnippet
            code={post.codeSnippet}
            language={post.language || "javascript"}
            fileName={post.fileName || "main.js"}
          />
        </div>
      )}
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-graphite-900 mb-2 group-hover:text-panda-orange-500 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-graphite-600 mb-4 line-clamp-3">
          {post.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDate(post.createdAt!)}</span>
          </div>
          
          <Badge variant="secondary" className="text-panda-orange-500 bg-panda-orange-50">
            {post.readTime} min read
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
