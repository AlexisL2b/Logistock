import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Modal,
} from "@mui/material"
import axiosInstance from "../../../axiosConfig"

const FormulaireInscription = ({ admin, onClose, onUserAdded }) => {
  const [salesPoints, setSalesPoints] = useState([])
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState("") // Stocke le rôle sélectionné
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  })
  const [modalOpen, setModalOpen] = useState(false) // État pour afficher la modale

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch("password")
  const selectedSalesPoint = watch("salesPoint") // Récupère la valeur du point de vente

  function cleanObject(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    )
  }

  useEffect(() => {
    axiosInstance
      .get("/sales_points")
      .then((response) => {
        console.log("Réponse API Rôles :", response.data.data),
          setSalesPoints(response.data.data),
          console.log(salesPoints)
      })
      .catch((error) => console.error("Erreur points de vente :", error))

    axiosInstance
      .get("/roles")
      .then((response) => {
        console.log("Réponse API Rôles :", response.data) // Vérifier si les données sont correctes
        setRoles(response.data)
        console.log(roles)
      })
      .catch((error) => console.error("Erreur rôles :", error))
  }, [])

  const onSubmit = async (data) => {
    try {
      console.log(data) // Supprime la propriété salesPoint si le rôle n'est pas "Acheteur"
      if (selectedRole !== "677cf977b39853e4a17727e3" && admin) {
        delete data.salesPoint
      }
      if (!admin) {
        data.roles = "677cf977b39853e4a17727e3"
      }

      const cleanedData = cleanObject(data)
      console.log(cleanedData)
      await axiosInstance.post(
        "http://localhost:5000/api/auth/register",
        cleanedData
      )

      setSnackbar({
        open: true,
        message: "Inscription réussie !",
        severity: "success",
      })

      setModalOpen(false) // Ouvre la modale
      onUserAdded()
      onClose()
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Une erreur est survenue.",
        severity: "error",
      })
    }
  }

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", mt: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Champ Prénom */}
          <Grid item xs={12}>
            <Controller
              name="prenom"
              control={control}
              defaultValue=""
              rules={{ required: "Le prénom est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Prénom"
                  variant="outlined"
                  fullWidth
                  error={!!errors.prenom}
                  helperText={errors.prenom?.message}
                />
              )}
            />
          </Grid>

          {/* Champ Nom */}
          <Grid item xs={12}>
            <Controller
              name="nom"
              control={control}
              defaultValue=""
              rules={{ required: "Le nom est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  error={!!errors.nom}
                  helperText={errors.nom?.message}
                />
              )}
            />
          </Grid>

          {/* Champ Adresse */}
          <Grid item xs={12}>
            <Controller
              name="adresse"
              control={control}
              defaultValue=""
              rules={{ required: "L'adresse est requise" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Adresse"
                  variant="outlined"
                  fullWidth
                  error={!!errors.adresse}
                  helperText={errors.adresse?.message}
                />
              )}
            />
          </Grid>

          {/* Champ Email */}
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "L'email est requis",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                  message: "Email invalide",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          {/* Champ Mot de passe */}
          <Grid item xs={12}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: "Le mot de passe est requis",
                validate: (value) => {
                  if (value.length < 12) return "Min. 12 caractères"
                  if (!/[A-Z]/.test(value)) return "Une majuscule requise"
                  if (!/[a-z]/.test(value)) return "Une minuscule requise"
                  if (!/[0-9]/.test(value)) return "Un chiffre requis"
                  if (!/[!@#$%^&*]/.test(value))
                    return "Un caractère spécial requis"
                  return true
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </Grid>

          {/* Confirmation de mot de passe */}
          <Grid item xs={12}>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: "Confirmez votre mot de passe",
                validate: (value) =>
                  value === password ||
                  "Les mots de passe ne correspondent pas",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirmer le mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
          </Grid>

          {/* Sélecteur de rôle */}
          {admin ? (
            <Grid item xs={12}>
              <Controller
                name="roles"
                control={control}
                defaultValue=""
                rules={{ required: "Veuillez sélectionner un rôle" }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="roles-label">Rôle</InputLabel>
                    <Select
                      {...field}
                      labelId="roles-label"
                      label="Rôle"
                      onChange={(e) => {
                        field.onChange(e) // Met à jour React Hook Form
                        setSelectedRole(e.target.value) // Met à jour l'état
                      }}
                    >
                      {roles?.map((role) => (
                        <MenuItem key={role._id} value={role._id}>
                          {role.nom}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          ) : (
            ""
          )}

          {/* Sélecteur de point de vente (Seulement si "Acheteur" est sélectionné) */}
          {selectedRole === "677cf977b39853e4a17727e3" && (
            <Grid item xs={12}>
              <Controller
                name="salesPoint"
                control={control}
                defaultValue=""
                rules={{
                  required:
                    selectedRole === "677cf977b39853e4a17727e3"
                      ? "Veuillez sélectionner un point de vente"
                      : false,
                }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="sales-point-label">
                      Point de Vente
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="sales-point-label"
                      label="Point de Vente"
                    >
                      {salesPoints.map((point) => (
                        <MenuItem key={point._id} value={point._id}>
                          {point.nom}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
          )}

          {/* Bouton Soumettre */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              S'inscrire
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar pour les messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default FormulaireInscription
