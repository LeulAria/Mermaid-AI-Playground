import React from "react";
import { Box, Tooltip } from "@mui/material";

// Suggestion prompts - shared across components
export const SUGGESTIONS = [
  "Create a sequence diagram for online order placement",
  "Create a state diagram for document approval workflow",
  "Create a class diagram for library management system",
  "Create a mindmap for product launch planning",
];

// Icon component for suggestion buttons
export const SuggestionIcon = () => (
  <Box
    component="svg"
    width={14}
    height={14}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    sx={{ flexShrink: 0 }}
  >
    <path d="M21.647 2.522a.206.206 0 0 0-.155-.16c-2.549-.623-8.438 1.599-11.631 4.79A13.824 13.824 0 0 0 8.31 8.984c-.985-.09-1.969-.014-2.807.352-2.367 1.04-3.055 3.758-3.248 4.925a.422.422 0 0 0 .46.487l3.8-.417c.003.287.02.573.052.858a.85.85 0 0 0 .248.52l1.471 1.471a.85.85 0 0 0 .52.248c.284.032.568.05.853.052l-.416 3.797a.422.422 0 0 0 .487.459c1.167-.188 3.89-.876 4.925-3.242.366-.84.44-1.819.356-2.799a13.775 13.775 0 0 0 1.837-1.55c3.206-3.188 5.413-8.947 4.799-11.623Zm-7.648 7.493a2 2 0 1 1 2.829-2.83 2 2 0 0 1-2.829 2.83v0Z"></path>
    <path d="M5.14 16.5c-.468.057-.903.27-1.236.602C3.078 17.93 3 21 3 21s3.071-.078 3.898-.905c.334-.333.546-.768.602-1.236"></path>
  </Box>
);

interface SuggestionButtonsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  layout?: "grid" | "rows";
}

export const SuggestionButtons: React.FC<SuggestionButtonsProps> = ({
  suggestions,
  onSelect,
  layout = "grid",
}) => {
  if (layout === "grid") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {suggestions.map((suggestion, index) => (
          <Tooltip key={index} title={suggestion} arrow placement="top">
            <Box
              component="button"
              onClick={() => onSelect(suggestion)}
              sx={{
                borderRadius: "30px",
                border: "none",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "text.primary",
                fontSize: "0.75rem",
                padding: "6px 14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                minWidth: 0,
                overflow: "hidden",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {suggestion}
              </Box>
              <SuggestionIcon />
            </Box>
          </Tooltip>
        ))}
      </Box>
    );
  }

  // Rows layout (for create-diagram-modal)
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
      }}
    >
      {[0, 1].map((rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: "flex",
            gap: 1,
            width: "100%",
          }}
        >
          {suggestions.slice(rowIndex * 2, rowIndex * 2 + 2).map((suggestion) => (
            <Tooltip key={suggestion} title={suggestion} arrow placement="top">
              <Box
                component="button"
                onClick={() => onSelect(suggestion)}
                sx={{
                  flex: 1,
                  borderRadius: "30px",
                  border: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "text.primary",
                  fontSize: "0.75rem",
                  padding: "6px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  minWidth: 0,
                  overflow: "hidden",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {suggestion}
                </Box>
                <SuggestionIcon />
              </Box>
            </Tooltip>
          ))}
        </Box>
      ))}
    </Box>
  );
};

