import { Box, TextField, Button, IconButton } from "@mui/material";
import { Send } from "lucide-react";

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  buttonText?: string;
  buttonPosition?: "inline" | "inside";
  size?: "small" | "medium";
  showIconButton?: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Type your message...",
  disabled = false,
  multiline = false,
  rows = 2,
  buttonText = "Create",
  buttonPosition = "inside",
  size = "medium",
  showIconButton = false,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !multiline) {
      e.preventDefault();
      onSubmit();
    } else if (e.key === "Enter" && !e.shiftKey && multiline) {
      e.preventDefault();
      onSubmit();
    }
  };

  const isInline = buttonPosition === "inline";

  return (
    <Box
      component={isInline ? "form" : "div"}
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
      sx={{
        display: "flex",
        gap: isInline ? 1 : 0,
        alignItems: isInline ? "center" : "flex-start",
        position: "relative",
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        size={size}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: multiline ? "12px" : "8px",
            paddingRight: buttonPosition === "inside" && !multiline ? "48px" : buttonPosition === "inside" && multiline ? "100px" : undefined,
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: multiline ? "12px" : "8px",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
          },
          "& .MuiInputBase-input": {
            color: "#E8EAED",
            fontSize: "14px",
            fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
            fontWeight: 400,
            lineHeight: "20px",
            letterSpacing: "0.01em",
            "&::placeholder": {
              color: "#9AA0A6",
              opacity: 1,
            },
          },
        }}
      />
      {buttonPosition === "inline" && showIconButton ? (
        <IconButton
          type="submit"
          disabled={disabled || !value.trim()}
          sx={{
            color: "primary.main",
            "&:disabled": {
              color: "text.disabled",
            },
          }}
        >
          <Send size={18} />
        </IconButton>
      ) : buttonPosition === "inside" ? (
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          startIcon={multiline ? <Send size={18} /> : undefined}
          sx={{
            position: "absolute",
            bottom: multiline ? "8px" : "50%",
            right: "8px",
            transform: multiline ? "none" : "translateY(-50%)",
            minWidth: "auto",
            padding: multiline ? "6px 16px" : "4px 8px",
            borderRadius: "8px",
            textTransform: "none",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            "&:disabled": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "text.disabled",
            },
          }}
        >
          {multiline ? buttonText : <Send size={18} />}
        </Button>
      ) : null}
    </Box>
  );
};

