import { Box, TextField, Typography, Button } from "@mui/material"
import React from "react"
import { Link } from "react-router"

export default function LoginForm() {
  return (
    <Box
      sx={{
        background: "rgba(255, 255, 255, 0.1)", // Semi-transparence
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
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderWidth: "2px", // Épaisseur de la bordure
              borderColor: "white", // Couleur de la bordure
            },
            "&:hover fieldset": {
              borderWidth: "2px", // Épaisseur au survol
              borderColor: "secondary.main", // Couleur au survol
            },
            "&.Mui-focused fieldset": {
              borderWidth: "3px", // Épaisseur lorsqu'il est focalisé
              borderColor: "secondary.main", // Couleur lorsqu'il est focalisé
            },
          },
        }}
      />
      <TextField
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderWidth: "2px", // Épaisseur de la bordure
              borderColor: "white", // Couleur de la bordure
            },
            "&:hover fieldset": {
              borderWidth: "2px", // Épaisseur au survol
              borderColor: "secondary.main", // Couleur au survol
            },
            "&.Mui-focused fieldset": {
              borderWidth: "3px", // Épaisseur lorsqu'il est focalisé
              borderColor: "secondary.main", // Couleur lorsqu'il est focalisé
            },
          },
        }}
        label="Mot de passe"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Link to="/passwordforgot"> Mot de passe oublié?</Link>

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
      <Link to="/dashboard"> Vers dashboard</Link>
      <Link to="/signup"> Inscription</Link>
    </Box>
  )
}
