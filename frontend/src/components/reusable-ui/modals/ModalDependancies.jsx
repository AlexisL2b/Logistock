import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  FormHelperText,
} from "@mui/material"
import CustomSelect from "../selects/CustomSelect"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
}

export default function BasicModal({
  open,
  onClose,
  onSubmit,
  title = "Modifier l'élément",
  objectData = {},
  dropdownData = {},
  edit,
}) {
  const [formData, setFormData] = useState({
    name: "",
    reference: "",
    price: "",
    quantity: "",
    description: "",
    category_id: "",
    supplier_id: "",
    sales_point_id: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setFormData({
        name: objectData.name || "",
        reference: objectData.reference || "",
        price: objectData.price || "",
        quantity: objectData.quantity || "",
        description: objectData.description || "",
        category_id: objectData.category_id?._id || "",
        supplier_id: objectData.supplier_id?._id || "",
      })
    }
  }, [objectData, open])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const validateForm = () => {
    let newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Le nom est obligatoire."
    if (!formData.reference.trim())
      newErrors.reference = "La référence est obligatoire."
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Le prix doit être supérieur à 0."
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = "Quantité invalide."
    if (!formData.description.trim())
      newErrors.description = "La description est obligatoire."
    if (!formData.category_id)
      newErrors.category_id = "Veuillez sélectionner une catégorie."
    if (!formData.supplier_id)
      newErrors.supplier_id = "Veuillez sélectionner un fournisseur."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ ...formData, _id: objectData._id })
    }
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <TextField
            label="Nom"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label="Référence"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            error={!!errors.reference}
            helperText={errors.reference}
            fullWidth
          />
          <TextField
            label="Prix"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
          />

          {!edit ? (
            <TextField
              label="Quantité Disponible"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              error={!!errors.quantity}
              helperText={errors.quantity}
              fullWidth
            />
          ) : (
            ""
          )}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={3}
          />

          {/* 🔥 Utilisation de CustomSelect pour Catégories */}
          <CustomSelect
            inputLabelId="category-label"
            inputLabel="Catégorie"
            selectId="category-select"
            selectLabel="Catégorie"
            defaultMenuItemLabel="Toutes les catégories"
            menuItems={dropdownData["/categories"] || []}
            selectedValue={formData.category_id}
            onChange={(e) =>
              setFormData({ ...formData, category_id: e.target.value })
            }
          />
          <FormHelperText error={!!errors.category_id}>
            {errors.category_id}
          </FormHelperText>

          {/* 🔥 Utilisation de CustomSelect pour Fournisseurs */}
          <CustomSelect
            inputLabelId="supplier-label"
            inputLabel="Fournisseur"
            selectId="supplier-select"
            selectLabel="Fournisseur"
            defaultMenuItemLabel="Tous les fournisseurs"
            menuItems={dropdownData["/suppliers"] || []}
            selectedValue={formData.supplier_id}
            onChange={(e) =>
              setFormData({ ...formData, supplier_id: e.target.value })
            }
          />
          <FormHelperText error={!!errors.supplier_id}>
            {errors.supplier_id}
          </FormHelperText>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Enregistrer
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

BasicModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  objectData: PropTypes.object,
  dropdownData: PropTypes.object,
}
