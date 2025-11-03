import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import { SUGGESTIONS, SuggestionButtons } from "./suggestion-buttons";
import { InputBox } from "./input-box";

interface CreateDiagramModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (text: string) => void;
}

export const CreateDiagramModal: React.FC<CreateDiagramModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [input, setInput] = useState("");

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  const handleCreate = () => {
    if (input.trim()) {
      onCreate(input.trim());
      setInput("");
    }
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          backgroundColor: "#1a1a1a",
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Top Section with Image */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "200px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Box
            component="img"
            src="/image-bg.jpg"
            alt="Background"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.6,
            }}
          />
          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "rgba(255, 255, 255, 0.9)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(4px)",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "#ffffff",
                transform: "scale(1.1)",
              },
              "&:active": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                transform: "scale(0.95)",
              },
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>

        {/* Divider */}
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

        {/* Bottom Section */}
        <Box sx={{ p: 3, backgroundColor: "#1a1a1a" }}>
          <Typography
            variant="h5"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              mb: 1,
              textAlign: "center",
            }}
          >
            Create a Diagram Using Mermaid and AI
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 3,
              textAlign: "center",
            }}
          >
            Choose a template or describe what you'd like to create
          </Typography>

          {/* Suggestion Buttons */}
          <Box
            sx={{
              mb: 3,
            }}
          >
            <SuggestionButtons
              suggestions={SUGGESTIONS}
              onSelect={handleSuggestionClick}
              layout="rows"
            />
          </Box>

          {/* Input Box */}
          <InputBox
            value={input}
            onChange={setInput}
            onSubmit={handleCreate}
            placeholder="Describe the diagram you want to create..."
            multiline
            rows={2}
            buttonText="Create"
            buttonPosition="inside"
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

