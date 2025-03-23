import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  TextField,
  Button,
  Grid,
  Box,
  Snackbar,
  Alert,
  FormHelperText,
  Typography,
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../../../redux/slices/userSlice" // 🔥 Redux
import CustomSelect from "../selects/CustomSelect"
import { showNotification } from "../../../redux/slices/notificationSlice"
import { fetchSalesPointsWithoutUsers } from "../../../redux/slices/salesPointSlice"

const FormulaireInscription = ({ admin, onClose, onUserAdded }) => {
  const dispatch = useDispatch()
  const { withoutUsers, status, error } = useSelector(
    (state) => state.salesPoints
  )
  console.log("withoutUsers depuis SignUpForm.jsx", withoutUsers)
  const salesPoints = useSelector((state) => state.salesPoints.list)
  const roles = useSelector((state) => state.roles.list)

  const [selectedRole, setSelectedRole] = useState(admin ? "" : "Acheteur")
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  })

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch("password")
  const confirmPassword = watch("confirmPassword")

  // ✅ Soumission du formulaire via Redux
  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...userData } = data

      const roleToAdd = roles.find((role) => role._id === userData.role)

      const salePointToAdd = userData.sale_point_id
        ? salesPoints.find(
            (salesPoint) => salesPoint._id === userData.sale_point_id
          )
        : {}
      // 🔹 Extraction sécurisée des propriétés `_id` et `name`
      const salePointData = salePointToAdd
        ? { _id: salePointToAdd._id, name: salePointToAdd.name }
        : null
      const { sale_point_id, ...cleanUserData } = userData
      const updatedUserData = {
        ...cleanUserData,
        role: roleToAdd
          ? roleToAdd
          : { _id: "677cf977b39853e4a17727e3", name: "Acheteur" },
        sales_point: salePointData,
      }

      await dispatch(addUser(updatedUserData)).unwrap()
      dispatch(
        showNotification({
          message: "Utilisateur créé avec succès !",
          severity: "success",
        })
      )

      onUserAdded()
      onClose()
    } catch (error) {
      //
      // setSnackbar({
      //   open: true,
      //   message: error.message || "Une erreur est survenue.",
      //   severity: "error",
      // })
      dispatch(
        showNotification({
          message: error.message || "Une erreur est survenue.",
          severity: "error",
        })
      )
    }
  }
  useEffect(() => {
    dispatch(fetchSalesPointsWithoutUsers())
  }, [])
  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", mt: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Prénom */}
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
                  error={!!errors.firstname}
                  helperText={errors.firstname?.message}
                />
              )}
            />
          </Grid>

          {/* Nom */}
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
                  error={!!errors.lastname}
                  helperText={errors.lastname?.message}
                />
              )}
            />
          </Grid>

          {/* Adresse */}
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
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>

          {/* Email */}
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

          {/* Mot de passe */}
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
                />
              )}
            />
            <FormHelperText>
              ✅ Min. 12 caractères | ✅ 1 majuscule | ✅ 1 minuscule | ✅ 1
              chiffre | ✅ 1 caractère spécial (!@#$%^&*)
            </FormHelperText>
          </Grid>

          {/* Confirmation du mot de passe */}
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

          {/* Sélecteur de rôle (uniquement pour l'admin) */}
          {admin && (
            <Grid item xs={12}>
              <Controller
                name="role"
                control={control}
                defaultValue=""
                rules={{ required: "Veuillez sélectionner un rôle" }}
                render={({ field }) => (
                  <>
                    <CustomSelect
                      inputLabel="Rôle"
                      selectLabel="Rôle"
                      menuItems={roles}
                      selectedValue={field.value}
                      onChange={(e) => {
                        field.onChange(e)
                        setSelectedRole(
                          roles.find((role) => role._id === e.target.value)
                        )
                      }}
                    />
                    <FormHelperText error={!!errors.role}>
                      {errors.role?.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>
          )}

          {/* Sélecteur de point de vente */}
          {(selectedRole?.name === "Acheteur" || !admin) && (
            <Grid item xs={12}>
              <Controller
                name="sale_point_id"
                control={control}
                defaultValue=""
                rules={{ required: "Veuillez sélectionner un point de vente" }}
                render={({ field }) => (
                  <>
                    <CustomSelect
                      inputLabel="Point de Vente"
                      selectLabel="Point de Vente"
                      menuItems={withoutUsers.data}
                      selectedValue={field.value}
                      onChange={field.onChange}
                    />
                    <FormHelperText error={!!errors.sale_point_id}>
                      {errors.sale_point_id?.message}
                    </FormHelperText>
                  </>
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
    </Box>
  )
}

export default FormulaireInscription
