import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchProducts } from "../../../../../../redux/slices/productsSlice"
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import ProductCard from "./ProductCard"

export default function Shop() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.items)
  const status = useSelector((state) => state.products.status)
  const error = useSelector((state) => state.products.error)

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")

  // Charger les catégories depuis l'API
  useEffect(() => {
    axiosInstance
      .get("/categories")
      .then((response) => setCategories(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des catégories :", error)
      )
  }, [])

  // Charger les produits depuis Redux
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts())
    }
  }, [status, dispatch])

  // Filtrer les produits par catégorie sélectionnée
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.categorie_id?._id === selectedCategory
      )
    : products

  return (
    <Box>
      {/* 🏷️ Filtre par catégorie */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="category-filter-label">
          Filtrer par Catégorie
        </InputLabel>
        <Select
          labelId="category-filter-label"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <MenuItem value="">Toutes les catégories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Affichage des produits filtrés */}
      <Box>
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Box>
    </Box>
  )
}
