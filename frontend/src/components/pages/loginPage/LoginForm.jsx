import { Box, TextField, Typography, Button } from "@mui/material"
import React, { useState } from "react"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { setUser } from "../../../redux/slices/authSlice"
import axiosInstance from "../../../axiosConfig"
import { saveToLocalStorage } from "../../../utils/localStorage"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true } // 🔥 Nécessaire pour gérer les cookies HTTPOnly
      )
      console.log("🔹 Mot de passe envoyé au backend :", password)

      console.log("response from login", response)

      const { user } = response.data
      if (!user) {
        setError("Erreur d'authentification. Utilisateur introuvable.")
        return
      }

      // 🔹 Stocker l'utilisateur dans Redux
      dispatch(setUser({ id: user.id, role: user.role }))

      // 🔹 Rediriger l'utilisateur en fonction de son rôle
      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard")
          break
        case "Gestionnaire":
          navigate("/gestionnaire-dashboard")
          break
        case "logisticien":
          navigate("/logisticien-dashboard")
          break
        default:
          navigate("/user-dashboard")
      }
    } catch (err) {
      console.error(
        "Erreur lors de la connexion :",
        err.response?.data?.message || err.message
      )
      setError("Connexion échouée. Vérifiez vos identifiants.")
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderRadius: "12px",
        padding: 4,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        width: { xs: "90%", sm: "400px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Connexion
      </Typography>
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputLabelProps={{ style: { color: "#fff" } }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#fff" },
            "&:hover fieldset": { borderColor: "#2196F3" },
            "&.Mui-focused fieldset": { borderColor: "#2196F3" },
            color: "#fff",
          },
          input: { color: "#fff" },
        }}
      />

      <TextField
        label="Mot de passe"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{ style: { color: "#fff" } }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#fff" },
            "&:hover fieldset": { borderColor: "#2196F3" },
            "&.Mui-focused fieldset": { borderColor: "#2196F3" },
            color: "#fff",
          },
          input: { color: "#fff" },
        }}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{
          marginTop: 2,
          padding: "12px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#1976D2",
          "&:hover": { backgroundColor: "#1565C0" },
        }}
        onClick={handleLogin}
      >
        SE CONNECTER
      </Button>
    </Box>
  )
}
