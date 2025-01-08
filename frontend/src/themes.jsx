import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    background: {
      default: "#1D1B18", // Couleur la plus sombre (Background 1)
      paper: "#2A2520", // Arrière-plan secondaire (Background 2)
    },
    primary: {
      main: "#FF6A00", // Orange vif pour les composants interactifs (Interactive 5)
      contrastText: "#FFF3E6", // Texte contrastant
    },
    secondary: {
      main: "#FF8C1A", // Orange moyen (Interactive 4)
      contrastText: "#1D1B18", // Texte foncé pour contraste
    },
    text: {
      primary: "#331E0B", // Texte accessible (Accessible text 12)
      secondary: "#FB6A0025", // Texte moins prioritaire (Accessible text 11)
    },
    divider: "#7A5340", // Couleur pour les bordures et séparateurs (Border 7)
    action: {
      active: "#FF6A00", // Orange vif pour les états actifs
      hover: "rgba(255, 106, 0, 0.1)", // Orange avec opacité pour hover
      selected: "rgba(255, 138, 64, 0.2)", // Couleur légèrement plus claire
      disabled: "rgba(255, 255, 255, 0.38)", // État désactivé
      disabledBackground: "rgba(255, 255, 255, 0.12)", // Arrière-plan désactivé
    },
    error: {
      main: "#D32F2F", // Rouge standard pour les erreurs
    },
    warning: {
      main: "#FF9800", // Orange pour les avertissements
    },
    info: {
      main: "#0288D1", // Bleu pour les informations
    },
    success: {
      main: "#4CAF50", // Vert pour les succès
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { color: "#FFF3E6" },
    h2: { color: "#FFF3E6" },
    body1: { color: "#FFB380" },
  },
})

export default theme
