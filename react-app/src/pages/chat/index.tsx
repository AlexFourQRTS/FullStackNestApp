import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Users, LogIn } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useAuth } from "@/contexts/AuthContext";
import ChatMessage from "@/components/chat/chat-message";
import type { ChatMessage as ChatMessageType } from "@shared/schema";
import styles from "./styles.module.css";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(() => `User_${Math.floor(Math.random() * 1000)}`);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: initialMessages = [] } = useQuery<ChatMessageType[]>({
    queryKey: ["/api/chat/messages"],
    queryFn: async () => {
      const response = await fetch("/api/chat/messages?limit=50");
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
  });

  const {
    messages: liveMessages,
    sendMessage,
    isConnected: wsConnected
  } = useWebSocket(initialMessages);

  useEffect(() => {
    setIsConnected(wsConnected);
  }, [wsConnected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages]);

  const handleSendMessage = () => {
    if (message.trim() && sendMessage) {
      sendMessage(username, message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateAvatar = (name: string) => {
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-panda-orange-500"
    ];
    const colorIndex = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[colorIndex];
  };

  const currentUsername = username;

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Anonymous <span className={styles.titleHighlight}>Chat</span>
          </h1>
          <p className={styles.subtitle}>
            Join the conversation with developers worldwide in real-time
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.content}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-graphite-900 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">Global Developer Chat</h3>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant={isConnected ? "default" : "destructive"} className="bg-green-500">
                  <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-300" : "bg-red-300"}`}></div>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{onlineCount} online</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Container */}
            <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {liveMessages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-graphite-600">No messages yet. Be the first to say hello!</p>
                </div>
              ) : (
                liveMessages.map((msg, index) => (
                  <ChatMessage
                    key={msg.id || index}
                    message={msg}
                    avatarColor={generateAvatar(msg.username)}
                    isOwn={msg.username === currentUsername}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex space-x-3 mb-3">
                <Input
                  type="text"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex space-x-3">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!isConnected}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !isConnected}
                  className="bg-panda-orange-500 hover:bg-panda-orange-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {!isConnected && (
                <p className="text-sm text-red-500 mt-2">
                  Connection lost. Attempting to reconnect...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Guidelines */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Chat Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-graphite-600 space-y-1">
              <li>• Be respectful and professional</li>
              <li>• Stay on topic (technology and development)</li>
              <li>• No spam or inappropriate content</li>
              <li>• Help others and share knowledge</li>
              <li>• This is an anonymous chat - choose your username above</li>
            </ul>
          </CardContent>
        </Card>
        </div>
      </section>
    </div>
  );
}
