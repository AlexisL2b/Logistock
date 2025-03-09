import React from "react"
import { Box } from "@mui/material"
import LoginForm from "./LoginForm"
import BackgroundImage from "../../../../src/assets/FirstPage.jpg"
import LogoImage from "../../../../src/assets/logo_psl-1-300x300.png"

export default function LoginPage() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background: `url(${BackgroundImage}) rgba(0, 0, 0, 0.872)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Assombrit l'image de fond
          backdropFilter: "blur(5px)",
          zIndex: -1,
        },
      }}
    >
      <Box>
        <img
          src={LogoImage}
          alt="Logo"
          style={{ width: "100%", height: "auto" }}
        />
      </Box>

      {/* Conteneur du formulaire */}
      <Box>
        <LoginForm />
      </Box>
    </Box>
  )
}
