import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchProducts } from "../../../../../../redux/slices/productsSlice"
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import ProductCard from "./ProductCard"
import CustomSelect from "../../../../../reusable-ui/selects/CustomSelect"

export default function Shop() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.items)
  const status = useSelector((state) => state.products.status)
  const error = useSelector((state) => state.products.error)

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")

  console.log("products", products)

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
        (product) =>
          String(product.category_id?._id) === String(selectedCategory)
      )
    : products
  console.log(filteredProducts)
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Produits
      </Typography>
      <CustomSelect
        inputLabelId="filtreCategorieLabel"
        inputLabel="Filtrer par Catégorie"
        selectId="filtreCategorie"
        selectLabel="Filtrer par Catégorie"
        defaultMenuItemLabel="Toutes les catégories"
        menuItems={categories}
        selectedValue={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      />
      {/* 🏷️ Titre principal */}

      {/* 🌟 Affichage ultra responsive des produits */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // 1 produit par ligne sur mobile
            sm: "repeat(2, 1fr)", // 2 produits par ligne sur tablette
            md: "repeat(3, 1fr)", // 3 produits par ligne sur PC
          },
          gap: "24px",
          rowGap: "70px",
          mt: 2,
          justifyContent: "start", // Évite l'espace inutile si un seul produit
          minHeight: "calc(2 * (300px + 70px))", // Taille minimum = 2 lignes
          maxHeight: "calc(4 * (300px + 70px))", // Limite max avant scroll
          overflowY: "auto", // Activation du scroll interne
          padding: "10px",
          border: "1px solid #ddd", // Bordure légère pour mieux délimiter
          borderRadius: "8px", // Coins arrondis
          scrollbarWidth: "none", // Cacher la barre de scroll sur Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Cacher la barre de scroll sur Chrome et Safari
          },
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Box>
    </Box>
  )
}
