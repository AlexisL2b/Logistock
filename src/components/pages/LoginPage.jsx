import React from "react"
import { Link, Box, Button, TextField, Typography } from "@mui/material"
export default function LoginPage() {
  return (
    <Box
      sx={{
        width: "100vw", // Largeur de la fenêtre entière
        height: "100vh", // Hauteur de la fenêtre entière
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative", // Nécessaire pour que le pseudo-élément se positionne correctement
        overflow: "hidden", // Empêche les débordements éventuels
        "&::before": {
          content: '""', // Nécessaire pour afficher le pseudo-élément
          background: `url('/public/assets/FirstPage/FirstPage.jpg') rgba(0, 0, 0, 0.7)`, // Image et overlay
          backgroundSize: "cover", // Image couvrant tout l'espace
          backgroundPosition: "center", // Image centrée
          backgroundBlendMode: "darken", // Mélange l'image avec la couleur
          position: "absolute", // Nécessaire pour couvrir tout l'écran

          width: "100%",
          height: "100%",
          zIndex: -1, // Place l'image derrière le contenu
        },
      }}
    >
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.1)", // Semi-transparence
          backdropFilter: "blur(10px)", // Effet glassmorphisme
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: 2,
          padding: 4,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          width: 300,
        }}
      >
        <Typography variant="h5" color="primary" gutterBottom>
          Connexion
        </Typography>
        <TextField label="Email" variant="outlined" fullWidth margin="normal" />
        <TextField
          label="Mot de passe"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Link href="#" color="primary" underline="hover">
          Mot de passe oublié ?
        </Link>
        <Button
          variant="contained"
          fullWidth
          sx={{
            marginTop: 2,
            color: "primary.contrastText",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Se connecter
        </Button>
      </Box>
    </Box>
  )
}
