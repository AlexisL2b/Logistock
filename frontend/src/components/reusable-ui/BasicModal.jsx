import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import PropTypes from "prop-types"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}

export default function BasicModal({
  open,
  onClose,
  onSubmit,
  title = "Modifier l'élément",
  objectData = {},
  dropdownData = {}, // Objet pour hydrater les dropdowns
}) {
  const [formData, setFormData] = useState(objectData)

  useEffect(() => {
    // Si objectData est vide, initialise un objet avec des champs par défaut
    const initialData = objectData || {}
    setFormData(initialData)
  }, [objectData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [name]: value,
      }
      console.log("Updated formData:", updatedFormData) // Debug
      return updatedFormData
    })
  }

  const handleSubmit = () => {
    console.log("Form data submitted:", formData) // Debug
    onSubmit(formData) // Appelle la fonction onSubmit avec les données du formulaire
    onClose() // Ferme la modal après soumission
  }

  const findDropdownKey = (key) => {
    // Basé sur une relation dynamique entre les noms de clés
    const keyMapping = {
      categorie_id: "/categories",
      fournisseur_id: "/suppliers",
    }

    return keyMapping[key] || null // Retourne la clé correspondante ou null si aucune correspondance
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          {Object.keys(formData)
            .filter((key) => key !== "_id" && key !== "__v") // Filtrer les clés _id et __v
            .map((key) => {
              const dropdownKey = findDropdownKey(key) // Trouvez dynamiquement la clé dans dropdownData

              if (key.endsWith("_id") && dropdownData[dropdownKey]) {
                return (
                  <TextField
                    select
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    {dropdownData[dropdownKey]?.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.nom}
                      </MenuItem>
                    ))}
                  </TextField>
                )
              } else if (key.endsWith("_id")) {
                // Si la clé existe mais pas dans dropdownData
                return (
                  <TextField
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    value="Clé manquante dans dropdownData"
                    disabled
                    fullWidth
                  />
                )
              }

              // Sinon, retournez un champ TextField normal
              return (
                <TextField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleInputChange}
                  fullWidth
                />
              )
            })}
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
  open: PropTypes.bool.isRequired, // Obligatoire
  onClose: PropTypes.func.isRequired, // Obligatoire
  onSubmit: PropTypes.func.isRequired, // Obligatoire
  title: PropTypes.string, // Facultatif (a une valeur par défaut)
  objectData: PropTypes.object, // Facultatif (a une valeur par défaut)
  dropdownData: PropTypes.object, // Nouvel objet pour gérer les dropdowns
}
