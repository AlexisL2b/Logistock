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

  const fetchSalesPoints = async () => {
    try {
      const response = await axiosInstance.get("/sales_points")
      console.log("Points de ventes reçus :", response.data)

      const salesPoints = response.data || [] // Sécurisation des données

      setSalesPoints(salesPoints) // Mise à jour du state
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des Points de ventes :",
        error
      )
    }
  }
  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get("/roles")
      console.log("Rôles reçus :", response)

      const rolesData = response.data || [] // Sécurisation des données

      setRoles(rolesData) // Mise à jour du state
    } catch (error) {
      console.error("Erreur lors de la récupération des Rôles :", error)
    }
  }

  useEffect(() => {
    fetchSalesPoints()
    fetchRoles()
  }, [])

  const onSubmit = async (data) => {
    try {
      console.log(data)

      // if (selectedRole !== "Acheteur" && admin) {
      //   delete data.salesPoint
      // }
      const { confirmPassword, ...userData } = data
      // 🚨 Supprimer `roles` pour éviter qu'un gestionnaire attribue un rôle

      // const cleanedData = cleanObject(data)
      console.log("userData", userData)

      await axiosInstance.post("http://localhost:5000/api/users", userData)
      setSnackbar({
        open: true,
        message: "Inscription réussie !",
        severity: "success",
      })
      setModalOpen(false) // Ouvre la modale
      onUserAdded()
      console.log("ici")
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
              name="firstname"
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
              name="lastname"
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
              name="address"
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
                name="role_id"
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
                        const selectedRoleObject = roles.find(
                          (role) => role._id === e.target.value
                        )
                        setSelectedRole(selectedRoleObject) // Stocke l'objet entier du rôle
                        console.log("Rôle sélectionné :", selectedRoleObject)
                      }}
                    >
                      {roles?.map((role) => (
                        <MenuItem key={role._id} value={role._id}>
                          {role.name}
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
          {selectedRole?.name === "Acheteur" && (
            <Grid item xs={12}>
              <Controller
                name="sale_point_id"
                control={control}
                defaultValue=""
                rules={{
                  required: "Veuillez sélectionner un point de vente",
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
                          {point.name}
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
