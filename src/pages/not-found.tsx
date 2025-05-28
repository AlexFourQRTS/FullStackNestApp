import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Frown } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Sadness Character */}
        <div className="mb-8">
          <Frown className="w-32 h-32 mx-auto text-orange-400" />
        </div>

        {/* Error Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4">
            Oh no... This page is missing 😔
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            I'm really sad about this, but the page you're looking for isn't here
          </p>
          <p className="text-gray-400">
            Maybe it got lost in the memory vault?
          </p>
        </div>

        {/* Sad Quote */}
        <Card className="bg-gray-800/50 border-orange-500/20 mb-8 backdrop-blur-sm">
          <CardContent className="p-6">
            <blockquote className="text-lg text-gray-300 italic">
              "I'm sorry... I know you really wanted to find that page."
            </blockquote>
            <p className="text-orange-400 mt-2">- Sadness</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              <Home className="mr-2 h-5 w-5" />
              Take me home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="border-orange-500 text-orange-400 hover:bg-orange-500/10 px-8 py-3 text-lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go back
          </Button>
        </div>

        {/* Fun Facts */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            💭 Fun fact: Sadness helps us appreciate the good things in life
          </p>
          <p className="text-gray-500 text-sm mt-1">
            🧠 Maybe this page is hiding in a core memory?
          </p>
        </div>
      </div>
    </div>
  );
}