import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Button,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
} from "@mui/material";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/hero-img.jpg')",
      }}
    >
      {/* AppBar */}
      <AppBar
        position="absolute"
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          backdropFilter: "blur(2px)",
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Toolbar
          sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3, md: 4 } }}
        >
          {/* Left Side: Title and Playground Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h6"
              className="nfont"
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "white",
                mr: 2,
              }}
            >
              Mermaid AI
            </Typography>
            <Button
              onClick={() => navigate({ to: "/playground" })}
              className="nfont"
              sx={{
                px: 2,
                borderRadius: "25px",
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: "none",
                color: "white",
                backdropFilter: "blur(8px)",
                "&:hover": {
                  background: "#0001",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  stroke="none"
                  d="M12 13.219a1.219 1.219 0 1 0 0-2.438 1.219 1.219 0 0 0 0 2.438Z"
                ></path>
                <path
                  fill="currentColor"
                  stroke="none"
                  d="M16.219 13.219a1.219 1.219 0 1 0 0-2.438 1.219 1.219 0 0 0 0 2.438Z"
                ></path>
                <path
                  fill="currentColor"
                  stroke="none"
                  d="M7.781 13.219a1.219 1.219 0 1 0 0-2.438 1.219 1.219 0 0 0 0 2.438Z"
                ></path>
                <path d="M7.5 17.25 1.5 12l6-5.25"></path>
                <path d="m16.5 17.25 6-5.25-6-5.25"></path>
              </svg>
              <span className="ml-2">Playground</span>
            </Button>
          </Box>

          {/* Right Side: GitHub and Buy Me Coffee */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* GitHub Icon Button */}
            <IconButton
              component="a"
              href="https://github.com/LeulAria/Mermaid-AI-Playground"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "white",
                backgroundColor: "#FFF1",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                transition: "all 0.2s ease-in-out",
                width: 40,
                height: 40,
              }}
            >
              <Box
                component="svg"
                width={20}
                height={20}
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 1.5C6.202 1.5 1.5 6.323 1.5 12.267c0 4.758 3.01 8.79 7.181 10.214a.82.82 0 0 0 .178.019c.39 0 .54-.286.54-.534 0-.258-.01-.933-.015-1.833a4.802 4.802 0 0 1-1.059.126c-2.02 0-2.48-1.57-2.48-1.57-.478-1.242-1.167-1.575-1.167-1.575-.914-.642-.005-.66.066-.66h.004c1.055.093 1.608 1.115 1.608 1.115.525.919 1.228 1.176 1.857 1.176a2.953 2.953 0 0 0 1.2-.28c.093-.695.365-1.168.665-1.44-2.33-.272-4.781-1.195-4.781-5.32 0-1.177.408-2.138 1.078-2.888-.108-.272-.469-1.369.103-2.85a.874.874 0 0 1 .235-.023c.38 0 1.237.145 2.653 1.13a9.76 9.76 0 0 1 5.259 0c1.416-.985 2.273-1.13 2.653-1.13a.873.873 0 0 1 .235.023c.571 1.481.21 2.578.103 2.85.67.755 1.078 1.716 1.078 2.888 0 4.134-2.456 5.043-4.796 5.31.375.333.713.99.713 1.993 0 1.439-.014 2.601-.014 2.953 0 .253.145.539.534.539a.9.9 0 0 0 .188-.019c4.176-1.425 7.181-5.46 7.181-10.214C22.5 6.323 17.798 1.5 12 1.5Z" />
              </Box>
            </IconButton>

            {/* Buy Me Coffee Button */}
            <Button
              component="a"
              href="https://www.buymeacoffee.com/leularia"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                minWidth: "auto",
                padding: 0,
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <img
                src="/white-button.png"
                alt="Buy Me a Coffee"
                style={{
                  height: "38px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/95" />

      {/* Hero Content - Centered */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Hero Content */}
            <div className="max-w-3xl space-y-6">
              {/* Main Heading */}
              <h1 className="nfont tracking-tight text-xl sm:text-4xl lg:text-5xl mb-2 font-[700] text-white leading-tight tracking-tight">
                Mermaid AI Diagrams
              </h1>

              {/* Description */}
              <p className="nfont tracking-tight text-base sm:text-lg text-gray-200/90 max-w-xl mx-auto font-[400] leading-relaxed">
                Transform your ideas into stunning flowcharts, sequence
                diagrams, class diagrams, and more with our AI-powered Mermaid
                diagram generator.
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    navigate({
                      to: "/playground",
                    });
                  }}
                  className="nfont"
                  sx={{
                    borderRadius: "30px",
                    paddingX: "40px",
                    paddingY: "9px",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    fontFamily:
                      '"Geist", "Inter", ui-sans-serif, system-ui, sans-serif',
                    textTransform: "none",
                    background: "#FFFFFF",
                    color: "#000000",
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
                    "&:hover": {
                      background: "#F5F5F5",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  Get Started
                </Button>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
                <div className="nfont rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-sm">
                  Flowcharts
                </div>
                <div className="nfont rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-sm">
                  Sequence Diagrams
                </div>
                <div className="nfont rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-sm">
                  Class Diagrams
                </div>
                <div className="nfont rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-sm">
                  And More
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
