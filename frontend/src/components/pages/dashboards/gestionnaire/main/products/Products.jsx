import { useEffect, useState } from "react"
import { Box, TextField, Typography, Button } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTableDependancies from "../../../../../reusable-ui/tables/EnhancedTableDependancies"
import CustomSelect from "../../../../../reusable-ui/selects/CustomSelect"

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState("")

  // Chargement des données
  const fetchProducts = () => {
    axiosInstance
      .get("/products")
      .then((response) => setProducts(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des Produits :", error)
      )
  }

  const fetchCategories = () => {
    axiosInstance
      .get("/categories")
      .then((response) => setCategories(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des catégories :", error)
      )
  }

  const fetchSuppliers = () => {
    axiosInstance
      .get("/suppliers")
      .then((response) => setSuppliers(response.data))
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des fournisseurs :",
          error
        )
      )
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchSuppliers()
  }, [])

  const handleDataChange = () => {
    fetchProducts()
  }

  console.log(products)

  const headerMapping = {
    supplier_id: "Fournisseur",
    category_id: "Categorie",
    price: "Prix",
    reference: "Référence",
  }

  // 🔍 **Filtrage des produits par recherche, catégorie et fournisseur**
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product._id.toLowerCase().includes(searchLower) ||
      (product.category_id?.name &&
        product.category_id.name.toLowerCase().includes(searchLower)) ||
      (product.supplier_id?.name &&
        product.supplier_id.name.toLowerCase().includes(searchLower)) ||
      (product.reference &&
        product.reference.toLowerCase().includes(searchLower))

    const matchesCategory =
      selectedCategory === "" || product.category_id?._id === selectedCategory

    const matchesSupplier =
      selectedSupplier === "" || product.supplier_id?._id === selectedSupplier

    return matchesSearch && matchesCategory && matchesSupplier
  })

  return (
    <Box sx={{ padding: 3 }}>
      {/* 🏷️ Titre principal */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Produits
      </Typography>

      {/* 🔍 Barre de recherche */}
      <TextField
        label="Rechercher par name, ID, Catégorie, Fournisseur, Référence"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 🏷️ Filtres */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
        <CustomSelect
          inputLabelId="filtreCategorieLabel"
          inputLabel="Filtrer par Fournisseur"
          selectId="filtreCategorie"
          selectLabel="Filtrer par Fournisseur"
          defaultMenuItemLabel="Tous les fournisseurs"
          menuItems={suppliers}
          selectedValue={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
        />

        {/* 🔄 Bouton de réinitialisation */}
        <Button
          sx={{ width: "300px" }}
          variant="contained"
          onClick={() => {
            setSelectedCategory("")
            setSelectedSupplier("")
            setSearchTerm("")
          }}
        >
          Réinitialiser
        </Button>
      </Box>

      {/* 📊 Tableau des produits */}
      <EnhancedTableDependancies
        data={filteredProducts}
        coll={"products"}
        onDataChange={handleDataChange}
        endpoints={["/categories", "/suppliers", "/sales_points"]}
        headerMapping={headerMapping}
      />
    </Box>
  )
}
