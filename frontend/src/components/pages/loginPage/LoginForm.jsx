import { Box, TextField, Typography, Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth"
import { useNavigate } from "react-router" // Remplace Link pour la navigation
import axios from "axios"
import { useDispatch } from "react-redux"
import { fetchUserProfile, setUser } from "../../../redux/slices/authSlice"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const auth = getAuth()
    signOut(auth) // Déconnecte l'utilisateur au chargement de la page
      .then(() => {
        //("Session Firebase nettoyée")
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion Firebase :", error)
      })
  }, [])
  const handleLogin = async () => {
    try {
      const loginRes = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      )

      const { token } = loginRes.data
      const auth = getAuth()
      const userCredential = await signInWithCustomToken(auth, token)
      const idToken = await userCredential.user.getIdToken()

      // Récupérer les données utilisateur depuis le backend
      const profileRes = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      )

      const user = profileRes.data.user

      // Dispatcher les données utilisateur
      dispatch(setUser(user))

      // Redirection en fonction du rôle
      if (user.role_id === "677cf977b39853e4a17727e0") {
        navigate("/admin-dashboard")
      } else if (user.role_id === "677cf977b39853e4a17727e3") {
        navigate("/user-dashboard")
      } else {
        navigate("/logisticien-dashboard")
      }
    } catch (err) {
      console.error("Erreur lors de la connexion :", err)
      setError("Connexion échouée.")
    }
  }
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
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderWidth: "2px",
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderWidth: "2px",
              borderColor: "secondary.main",
            },
            "&.Mui-focused fieldset": {
              borderWidth: "3px",
              borderColor: "secondary.main",
            },
          },
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
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderWidth: "2px",
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderWidth: "2px",
              borderColor: "secondary.main",
            },
            "&.Mui-focused fieldset": {
              borderWidth: "3px",
              borderColor: "secondary.main",
            },
          },
        }}
      />
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
        onClick={handleLogin}
      >
        Se connecter
      </Button>
    </Box>
  )
}
