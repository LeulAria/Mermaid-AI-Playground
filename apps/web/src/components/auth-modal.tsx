import React from "react";
import { Dialog, DialogContent, Box, Typography, IconButton, Button, Divider } from "@mui/material";
import { X } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { authClient } from "@/lib/auth-client";

export const AuthModal: React.FC = () => {
  const authModalOpen = useAppStore((s) => s.authModalOpen);
  const setAuthModalOpen = useAppStore((s) => s.setAuthModalOpen);

  const onClose = () => setAuthModalOpen(false);

  const signInWith = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({ provider });
      setAuthModalOpen(false);
    } catch (e) {
      // Fallback to route redirect if client API is unavailable
      try {
        window.location.href = `/api/auth/${provider}`;
      } catch {}
    }
  };

  return (
    <Dialog
      open={authModalOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "#0D0D0D",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
        },
      }}
      slotProps={{
        backdrop: {
          sx: { background: "#0009", backdropFilter: "blur(1px)" },
        },
      } as any}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        {/* Header */}
        <Box sx={{
          px: 3,
          pt: 3,
          pb: 2,
        }}>
          <IconButton onClick={onClose} size="small" sx={{ position: "absolute", top: 8, right: 8, color: "#fff9" }}>
          <X size={18} />
        </IconButton>
          <Box sx={{ px:2, mt:5}}>
            <Typography variant="h4" className="nfont" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
              Welcome back
            </Typography>
            <Typography variant="body2" className="nfont" sx={{ color: "#bdbdbd" }}>
              Sign in to continue creating diagrams
            </Typography>
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{ p: 3, px: 4, pt: 1, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {/* Google */}
          <Button
            onClick={() => signInWith("google")}
            variant="contained"
            fullWidth
            sx={{
              textTransform: "none",
              justifyContent: "center",
              borderRadius: 20,
              py: "10px",
              fontSize: "0.82rem",
              fontWeight: 500,
              background: "#ffffff",
              color: "#000000",
              boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
              "&:hover": { background: "#f2f2f2" },
              gap: 1.25,
            }}
          >
            <Box component="span" sx={{ display: "inline-flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M12 11.988v3.822h5.455c-.238 1.24-1.472 3.632-5.455 3.632-3.286 0-5.963-2.718-5.963-6.077s2.677-6.077 5.963-6.077c1.875 0 3.135.793 3.855 1.478l2.625-2.524C17.451 4.7 15.013 3.6 12 3.6 6.962 3.6 2.88 7.69 2.88 12.865c0 5.175 4.082 9.265 9.12 9.265 5.266 0 8.742-3.699 8.742-8.915 0-.6-.066-1.06-.149-1.227H12z"/>
              </svg>
            </Box>
            Continue with Google
          </Button>

          {/* GitHub */}
          <Button
            onClick={() => signInWith("github")}
            variant="outlined"
            fullWidth
            sx={{
              textTransform: "none",
              justifyContent: "center",
              borderRadius: 20,
              py: "10px",
              fontSize: "0.82rem",
              fontWeight: 500,
              borderColor: "rgba(255,255,255,0.16)",
              color: "#ffffff",
              "&:hover": { borderColor: "rgba(255,255,255,0.32)", backgroundColor: "rgba(255,255,255,0.03)" },
              gap: 1.25,
            }}
          >
            <Box component="span" sx={{ display: "inline-flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M12 2C6.475 2 2 6.587 2 12.254c0 4.521 2.865 8.353 6.839 9.709.5.095.682-.218.682-.487 0-.24-.009-.876-.014-1.72-2.782.613-3.369-1.366-3.369-1.366-.455-1.175-1.11-1.488-1.11-1.488-.908-.638.069-.625.069-.625 1.004.072 1.531 1.05 1.531 1.05.892 1.569 2.341 1.116 2.91.853.091-.667.35-1.116.636-1.372-2.222-.258-4.56-1.14-4.56-5.072 0-1.12.389-2.035 1.027-2.752-.103-.259-.445-1.302.098-2.712 0 0 .838-.273 2.745 1.051A9.31 9.31 0 0 1 12 7.77a9.3 9.3 0 0 1 2.504.35c1.907-1.324 2.744-1.05 2.744-1.05.544 1.409.202 2.452.1 2.71.64.718 1.026 1.633 1.026 2.753 0 3.942-2.34 4.812-4.566 5.067.36.32.68.955.68 1.926 0 1.39-.013 2.508-.013 2.85 0 .271.18.586.688.486C19.138 20.603 22 16.772 22 12.254 22 6.587 17.523 2 12 2Z"/>
              </svg>
            </Box>
            Continue with GitHub
          </Button>

          {/* Fine print */}
          <Typography variant="caption" sx={{ color: "#9e9e9e", textAlign: "center", mt: 1.25 }}>
            By continuing, you agree to our
            <Box component="span" sx={{ mx: 0.75 }}>|</Box>
            <a href="/terms" style={{ color: "#cfcfcf", textDecoration: "underline" }}>Terms</a>
            <Box component="span" sx={{ mx: 0.75 }}>|</Box>
            <a href="/privacy" style={{ color: "#cfcfcf", textDecoration: "underline" }}>Privacy</a>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;


