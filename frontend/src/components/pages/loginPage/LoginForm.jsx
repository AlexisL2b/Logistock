import { Box, TextField, Typography, Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth"
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

  useEffect(() => {
    const auth = getAuth()
    signOut(auth).catch((error) =>
      console.error("Erreur lors de la déconnexion Firebase :", error)
    )
  }, [])

  const handleLogin = async () => {
    try {
      const loginRes = await axiosInstance.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      )
      const { customToken } = loginRes.data
      localStorage.setItem("customToken", customToken)

      const auth = getAuth()
      const userCredential = await signInWithCustomToken(auth, customToken)
      const uid = userCredential.user.uid

      const response = await axiosInstance.get(
        `http://localhost:5000/api/users/uid/${uid}`
      )

      console.log("response,", response)
      const user = response.data

      dispatch(setUser(user))
      saveToLocalStorage(`user_${user._id}`, user)

      switch (user.role_id) {
        case "677cf977b39853e4a17727e0":
          navigate("/admin-dashboard")
          break
        case "677cf977b39853e4a17727e3":
          navigate("/user-dashboard")
          break
        case "677cf977b39853e4a17727e1":
          navigate("/gestionnaire-dashboard")
          break
        default:
          navigate("/logisticien-dashboard")
      }
    } catch (err) {
      console.error("Erreur lors de la connexion :", err)
      setError("Connexion échouée. Vérifiez vos identifiants.")
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Fond plus opaque
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
            "& fieldset": {
              borderColor: "#fff",
            },
            "&:hover fieldset": {
              borderColor: "#2196F3",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2196F3",
            },
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
            "& fieldset": {
              borderColor: "#fff",
            },
            "&:hover fieldset": {
              borderColor: "#2196F3",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2196F3",
            },
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
          "&:hover": {
            backgroundColor: "#1565C0",
          },
        }}
        onClick={handleLogin}
      >
        SE CONNECTER
      </Button>
    </Box>
  )
}
