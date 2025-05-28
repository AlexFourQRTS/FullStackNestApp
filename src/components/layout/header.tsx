import React from "react";
import { Link, useLocation } from "wouter";

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
            <Link href="/">
              <a className="flex-shrink-0">
                <span className="text-2xl font-bold text-white">🐼 <span className="text-orange-500">Panda</span></span>
              </a>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-4">
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
          </nav>
        </div>
      </div>
    </header>
  );
}
