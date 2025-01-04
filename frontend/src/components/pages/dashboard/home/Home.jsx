import { Box } from "@mui/material"
import React, { useEffect, useState } from "react"
import Form from "../../../reusable-ui/Form"
import axiosInstance from "../../../../axiosConfig"

export default function home() {
  const [categories, setCategories] = useState([])
  const test = [{ nom: "nom1" }, { nom: "nom2" }]

  useEffect(() => {
    axiosInstance
      .get("/categories") // URL relative correcte si axiosInstance est bien configuré
      .then((response) => {
        setCategories(response.data) // Mise à jour des catégories dans le state
        console.log("Catégories récupérées :", response.data)
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des catégories :", error)
      })
  }, [])
  console.log("Le composant Home est bien chargé")

  return (
    <Box sx={{ backgroundColor: "red" }}>
      <Form
        action="submit"
        onSubmit={console.log("Je viens de sumbit mon form")}
      />
    </Box>
  )
}
