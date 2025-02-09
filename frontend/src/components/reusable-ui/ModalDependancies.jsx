import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material"

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
}) {
  const [formData, setFormData] = useState({
    name: "",
    reference: "",
    price: "",
    quantite_disponible: "",
    category_id: "",
    supplier_id: "",
    sales_point_id: "",
  })

  const [errors, setErrors] = useState({}) // ✅ État des erreurs

  useEffect(() => {
    if (objectData) {
      setFormData({
        name: objectData.name || "",
        reference: objectData.reference || "",
        price: objectData.price || "",
        quantite_disponible: objectData.quantite_disponible || "",
        category_id: objectData.category_id?._id || "",
        supplier_id: objectData.supplier_id?._id || "",
        sales_point_id: objectData.sales_point_id || "",
      })
    }
  }, [objectData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  // ✅ Fonction de validation
  const validateForm = () => {
    let newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Le nom est obligatoire."
    if (!formData.reference.trim())
      newErrors.reference = "La référence est obligatoire."
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Le prix doit être supérieur à 0."
    if (!formData.quantite_disponible || formData.quantite_disponible <= 0)
      newErrors.quantite_disponible = "Quantité invalide."
    if (!formData.category_id)
      newErrors.category_id = "Veuillez sélectionner une catégorie."
    if (!formData.supplier_id)
      newErrors.supplier_id = "Veuillez sélectionner un fournisseur."
    if (!formData.sales_point_id)
      newErrors.sales_point_id = "Veuillez sélectionner un point de vente."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
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
          {/* 🔥 Nom */}
          <TextField
            label="Nom"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          {/* 🔥 Référence */}
          <TextField
            label="Référence"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            error={!!errors.reference}
            helperText={errors.reference}
            fullWidth
          />

          {/* 🔥 Prix */}
          <TextField
            label="Prix"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "") // 🔥 Seulement les chiffres
            }}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
          />

          {/* 🔥 Quantité Disponible */}
          <TextField
            label="Quantité Disponible"
            name="quantite_disponible"
            type="number"
            value={formData.quantite_disponible}
            onChange={handleInputChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "")
            }}
            error={!!errors.quantite_disponible}
            helperText={errors.quantite_disponible}
            fullWidth
          />

          {/* 🔥 Catégorie */}
          <FormControl fullWidth error={!!errors.category_id}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
            >
              {dropdownData["/categories"]?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.nom}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.category_id}</FormHelperText>
          </FormControl>

          {/* 🔥 Fournisseur */}
          <FormControl fullWidth error={!!errors.supplier_id}>
            <InputLabel>Fournisseur</InputLabel>
            <Select
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleInputChange}
            >
              {dropdownData["/suppliers"]?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.nom}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.supplier_id}</FormHelperText>
          </FormControl>

          {/* 🔥 Point de Vente */}
          <FormControl fullWidth error={!!errors.sales_point_id}>
            <InputLabel>Point de Vente</InputLabel>
            <Select
              name="sales_point_id"
              value={formData.sales_point_id}
              onChange={handleInputChange}
            >
              {dropdownData["/sales_points"]?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.nom}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.sales_point_id}</FormHelperText>
          </FormControl>

          {/* 🔥 Bouton d'enregistrement */}
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
