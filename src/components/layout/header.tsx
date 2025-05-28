import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Technologies", href: "/technologies" },
  { name: "Media", href: "/media" },
  { name: "News", href: "/news" },
  { name: "Chat", href: "/chat" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  return (
    <header className="bg-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-white">🐼 <span className="text-orange-500">Panda</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                      isActive(item.href)
                        ? "text-orange-400 bg-orange-500/10 border border-orange-500/20"
                        : "text-gray-300 hover:text-orange-400 hover:bg-gray-800"
                    }`}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
          </nav>

          {/* Auth Button - Desktop */}
          <div className="hidden md:block">
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-orange-400 hover:bg-gray-800">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="text-xl font-bold text-gray-900 mb-4">🐼 Panda</div>
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a
                        className={`block px-3 py-2 text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? "text-orange-500 bg-orange-50 rounded-md"
                            : "text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-md"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                  
                  {/* Auth Button - Mobile */}
                  <div className="pt-4 border-t border-gray-200">
                    <AuthButton />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
