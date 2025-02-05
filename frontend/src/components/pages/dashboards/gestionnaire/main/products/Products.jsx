import { useEffect, useState } from "react"
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTableDependancies from "../../../../../reusable-ui/EnhancedTableDependancies"

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  // Fonction pour charger les produits
  const fetchProducts = () => {
    axiosInstance
      .get("/products")
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des Produits :", error)
      })
  }

  // Fonction pour charger les catégories
  const fetchCategories = () => {
    axiosInstance
      .get("/categories")
      .then((response) => {
        setCategories(response.data)
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des catégories :", error)
      })
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const handleDataChange = () => {
    fetchProducts()
  }

  const headerMapping = {
    supplier_id: "Fournisseur",
    categorie_id: "Categorie",
    quantite_stock: "Quantité",
    ref: "Référence",
  }

  // 🔍 Filtrage des produits par recherche et catégorie
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase()

    // Vérification du filtre de recherche
    const matchesSearch =
      product.nom.toLowerCase().includes(searchLower) ||
      product._id.toLowerCase().includes(searchLower) ||
      (product.categorie_id?.nom &&
        product.categorie_id.nom.toLowerCase().includes(searchLower)) ||
      (product.supplier_id?.nom &&
        product.supplier_id.nom.toLowerCase().includes(searchLower)) ||
      (product.ref && product.ref.toLowerCase().includes(searchLower))

    // Vérification du filtre par catégorie
    const matchesCategory =
      selectedCategory === "" || product.categorie_id?._id === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <Box>
      {/* 🔍 Champ de recherche multi-critères */}
      <TextField
        label="Rechercher par Nom, ID, Catégorie, Fournisseur, Référence"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
