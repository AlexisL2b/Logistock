import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchUserProfile,
  updateUser,
} from "../../../../../../redux/slices/authSlice"
import {
  Box,
  TextField,
  Snackbar,
  Alert,
  Button,
  Typography,
} from "@mui/material"
import { fetchSalesPoints } from "../../../../../../redux/slices/salesPointSlice"
import { fetchRoles } from "../../../../../../redux/slices/roleSlice"
import axiosInstance from "../../../../../../axiosConfig"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { salesPoints } = useSelector((state) => state.salesPoints)
  const { roles } = useSelector((state) => state.roles)
  const roleUser = "677cf977b39853e4a17727e3"

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState({
    prenom: user?.prenom || "",
    nom: user?.nom || "",
    email: user?.email || "",
    adresse: user?.adresse || "",
  })

  const salePoint = salesPoints?.data?.find(
    (s) => s._id === user?.point_vente_id
  )
  const [prevUser, setPrevUser] = useState(userProfile)

  // État pour la notification
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [severity, setSeverity] = useState("info")

  useEffect(() => {
    dispatch(fetchSalesPoints())
    dispatch(fetchRoles())
  }, [])

  useEffect(() => {
    setUserProfile({
      prenom: user?.prenom || "",
      nom: user?.nom || "",
      email: user?.email || "",
      adresse: user?.adresse || "",
    })
  }, [user])

  const handleEdit = () => {
    setPrevUser(userProfile)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setUserProfile(prevUser)
    setIsEditing(false)
  }

  const handleChange = (field, value) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()

    try {
      if (userProfile.email !== user.email) {
        const usersResponse = await axiosInstance.get(
          `http://localhost:5000/api/users`
        )
        const users = usersResponse.data || []
        const emailExists = users.some(
          (u) => u.email === userProfile.email && u._id !== user._id
        )

        if (emailExists) {
          setAlertMessage("Cette adresse e-mail est déjà utilisée.")
          setSeverity("error")
          setAlertOpen(true)
          return
        }
      }

      const result = await dispatch(
        updateUser({
          userId: user._id,
          updatedFields: userProfile,
        })
      )

      dispatch(fetchUserProfile())

      if (result.error) {
        setAlertMessage(result.error.message || "Une erreur est survenue.")
        setSeverity("error")
      } else {
        setAlertMessage("Mise à jour réussie !")
        setSeverity("success")
        setIsEditing(false)
      }
      setAlertOpen(true)
    } catch (error) {
      setAlertMessage("Erreur de mise à jour.")
      setSeverity("error")
      setAlertOpen(true)
    }
  }

  return (
    <Box
      sx={{
        maxWidth: "600px",
        mx: "auto",
        mt: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Profil Utilisateur
      </Typography>

      {Object.keys(userProfile).map(
        (field) =>
          field !== "adresse" && (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              variant="outlined"
              fullWidth
              type={field === "email" ? "email" : "text"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: isEditing ? "white" : "rgba(0, 0, 0, 0.04)",
                  pointerEvents: isEditing ? "auto" : "none",
                },
              }}
              value={userProfile[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              error={
                field === "email" &&
                userProfile.email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.email)
              }
              helperText={
                field === "email" &&
                userProfile.email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.email)
                  ? "Veuillez entrer un email valide"
                  : ""
              }
            />
          )
      )}

      {user?.role_id === roleUser && (
        <>
          <TextField
            label="Adresse"
            variant="outlined"
            fullWidth
            value={user?.adresse || ""}
            tabIndex={-1}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
                pointerEvents: "none",
              },
            }}
          />
          <TextField
            label="Point de vente"
            variant="outlined"
            fullWidth
            tabIndex={-1}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
                pointerEvents: "none",
              },
            }}
            value={salePoint?.nom || ""}
          />
        </>
      )}

      {/* Boutons Modifier / Annuler / Enregistrer */}
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        {isEditing ? (
          <>
            <Button
              variant="contained"
              sx={{
                bgcolor: "green",
                "&:hover": { bgcolor: "darkgreen" },
              }}
              onClick={handleSave}
            >
              Confirmer
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: "red",
                borderColor: "red",
                "&:hover": { bgcolor: "rgba(255, 0, 0, 0.1)" },
              }}
              onClick={handleCancel}
            >
              Annuler
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
            onClick={handleEdit}
          >
            Modifier
          </Button>
        )}
      </Box>

      {/* Snackbar MUI pour les notifications */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Profile
