import React, { useEffect, useState } from "react"
import { Box, TextField } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTable from "../../../../../reusable-ui/EnhancedTable"

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fonction pour recharger les données
  const fetchCategories = () => {
    axiosInstance
      .get("/categories") // Récupérer les catégories
      .then((response) => {
        setCategories(response.data) // Mise à jour du state avec les catégories
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des catégories :", error)
      })
  }

  // Chargement initial des catégories
  useEffect(() => {
    fetchCategories()
  }, [])

  // Callback pour recharger les données après modification
  const handleDataChange = () => {
    fetchCategories()
  }

  const headerMapping = {
    _id: "ID",
    nom: "Nom",
  }

  console.log("data: ", categories)

  // 🔍 Filtrage multi-critères : Nom, ID
  const filteredCategories = categories.filter((category) => {
    const searchLower = searchTerm.toLowerCase()

    return (
      category.nom.toLowerCase().includes(searchLower) || // Nom de la catégorie
      category._id.toLowerCase().includes(searchLower) // ID de la catégorie
    )
  })

  return (
    <Box>
      {/* 🔍 Champ de recherche multi-critères */}
      <TextField
        label="Rechercher par Nom ou ID"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Passe les catégories filtrées à EnhancedTable */}
      <EnhancedTable
        data={filteredCategories}
        coll={"categories"}
        onDataChange={handleDataChange}
        headerMapping={headerMapping}
      />
    </Box>
  )
}
