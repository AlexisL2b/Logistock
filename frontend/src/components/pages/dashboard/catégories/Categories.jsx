import React, { useEffect, useState } from "react"
import { Box } from "@mui/material"
import axiosInstance from "../../../../axiosConfig"
import EnhancedTable from "../../../reusable-ui/EnhancedTable"

export default function Categories() {
  const [categories, setCategories] = useState([])

  // Fonction pour recharger les données
  const fetchCategories = () => {
    axiosInstance
      .get("/categories") // URL relative correcte si axiosInstance est bien configuré
      .then((response) => {
        setCategories(response.data) // Mise à jour des catégories dans le state
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des catégories :", error)
      })
  }

  // Chargement initial des catégories
  useEffect(() => {
    fetchCategories()
  }, [])

  // Callback pour gérer les changements de données
  const handleDataChange = () => {
    console.log("Les données ont changé, rechargement...")
    fetchCategories() // Rechargez les données lorsque le callback est déclenché
  }
  const headerMapping = {
    supplier_id: "Fournisseur",
    categorie_id: "Categorie",
  }

  return (
    <Box>
      {/* Passez le callback à EnhancedTable */}
      <EnhancedTable
        data={categories}
        coll={"categories"}
        onDataChange={handleDataChange}
        headerMapping={headerMapping}
        endpoints={["/supplier", "/categories"]}
      />
    </Box>
  )
}
