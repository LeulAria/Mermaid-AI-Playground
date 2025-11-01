import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Box, IconButton, Paper, keyframes } from "@mui/material";
import { X } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { SUGGESTIONS, SuggestionButtons } from "./suggestion-buttons";
import { InputBox } from "./input-box";

// Typing animation keyframes
const typingAnimation = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
`;

interface AIChatProps {
  onClose: () => void;
  initialMessage?: string;
}

// Utility function to extract and clean Mermaid code from AI response
const extractMermaidCode = (text: string): string | null => {
  if (!text || typeof text !== 'string') return null;
  
  // Remove any leading/trailing whitespace
  text = text.trim();
  
  // First, try to find code blocks with mermaid
  const codeBlockMatch = text.match(/```(?:mermaid)?\s*\n?([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].trim();
  }
  
  // Try to find mermaid code block without language specified
  const genericCodeBlock = text.match(/```\s*\n?([\s\S]*?)```/);
  if (genericCodeBlock && genericCodeBlock[1]) {
    const code = genericCodeBlock[1].trim();
    // Check if it looks like Mermaid syntax
    if (/^(graph|flowchart|stateDiagram|sequenceDiagram|classDiagram|erDiagram|gantt|pie|journey|gitgraph|architecture-beta|block-beta)/i.test(code)) {
      return code;
    }
  }
  
  // Try to extract raw Mermaid syntax - look for lines starting with diagram keywords
  const lines = text.split('\n');
  let startIndex = -1;
  let endIndex = lines.length;
  
  // Find where the diagram starts
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^(graph|flowchart|stateDiagram|stateDiagram-v2|sequenceDiagram|classDiagram|erDiagram|gantt|pie|journey|gitgraph|architecture-beta|block-beta)\s/i.test(line)) {
      startIndex = i;
      break;
    }
  }
  
  if (startIndex === -1) return null;
  
  // Find where the diagram ends (empty line, markdown, or code block start)
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    // Stop at empty lines (but allow single empty lines within the diagram)
    if (line === '' && i < lines.length - 1 && lines[i + 1].trim() === '') {
      endIndex = i;
      break;
    }
    // Stop at markdown or other non-diagram content
    if (line.startsWith('#') || line.startsWith('*') || line.startsWith('-') || line.startsWith('```')) {
      endIndex = i;
      break;
    }
    // Stop if we see a new diagram type (might be multiple diagrams)
    if (i > startIndex + 1 && /^(graph|flowchart|stateDiagram|sequenceDiagram|classDiagram|erDiagram|gantt|pie|journey|gitgraph)/i.test(line)) {
      endIndex = i;
      break;
    }
  }
  
  // Extract the diagram lines
  const diagramLines = lines.slice(startIndex, endIndex);
  let diagramCode = diagramLines.join('\n').trim();
  
  // Clean up: remove any markdown formatting that might have leaked in
  diagramCode = diagramCode
    .replace(/^```mermaid\s*\n?/i, '') // Remove ```mermaid at start
    .replace(/^```\s*\n?/i, '') // Remove ``` at start
    .replace(/\n?```\s*$/i, '') // Remove ``` at end
    .replace(/^\*\*.*?\*\*:?\s*\n?/gm, '') // Remove bold text markers
    .replace(/^#{1,6}\s.*?\n?/gm, '') // Remove markdown headers
    .replace(/^[-*+]\s.*?\n?/gm, '') // Remove list items
    .replace(/^Here['"]s\s+(?:the|a)\s+(?:Mermaid\s+)?(?:diagram|code)[:.]?\s*\n?/i, '') // Remove common prefixes
    .replace(/^The\s+(?:Mermaid\s+)?(?:diagram|code)[:.]?\s*\n?/i, '')
    .trim();
  
  // Final validation: must start with a valid diagram type
  if (!/^(graph|flowchart|stateDiagram|stateDiagram-v2|sequenceDiagram|classDiagram|erDiagram|gantt|pie|journey|gitgraph|architecture-beta|block-beta)\s/i.test(diagramCode)) {
    return null;
  }
  
  return diagramCode;
};


export const AIChat: React.FC<AIChatProps> = ({ onClose, initialMessage }) => {
  const [input, setInput] = useState("");
  // Initialize with responsive height (30vh or 400px, whichever is smaller) + 100px
  const [chatHeight, setChatHeight] = useState(() => {
    const viewportHeight = window.innerHeight;
    return Math.min(viewportHeight * 0.3, 400) + 100;
  });
  const [isResizing, setIsResizing] = useState(false);
  const setEditorText = useAppStore((state) => state.setEditorText);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitialMessage = useRef(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai",
    }),
    onFinish: ({ message }) => {
      // When AI finishes responding, update the editor with the response
      if (message.parts && message.parts.length > 0) {
        const responseText = message.parts
          .filter((part: any) => part.type === "text")
          .map((part: any) => part.text)
          .join("\n");
        
        // Extract and clean Mermaid code from the response
        const mermaidCode = extractMermaidCode(responseText);
        
        if (mermaidCode) {
          setEditorText(mermaidCode);
        }
        // If no valid Mermaid code found, don't update the editor
        // (The user can see the response in the chat and manually copy it)
      }
    },
  });

  // Send initial message if provided
  useEffect(() => {
    if (initialMessage && !hasSentInitialMessage.current && messages.length === 0) {
      hasSentInitialMessage.current = true;
      sendMessage({ text: initialMessage });
    }
  }, [initialMessage, sendMessage, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const handleMouseMove = (e: MouseEvent) => {
      const viewportHeight = window.innerHeight;
      const maxHeight = viewportHeight * 0.8; // 80vh max
      const minHeight = 200; // Minimum height
      
      // Calculate new height from bottom (since chat is at bottom)
      const newHeight = viewportHeight - e.clientY;
      
      // Clamp between min and max
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setChatHeight(newHeight);
      } else if (newHeight < minHeight) {
        setChatHeight(minHeight);
      } else if (newHeight > maxHeight) {
        setChatHeight(maxHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <Box
      className="nfont"
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: `${chatHeight}px`,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1a1a1a",
        borderTop: "1px solid",
        borderColor: "divider",
        zIndex: 1000,
        transition: isResizing ? "none" : "height 0.2s ease",
      }}
    >
      {/* Resize Handle */}
      <Box
        onMouseDown={handleResizeStart}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8px",
          cursor: "row-resize",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
          transition: "background-color 0.2s",
          zIndex: 1001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::before": {
            content: '""',
            width: "40px",
            height: "3px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "2px",
            transition: "background-color 0.2s",
          },
          "&:hover::before": {
            backgroundColor: "rgba(255, 255, 255, 0.4)",
          },
        }}
      />
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          pt: 1.5, // Add padding top to account for resize handle
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ fontSize: "0.875rem", color: "text.secondary", ml: 1 }}>
          AI Assistant
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "text.secondary" }}>
          <X size={18} />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              mt: 2,
            }}
          >
            {/* Suggestion Buttons */}
            <SuggestionButtons
              suggestions={SUGGESTIONS}
              onSelect={setInput}
              layout="grid"
            />
            
            {/* Prompt Text */}
            <Box
              sx={{
                textAlign: "center",
                color: "text.secondary",
                fontSize: "0.875rem",
              }}
            >
              Ask me to create or modify a Mermaid diagram!
            </Box>
          </Box>
        ) : (
          messages.map((message) => (
            <Paper
              key={message.id}
              elevation={0}
              sx={{
                p: 1.5,
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                backgroundColor:
                  message.role === "user"
                    ? "rgba(25, 118, 210, 0.1)"
                    : "rgba(255, 255, 255, 0.05)",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  mb: 0.5,
                  color: "#9AA0A6",
                  fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
                  letterSpacing: "0.01em",
                }}
              >
                {message.role === "user" ? "You" : "AI"}
              </Box>
              {message.parts?.map((part, index) => {
                if (part.type === "text") {
                  // Parse text for code blocks
                  const text = part.text;
                  const codeBlockRegex = /```(?:mermaid)?\s*\n?([\s\S]*?)```/g;
                  const parts: Array<{ type: "text" | "code"; content: string }> = [];
                  let lastIndex = 0;
                  let match;

                  while ((match = codeBlockRegex.exec(text)) !== null) {
                    // Add text before code block
                    if (match.index > lastIndex) {
                      const beforeText = text.substring(lastIndex, match.index);
                      if (beforeText.trim()) {
                        parts.push({ type: "text", content: beforeText });
                      }
                    }
                    // Add code block
                    parts.push({ type: "code", content: match[1].trim() });
                    lastIndex = match.index + match[0].length;
                  }

                  // Add remaining text
                  if (lastIndex < text.length) {
                    const remainingText = text.substring(lastIndex);
                    if (remainingText.trim()) {
                      parts.push({ type: "text", content: remainingText });
                    }
                  }

                  // If no code blocks found, treat entire text as regular text
                  if (parts.length === 0) {
                    parts.push({ type: "text", content: text });
                  }

                  return (
                    <Box
                      key={index}
                      sx={{
                        fontSize: "14px",
                        color: "#E8EAED",
                        whiteSpace: "pre-wrap",
                        fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
                        lineHeight: "20px",
                        letterSpacing: "0.01em",
                        fontWeight: 400,
                      }}
                    >
                      {parts.map((item, itemIndex) => {
                        if (item.type === "code") {
                          return (
                            <Box
                              key={itemIndex}
                              className="code code-font"
                              component="pre"
                              sx={{
                                margin: 0,
                                fontFamily: "inherit",
                              }}
                            >
                              {item.content}
                            </Box>
                          );
                        }
                        return (
                          <span key={itemIndex}>{item.content}</span>
                        );
                      })}
                    </Box>
                  );
                }
                return null;
              })}
            </Paper>
          ))
        )}
        {status === "streaming" && (
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              alignSelf: "flex-start",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                fontSize: "14px",
                color: "#9AA0A6",
                fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
                fontWeight: 400,
                lineHeight: "20px",
                letterSpacing: "0.01em",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <span>AI is typing</span>
              <Box
                sx={{
                  display: "inline-flex",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((index) => (
                  <Box
                    key={index}
                    sx={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: "#9AA0A6",
                      animation: `${typingAnimation} 1.4s infinite`,
                      animationDelay: `${index * 0.2}s`,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Form */}
      <Box
        sx={{
          p: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <InputBox
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder="Type your message..."
          disabled={status === "streaming"}
          multiline
          rows={2}
          buttonText="Send"
          buttonPosition="inside"
        />
      </Box>
    </Box>
  );
};

