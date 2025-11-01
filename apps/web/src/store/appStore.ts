import { produce } from "immer";
import { create } from "zustand";
import {
  combine,
  createJSONStorage,
  devtools,
  persist,
} from "zustand/middleware";

export interface AppState {
  // Theme state
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;

  // Editor state
  editorText: string;
  setEditorText: (text: string) => void;

  // Undo/Redo state
  undoStack: string[];
  redoStack: string[];
  pushToHistory: (text: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;

  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Error state
  hasMermaidError: boolean;
  mermaidErrorMessage: string | null;
  setMermaidError: (hasError: boolean, errorMessage?: string) => void;
}

const MAX_HISTORY_SIZE = 10;
const initialEditorText = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`;

const initialState: AppState = {
  theme: "dark",
  setTheme: (_theme: "light" | "dark") => {},
  editorText: initialEditorText,
  setEditorText: (_text: string) => {},
  undoStack: [],
  redoStack: [],
  pushToHistory: (_text: string) => {},
  undo: () => null,
  redo: () => null,
  canUndo: () => false,
  canRedo: () => false,
  clearHistory: () => {},
  sidebarOpen: true,
  setSidebarOpen: (_open: boolean) => {},
  toggleSidebar: () => {},
  hasMermaidError: false,
  mermaidErrorMessage: null,
  setMermaidError: (_hasError: boolean, _errorMessage?: string) => {},
};

const STORE_NAME = "mermaid-playground-store";

export const useAppStore = create(
  devtools(
    persist(
      combine(initialState, (set, get) => ({
        setTheme: (theme: "light" | "dark") => {
          set(
            produce((state: AppState) => {
              state.theme = theme;
            }),
          );
        },
        setEditorText: (text: string) => {
          set(
            produce((state: AppState) => {
              state.editorText = text;
            }),
          );
        },
        pushToHistory: (text: string) => {
          set(
            produce((state: AppState) => {
              // Don't push if text is the same as current
              if (state.editorText === text) {
                return;
              }
              
              // Push current text to undo stack before updating
              if (state.editorText !== undefined && state.editorText !== null) {
                state.undoStack.push(state.editorText);
                
                // Limit undo stack to MAX_HISTORY_SIZE (remove oldest items)
                if (state.undoStack.length > MAX_HISTORY_SIZE) {
                  state.undoStack.shift(); // Remove oldest
                }
              }
              
              // Clear redo stack when new change is made
              state.redoStack = [];
              
              // Update editor text
              state.editorText = text;
            }),
          );
        },
        undo: () => {
          let previousText: string | null = null;
          set(
            produce((state: AppState) => {
              if (state.undoStack.length > 0) {
                // Move current text to redo stack
                state.redoStack.push(state.editorText);
                
                // Limit redo stack to MAX_HISTORY_SIZE
                if (state.redoStack.length > MAX_HISTORY_SIZE) {
                  state.redoStack.shift();
                }
                
                // Pop from undo stack (LIFO)
                previousText = state.undoStack.pop() || null;
                
                if (previousText !== null) {
                  state.editorText = previousText;
                }
              }
            }),
          );
          return previousText;
        },
        redo: () => {
          let nextText: string | null = null;
          set(
            produce((state: AppState) => {
              if (state.redoStack.length > 0) {
                // Move current text to undo stack
                state.undoStack.push(state.editorText);
                
                // Limit undo stack to MAX_HISTORY_SIZE
                if (state.undoStack.length > MAX_HISTORY_SIZE) {
                  state.undoStack.shift();
                }
                
                // Pop from redo stack (LIFO)
                nextText = state.redoStack.pop() || null;
                
                if (nextText !== null) {
                  state.editorText = nextText;
                }
              }
            }),
          );
          return nextText;
        },
        canUndo: () => {
          const state = get();
          return state.undoStack.length > 0;
        },
        canRedo: () => {
          const state = get();
          return state.redoStack.length > 0;
        },
        clearHistory: () => {
          set(
            produce((state: AppState) => {
              state.undoStack = [];
              state.redoStack = [];
            }),
          );
        },
        setSidebarOpen: (open: boolean) => {
          set(
            produce((state: AppState) => {
              state.sidebarOpen = open;
            }),
          );
        },
        toggleSidebar: () => {
          set(
            produce((state: AppState) => {
              state.sidebarOpen = !state.sidebarOpen;
            }),
          );
        },
        setMermaidError: (hasError: boolean, errorMessage?: string) => {
          set(
            produce((state: AppState) => {
              state.hasMermaidError = hasError;
              state.mermaidErrorMessage = errorMessage || null;
            }),
          );
        },
      })),
      {
        name: STORE_NAME,
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

