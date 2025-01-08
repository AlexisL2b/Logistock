import React from "react"
import { Link, Box, Button, TextField, Typography } from "@mui/material"
import LoginForm from "./LoginForm"
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
          background: `url('/assets/FirstPage/FirstPage.jpg') rgba(0, 0, 0, 0.7)`, // Image et overlay
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
      <LoginForm />
    </Box>
  )
}
