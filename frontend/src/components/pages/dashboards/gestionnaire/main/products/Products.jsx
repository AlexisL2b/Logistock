import { useEffect, useState, useCallback } from "react"
import { Box, TextField, Typography, Button } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTableDependancies from "../../../../../reusable-ui/tables/EnhancedTableDependancies"
import CustomSelect from "../../../../../reusable-ui/selects/CustomSelect"

export default function Products() {
  const [data, setData] = useState({
    products: [],
    categories: [],
    suppliers: [],
  })

  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedCategory: "",
    selectedSupplier: "",
  })

  // 🔄 **Chargement des données**
  const fetchData = useCallback(async () => {
    try {
      const endpoints = ["/products", "/categories", "/suppliers"]
      const responses = await Promise.all(
        endpoints.map((url) => axiosInstance.get(url))
      )

      setData(
        Object.fromEntries(
          endpoints.map((url, i) => [url.split("/")[1], responses[i].data])
        )
      )
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 🎯 **Gestion des changements de filtres**
  const handleFilterChange = (key) => (event) => {
    setFilters((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleResetFilters = () => {
    setFilters({ searchTerm: "", selectedCategory: "", selectedSupplier: "" })
  }

  // 🔍 **Filtrage des produits**
  const filteredProducts = data.products.filter(
    ({ name, _id, category_id, supplier_id, reference }) => {
      const searchLower = filters.searchTerm.toLowerCase()
      return (
        (!filters.searchTerm ||
          name.toLowerCase().includes(searchLower) ||
          _id.toLowerCase().includes(searchLower) ||
          reference?.toLowerCase().includes(searchLower) ||
          category_id?.name?.toLowerCase().includes(searchLower) ||
          supplier_id?.name?.toLowerCase().includes(searchLower)) &&
        (!filters.selectedCategory ||
          category_id?._id === filters.selectedCategory) &&
        (!filters.selectedSupplier ||
          supplier_id?._id === filters.selectedSupplier)
      )
    }
  )
  console.log("filteredProducts depuis Products.jsx", filteredProducts)
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Produits
      </Typography>

      {/* 🔍 Barre de recherche */}
      <TextField
        label="Rechercher..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={filters.searchTerm}
        onChange={handleFilterChange("searchTerm")}
      />

      {/* 🎛️ Filtres */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <CustomSelect
          inputLabel="Filtrer par Catégorie"
          defaultMenuItemLabel="Toutes les catégories"
          menuItems={data.categories}
          selectedValue={filters.selectedCategory}
          onChange={handleFilterChange("selectedCategory")}
        />
        <CustomSelect
          inputLabel="Filtrer par Fournisseur"
          defaultMenuItemLabel="Tous les fournisseurs"
          menuItems={data.suppliers}
          selectedValue={filters.selectedSupplier}
          onChange={handleFilterChange("selectedSupplier")}
        />
        <Button
          sx={{ width: "300px" }}
          variant="contained"
          onClick={handleResetFilters}
        >
          Réinitialiser
        </Button>
      </Box>

      {/* 📊 Tableau des produits */}
      <EnhancedTableDependancies
        data={filteredProducts}
        coll="products"
        onDataChange={fetchData}
        endpoints={["/categories", "/suppliers", "/sales_points"]}
        headerMapping={{
          supplier_id: "Fournisseur",
          category_id: "Categorie",
          price: "Prix",
          reference: "Référence",
        }}
      />
    </Box>
  )
}
