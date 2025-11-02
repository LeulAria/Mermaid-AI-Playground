import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  theme?: string;
  height?: string;
  editorRef?: React.MutableRefObject<any>;
  onEditorReady?: (editor: any) => void;
}

// Register Mermaid language definition
const registerMermaidLanguage = (monaco: any) => {
  if (monaco.languages.getLanguages().find((lang: any) => lang.id === "mermaid")) {
    return; // Already registered
  }

  monaco.languages.register({ id: "mermaid" });

  monaco.languages.setMonarchTokensProvider("mermaid", {
    tokenizer: {
      root: [
        // Comments
        [/%%.*$/, "comment"],
        
        // Participant declarations MUST come before the general keyword rule
        // Match: participant Name as Alias (more specific, so it comes first)
        [/\b(participant)\s+(\w+)\s+as\s+([^\s:,\n]+)/, ["keyword", "participant", "keyword", "alias"]],
        // Match: participant Name
        [/\b(participant)\s+(\w+)/, ["keyword", "participant"]],
        
        // Diagram type keywords
        [
          /\b(graph|flowchart|stateDiagram|stateDiagram-v2|sequenceDiagram|classDiagram|erDiagram|gantt|pie|journey|gitgraph|architecture-beta|block-beta|block|flowchart-v2|flowchart-elk)\b/,
          "keyword",
        ],
        
        // Direction keywords
        [/TD|LR|TB|BT|RL/, "keyword"],
        
        // Configuration keywords (activate, deactivate, alt, opt, loop, note, over, etc.)
        // Note: "participant" is handled above in participant declarations
        [
          /\b(activate|deactivate|alt|opt|par|loop|note|over|critical|break|rect|title|dateFormat|section|as)\b/,
          "keyword",
        ],
        
        // Participant names before arrows (must come first to avoid conflicts)
        [/^(\s*)(\w+)(\s*)(-->>|->>|-->|--->|==>|==>>|-.->|--\|>)/, ["", "participant", "", "arrow"]],
        [/(\w+)(\s*)(-->>|->>|-->|--->|==>|==>>|-.->|--\|>)/, ["participant", "", "arrow"]],
        
        // Arrow with participant after arrow: -->>Participant or -->>Participant: or -->Participant
        [/(-->>|->>|-->|--->|==>|==>>|-.->|--\|>)(\s*)(\w+)/, ["arrow", "", "participant-after-arrow"]],
        
        // Function-like messages with parentheses (e.g., PlaceOrder(...), CheckStock(...))
        [/(\w+)\s*\(/, ["function", ""]],
        
        // Arguments within parentheses
        [/\(\s*([^)]+)\s*\)/, ["", "argument"]],
        
        // Node shapes
        [/\[.*?\]/, "string"],
        [/\(.*?\)/, "string"],
        [/\{.*?\}/, "string"],
        [/\[.*?\|.*?\]/, "string"],
        [/\(.*?\|.*?\)/, "string"],
        
        // Labels on edges
        [/\|.*?\|/, "string"],
        
        // Special nodes
        [/\[\*\]/, "keyword"],
        
        // Numbers
        [/\d+/, "number"],
        
        // Strings/quoted text
        [/"[^"]*"/, "string"],
        [/'[^']*'/, "string"],
        
        // Message text/labels after arrows (before colon or end of line)
        [/:\s*([^\n,]+)/, ["", "message"]],
        
        // Default text
        [/.+/, "variable"],
      ],
    },
  });

  // Define theme colors for Mermaid
  monaco.editor.defineTheme("mermaid-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "569cd6", fontWeight: "500" },
      { token: "operator", foreground: "d4d4d4", fontWeight: "300" },
      { token: "arrow", foreground: "87ceeb", fontWeight: "300" }, // Light sky blue
      { token: "string", foreground: "ce9178", fontWeight: "400" },
      { token: "comment", foreground: "6a9955", fontStyle: "italic", fontWeight: "300" },
      { token: "number", foreground: "b5cea8", fontWeight: "300" },
      { token: "variable", foreground: "cccccc", fontWeight: "300" },
      { token: "participant", foreground: "4ec9b0", fontWeight: "500" },
      { token: "participant-after-arrow", foreground: "4ec9b0", fontWeight: "500" },
      { token: "activation", foreground: "9cdcfe", fontWeight: "500" },
      { token: "function", foreground: "dcdcaa", fontWeight: "500" },
      { token: "argument", foreground: "9cdcfe", fontWeight: "300" },
      { token: "alias", foreground: "9cdcfe", fontWeight: "300" },
      { token: "message", foreground: "ce9178", fontWeight: "300" },
    ],
    colors: {
      "editor.background": "#101010",
      "editor.foreground": "#cccccc",
    },
  });
};

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value = "",
  onChange,
  language = "mermaid",
  theme = "mermaid-dark",
  height = "100%",
  editorRef: externalEditorRef,
  onEditorReady,
}) => {
  const internalEditorRef = useRef<any>(null);
  const editorRef = externalEditorRef || internalEditorRef;

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    if (onEditorReady) {
      onEditorReady(editor);
    }
  };

  return (
    <Editor
      height={height}
      language={language}
      theme={theme}
      value={value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      beforeMount={(monaco) => {
        // Register language before editor mounts
        registerMermaidLanguage(monaco);
      }}
      options={{
        fontSize: 12,
        fontWeight: "400",
        fontFamily: '"Geist Mono", "Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
        fontLigatures: true,
        minimap: { enabled: false },
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        renderWhitespace: "selection",
        wordWrap: "on",
        bracketPairColorization: { enabled: true },
        padding: { top: 10, bottom: 10 },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
      }}
    />
  );
};

