import type { ChatMessage } from "@shared/schema";

interface ChatMessageProps {
  message: ChatMessage;
  avatarColor: string;
  isOwn?: boolean;
}

export default function ChatMessage({ message, avatarColor, isOwn = false }: ChatMessageProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className={`flex items-start space-x-3 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-8 h-8 ${avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
        {getInitials(message.username)}
      </div>
      
      <div className={`flex-1 max-w-xs sm:max-w-md ${isOwn ? 'text-right' : ''}`}>
        <div className={`flex items-center space-x-2 mb-1 ${isOwn ? 'justify-end' : ''}`}>
          <span className="font-semibold text-graphite-900 text-sm">
            {isOwn ? 'You' : message.username}
          </span>
          <span className="text-gray-500 text-xs">
            {formatTime(message.timestamp!)}
          </span>
        </div>
        
        <div 
          className={`inline-block px-4 py-2 rounded-lg max-w-full break-words ${
            isOwn 
              ? 'bg-panda-orange-500 text-white rounded-br-sm' 
              : 'bg-white text-graphite-700 border border-gray-200 rounded-bl-sm shadow-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
