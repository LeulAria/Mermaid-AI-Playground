import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Fab,
  Tooltip,
  Button,
  keyframes,
} from "@mui/material";
import { Copy, Check, Undo, Redo, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { MonacoEditor } from "@/components/monaco-editor";
import { useAppStore } from "@/store/appStore";
import { AIChat } from "@/components/ai-chat";
import { ExampleDialog } from "@/components/example-dialog";
import { CreateDiagramModal } from "@/components/create-diagram-modal";
import { indigo } from "@mui/material/colors";

const DRAWER_PERCENTAGE = 0.35; // 35% of viewport width (default)
const MIN_DRAWER_WIDTH = 200;
const MAX_DRAWER_PERCENTAGE = 0.6; // 60% of viewport width (max)

// Gradient animation for shiny button effect
const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Shimmer animation for shiny button effect
const shimmerAnimation = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

export const Route = createFileRoute("/playground/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const editorText = useAppStore((state) => state.editorText);
  const setEditorText = useAppStore((state) => state.setEditorText);
  const pushToHistory = useAppStore((state) => state.pushToHistory);
  const undo = useAppStore((state) => state.undo);
  const redo = useAppStore((state) => state.redo);
  const undoStack = useAppStore((state) => state.undoStack);
  const redoStack = useAppStore((state) => state.redoStack);
  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  // Calculate 35% of viewport width (default)
  const calculateDrawerWidth = () => {
    const maxWidth = window.innerWidth * MAX_DRAWER_PERCENTAGE;
    return Math.max(
      MIN_DRAWER_WIDTH,
      Math.min(maxWidth, window.innerWidth * DRAWER_PERCENTAGE)
    );
  };

  // Calculate max drawer width based on viewport
  const getMaxDrawerWidth = () => {
    return window.innerWidth * MAX_DRAWER_PERCENTAGE;
  };

  const [drawerWidth, setDrawerWidth] = useState(calculateDrawerWidth());
  const [isResizing, setIsResizing] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<any>(null);
  const isUndoRedoRef = useRef(false);
  const lastEditorTextRef = useRef(editorText);
  const [showExamples, setShowExamples] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(true); // Open on initial load
  const [initialAIMessage, setInitialAIMessage] = useState<string | undefined>(undefined);
  const hasMermaidError = useAppStore((state) => state.hasMermaidError);
  const mermaidErrorMessage = useAppStore((state) => state.mermaidErrorMessage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorText);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Failed to copy text");
    }
  };

  const handleUndo = () => {
    if (editorRef.current) {
      try {
        isUndoRedoRef.current = true;
        const previousText = undo();
        if (previousText !== null) {
          // Update Monaco editor with the previous text
          const model = editorRef.current.getModel();
          if (model) {
            editorRef.current.pushUndoStop(); // Prevent this change from being undoable
            model.pushEditOperations(
              [],
              [
                {
                  range: model.getFullModelRange(),
                  text: previousText,
                },
              ],
              () => null
            );
            editorRef.current.pushUndoStop();
            lastEditorTextRef.current = previousText;
          }
        }
        // Reset flag after a short delay to allow onChange to process
        setTimeout(() => {
          isUndoRedoRef.current = false;
        }, 100);
      } catch (error) {
        console.error("Failed to undo:", error);
        isUndoRedoRef.current = false;
      }
    }
  };

  const handleRedo = () => {
    if (editorRef.current) {
      try {
        isUndoRedoRef.current = true;
        const nextText = redo();
        if (nextText !== null) {
          // Update Monaco editor with the next text
          const model = editorRef.current.getModel();
          if (model) {
            editorRef.current.pushUndoStop(); // Prevent this change from being undoable
            model.pushEditOperations(
              [],
              [
                {
                  range: model.getFullModelRange(),
                  text: nextText,
                },
              ],
              () => null
            );
            editorRef.current.pushUndoStop();
            lastEditorTextRef.current = nextText;
          }
        }
        // Reset flag after a short delay to allow onChange to process
        setTimeout(() => {
          isUndoRedoRef.current = false;
        }, 100);
      } catch (error) {
        console.error("Failed to redo:", error);
        isUndoRedoRef.current = false;
      }
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || "";
    
    // If this change is from undo/redo, just sync the store without pushing to history
    if (isUndoRedoRef.current) {
      setEditorText(newValue);
      lastEditorTextRef.current = newValue;
      return;
    }
    
    // If text hasn't actually changed, skip
    if (newValue === lastEditorTextRef.current) {
      return;
    }
    
    // This is a user change - push to history
    pushToHistory(newValue);
    lastEditorTextRef.current = newValue;
  };

  const handleEditorReady = (editor: any) => {
    editorRef.current = editor;
    lastEditorTextRef.current = editor.getValue();
  };

  // Sync lastEditorTextRef when editorText changes from external sources (examples, AI, etc.)
  useEffect(() => {
    if (editorText !== lastEditorTextRef.current && !isUndoRedoRef.current) {
      lastEditorTextRef.current = editorText;
    }
  }, [editorText]);

  // Update drawer width when window resizes (only when drawer is open)
  useEffect(() => {
    const handleResize = () => {
      if (!isResizing && sidebarOpen) {
        setDrawerWidth(calculateDrawerWidth());
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isResizing, sidebarOpen]);

  const handleDrawerToggle = () => {
    toggleSidebar();
  };

  const handleSelectExample = (mermaidCode: string) => {
    pushToHistory(mermaidCode);
  };

  const handleFixBug = () => {
    if (!editorText.trim()) return;
    
    // Create the fix bug message with the current editor content and error message
    const fixMessage = `I have a Mermaid diagram with an error. Please fix the syntax errors and return only the corrected, complete, and valid Mermaid code. Do not include any explanations or markdown formatting - only return the fixed Mermaid code.

Current code with error:
\`\`\`mermaid
${editorText}
\`\`\`

${mermaidErrorMessage ? `Error message: ${mermaidErrorMessage}` : ""}

Please fix all syntax errors and return a complete, valid Mermaid diagram.`;
    
    // Set the initial message and open the AI chat
    setInitialAIMessage(fixMessage);
    setShowAIChat(true);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      const maxWidth = getMaxDrawerWidth();
      if (newWidth >= MIN_DRAWER_WIDTH && newWidth <= maxWidth) {
        setDrawerWidth(newWidth);
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar
        position="relative"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <Box
              component="svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 12h18" />
              <path d="M3 6h18" />
              <path d="M3 18h18" />
            </Box>
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontSize: "0.8rem", fontWeight: 600 }} noWrap component="div">
              Mermaid Playground
            </Typography>
            <Tooltip title="Copy editor content" arrow>
              <Button
                onClick={handleCopy}
                startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                sx={{
                  px: 2,
                  textSize: "0.68rem",
                  borderRadius: "25px",
                  textTransform: "none",
                  color: "text.primary",
                  borderColor: "divider",
                }}
              >
                <span className="capitalize font-[500] text-[0.75rem]">
                Copy Editor
                </span>
              </Button>
            </Tooltip>
            <Tooltip title="Open examples showcase" arrow>
              <IconButton
                onClick={() => setShowExamples(true)}
                sx={{
                  color: "text.primary",
                }}
              >
                <FolderOpen size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Undo" arrow>
              <span>
                <IconButton
                  onClick={handleUndo}
                  disabled={!canUndo}
                  sx={{
                    color: "text.primary",
                    "&:disabled": {
                      color: "text.disabled",
                    },
                  }}
                >
                  <Undo size={18} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo" arrow>
              <span>
                <IconButton
                  onClick={handleRedo}
                  disabled={!canRedo}
                  sx={{
                    color: "text.primary",
                    "&:disabled": {
                      color: "text.disabled",
                    },
                  }}
                >
                  <Redo size={18} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Box
            component="a"
            href="https://www.buymeacoffee.com/leularia"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: "25px",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            <Box
              component="img"
              src="public/buyme-cofee.svg"
              alt="Buy Me A Coffee"
              sx={{
                borderRadius: "25px",
                height: "38px",
                width: "172px",
                display: "block",
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Drawer
          variant="persistent"
          open={sidebarOpen}
          sx={{
            width: sidebarOpen ? drawerWidth : 0,
            flexShrink: 0,
            transition: isResizing ? "none" : "width 0.2s ease",
            "& .MuiDrawer-paper": {
              width: sidebarOpen ? drawerWidth : 0,
              boxSizing: "border-box",
              height: "100%",
              position: "relative",
              transition: isResizing ? "none" : "width 0.2s ease",
              display: sidebarOpen ? "flex" : "none",
              flexDirection: "column",
              overflow: "hidden",
            },
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              position: "relative",
            }}
          >
            <MonacoEditor
              value={editorText}
              onChange={handleEditorChange}
              language="mermaid"
              theme="mermaid-dark"
              height="100%"
              editorRef={editorRef}
              onEditorReady={handleEditorReady}
            />

            {/* Use AI FAB Button */}
            {!showAIChat && (
              <Fab
                variant="extended"
                size="medium"
                onClick={() => setShowAIChat(true)}
                sx={{
                  position: "absolute",
                  bottom: '15px',
                  right: hasMermaidError ? 140 : 20,
                  backgroundColor: indigo[400],
                  color: "white",
                  transition: "right 0.2s ease",
                  "&:hover": {
                    backgroundColor: indigo[500],
                  },
                }}
              >
                <Box
                  component="svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  sx={{ mr: 1 }}
                >
                  <path d="M10 14l-2.5 5 5-2.5 5 2.5-2.5-5 2.5-5-5 2.5-5-2.5 2.5 5z" />
                  <path
                    d="M17 5l-1.5 3 3-1.5 3 1.5-1.5-3 1.5-3-3 1.5-3-1.5 1.5 3z"
                    transform="translate(-5 0)"
                  />
                </Box>
                <span className="capitalize font-[400]">Generate with AI</span>
              </Fab>
            )}

            {/* Fix Bug FAB Button - Always visible when there's an error, above chat */}
            {hasMermaidError && (
              <Tooltip title="Fix Bug Using AI" arrow placement="left">
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1002,
                  }}
                >
                  <Fab
                    variant="extended"
                    size="medium"
                    onClick={handleFixBug}
                    sx={{
                      position: "absolute",
                      bottom: '15px',
                      right: 20,
                      backgroundColor: "#ff6b6b",
                      color: "#ffffff",
                      "&:hover": {
                        backgroundColor: "#ff5252",
                      },
                    }}
                  >
                    <Box
                      component="svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      xmlns="http://www.w3.org/2000/svg"
                      sx={{ mr: 1 }}
                    >
                      <path d="M12 21c6 0 7-5.234 7-7V7H5v7c0 1.725 1 7 7 7Z" />
                      <path d="m2 4 3 3" />
                      <path d="m22 4-3 3" />
                      <path d="M2 13.5h3" />
                      <path d="M22 13.5h-3" />
                      <path d="m3.5 22 3-3" />
                      <path d="m20.5 22-3-3" />
                      <path d="M12 21V7" />
                      <path d="M7.46 19.52C8.501 20.392 9.962 21 12 21c2.056 0 3.524-.614 4.567-1.493" />
                      <path d="M16 6.167C16 3.865 14.21 2 12 2S8 3.865 8 6.167V7h8v-.833Z" />
                    </Box>
                    <span className="capitalize font-[400]">Fix Bug</span>
                  </Fab>
                </Box>
              </Tooltip>
            )}

            {/* AI Chat Interface */}
            {showAIChat && (
              <AIChat
                onClose={() => {
                  setShowAIChat(false);
                  setInitialAIMessage(undefined);
                }}
                initialMessage={initialAIMessage}
              />
            )}
          </Box>
          {/* Resize handle */}
          {sidebarOpen && (
            <Box
              onMouseDown={handleResizeStart}
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "8px",
                cursor: "col-resize",
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
                  width: "3px",
                  height: "40px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "2px",
                  transition: "background-color 0.2s",
                },
                "&:hover::before": {
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                },
              }}
            />
          )}
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "auto",
            height: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Box>
      
      {/* Example Dialog */}
      <ExampleDialog
        open={showExamples}
        onClose={() => setShowExamples(false)}
        onSelectExample={handleSelectExample}
      />

      {/* Create Diagram Modal */}
      <CreateDiagramModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(text) => {
          setInitialAIMessage(text);
          setShowAIChat(true);
          setShowCreateModal(false);
        }}
      />
    </Box>
  );
}
