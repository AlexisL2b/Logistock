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
  const products2 = useSelector((state) => state.products)
  const status = useSelector((state) => state.products.status)
  const error = useSelector((state) => state.products.error)
  console.log("products2 depuis Shop.jsx", products2)
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
        (product) =>
          String(product.category_id?._id) === String(selectedCategory)
      )
    : products

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
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Box>
    </Box>
  )
}
