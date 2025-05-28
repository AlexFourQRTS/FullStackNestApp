interface CodeSnippetProps {
  code: string;
  language: string;
  fileName: string;
}

const getLanguageColor = (language: string) => {
  switch (language.toLowerCase()) {
    case "javascript":
      return "text-yellow-400";
    case "typescript":
      return "text-blue-400";
    case "python":
      return "text-green-400";
    case "java":
      return "text-red-400";
    case "css":
      return "text-purple-400";
    case "html":
      return "text-orange-400";
    case "sql":
      return "text-cyan-400";
    default:
      return "text-gray-400";
  }
};

export default function CodeSnippet({ code, language, fileName }: CodeSnippetProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
      {/* VS Code style header */}
      <div className="flex items-center mb-3">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="ml-3 text-gray-400 text-xs">{fileName}</span>
      </div>
      
      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className={`${getLanguageColor(language)} text-sm leading-relaxed`}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
