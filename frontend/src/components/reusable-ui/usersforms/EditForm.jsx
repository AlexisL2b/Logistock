import React, { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  TextField,
  Button,
  Grid,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { updateUserInfo } from "../../../redux/slices/userSlice"
import CustomSelect from "../selects/CustomSelect"
import { showNotification } from "../../../redux/slices/notificationSlice"
import { fetchSalesPointsWithoutUsers } from "../../../redux/slices/salesPointSlice"

const EditForm = ({ row, onClose = null, onUserUpdated, admin = false }) => {
  console.log("row depuis EditForm.jsx", row)
  const dispatch = useDispatch()
  const salesPoints = useSelector((state) => state.salesPoints.list)
  const { withoutUsers, status, error } = useSelector(
    (state) => state.salesPoints
  )
  console.log("withoutUsers depuis EditForm.jsx", withoutUsers)
  const roles = useSelector((state) => state.roles.list)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  })

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  useEffect(() => {
    if (row) {
      reset({
        lastname: row.nom || "",
        firstname: row.prenom || "",
        address: row.adresse || "",
        email: row.email || "",
        role: roles.find((role) => role.name === row["role"])?._id || "", // Ajoute "" comme fallback
        sales_point:
          salesPoints.find((sp) => sp.name === row["point_vente_nom"])?._id ||
          "", // Ajoute "" comme fallback
        oldPassword: "",
        newPassword: "",
      })
    }
  }, [row, reset, roles, salesPoints])
  useEffect(() => {
    dispatch(fetchSalesPointsWithoutUsers())
  }, [dispatch])
  const newPassword = watch("newPassword")
  const oldPassword = watch("oldPassword")
  console.log("row depuis EditForm.jsx", row)
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      console.log("data depuis EditForm.jsx", data)

      const { oldPassword, newPassword, ...userData } = data

      // 🔥 Comparer les valeurs et ne garder que les champs modifiés
      const updatedFields = {}
      Object.keys(userData).forEach((key) => {
        if (userData[key] !== row[key]) {
          updatedFields[key] = userData[key]
        }
      })

      // Vérifier si on doit mettre à jour le mot de passe
      if (newPassword) {
        if (!oldPassword) {
          setSnackbar({
            open: true,
            message: "L'ancien mot de passe est requis.",
            severity: "error",
          })
          setIsSubmitting(false)
          return
        }
        updatedFields.password = newPassword
        updatedFields.oldPassword = oldPassword
      }

      // Vérifier si `role` et `sales_point` ont changé
      if (userData.role !== row.role) {
        updatedFields.role = roles.find((role) => role._id === userData.role)
      }
      if (userData.sales_point !== row.point_vente_nom) {
        updatedFields.sales_point = salesPoints.find(
          (sp) => sp._id === userData.sales_point
        )
      }

      // 🚨 Si aucun champ n'a changé, on ne fait rien
      if (Object.keys(updatedFields).length === 0) {
        setSnackbar({
          open: true,
          message: "Aucune modification détectée.",
          severity: "info",
        })
        setIsSubmitting(false)
        return
      }

      console.log("updatedFields", updatedFields)

      await dispatch(
        updateUserInfo({ userId: row._id, userUpdates: updatedFields })
      ).unwrap()

      dispatch(
        showNotification({
          message: "Utilisateur mis à jour avec succès !",
          severity: "success",
        })
      )

      onUserUpdated()
      // onClose()
    } catch (error) {
      dispatch(
        showNotification({
          message: error.message || "Une erreur est survenue.",
          severity: "error",
        })
      )
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", mt: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="lastname"
              control={control}
              rules={{ required: "Le nom est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nom"
                  fullWidth
                  error={!!errors.nom}
                  helperText={errors.nom?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="firstname"
              control={control}
              rules={{ required: "Le prénom est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Prénom"
                  fullWidth
                  error={!!errors.prenom}
                  helperText={errors.prenom?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              rules={{ required: "L'adresse est requise" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Adresse"
                  fullWidth
                  error={!!errors.adresse}
                  helperText={errors.adresse?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <input
              type="text"
              name="fake-email"
              style={{ display: "none" }}
              autoComplete="off"
            />
            <Controller
              name="email"
              control={control}
              autoComplete="off"
              rules={{ required: "L'email est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          {admin ? (
            <Grid item xs={12}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    inputLabel="Rôle"
                    selectLabel="Rôle"
                    menuItems={roles}
                    selectedValue={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Grid>
          ) : (
            ""
          )}
          {row.rôle === "Acheteur" ? (
            <Grid item xs={12}>
              <Controller
                name="sales_point"
                control={control}
                render={({ field }) => (
                  console.log("field depuis EditForm.jsx", field),
                  (
                    <CustomSelect
                      inputLabel="Point de Vente"
                      selectLabel="Point de Vente"
                      menuItems={withoutUsers.data}
                      selectedValue={field.value}
                      // onChange={(e) => console.log(e.target.value)}
                      onChange={field.onChange}
                    />
                  )
                )}
              />
            </Grid>
          ) : (
            ""
          )}

          <Grid item xs={12}>
            <Controller
              name="oldPassword"
              autoComplete="off"
              control={control}
              render={({ field }) => (
                <TextField
                  // {...field}
                  label="Ancien Mot de Passe"
                  type="password"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="newPassword"
              autoComplete="off"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nouveau Mot de Passe"
                  type="password"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Modifier"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}

export default EditForm
