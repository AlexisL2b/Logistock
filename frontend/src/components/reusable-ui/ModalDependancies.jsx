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
  dropdownData = {},
}) {
  const [formData, setFormData] = useState(objectData)
  console.log("dropdownData from modal dependancies", dropdownData)
  useEffect(() => {
    const initialData = { ...objectData }
    Object.keys(objectData).forEach((key) => {
      if (
        objectData[key] &&
        typeof objectData[key] === "object" &&
        objectData[key]._id
      ) {
        initialData[key] = objectData[key]._id // Remplacer l'objet par l'ID
      }
    })
    setFormData(initialData)
  }, [objectData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
    onClose()
  }

  const findDropdownKey = (key) => {
    const baseKey = key.replace("_id", "").toLowerCase().trim()
    console.log("baseKey", baseKey)
    return (
      Object.keys(dropdownData).find((dropdownKey) =>
        dropdownKey.toLowerCase().includes(baseKey)
      ) || null
    )
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6">
          {title}
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          {Object.keys(formData)
            .filter(
              (key) => key !== "_id" && key !== "__v" && key !== "Stock_id"
            )
            .map((key) => {
              const dropdownKey = findDropdownKey(key)
              console.log("DropdownKey for", key, ":", dropdownKey)

              if (key.endsWith("_id") && dropdownKey) {
                return (
                  <TextField
                    select
                    key={key}
                    label={
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace("_id", "")
                    }
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    {Array.isArray(dropdownData[dropdownKey]) ? (
                      dropdownData[dropdownKey].map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.nom}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Aucune donnée disponible</MenuItem>
                    )}
                  </TextField>
                )
              } else if (key.endsWith("_id")) {
                console.warn(`No dropdown data found for key: ${key}`)
                return (
                  <TextField
                    key={key}
                    label={`${
                      key.charAt(0).toUpperCase() + key.slice(1)
                    } (Aucune correspondance)`}
                    value={formData[key] || ""}
                    disabled
                    fullWidth
                  />
                )
              }

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
