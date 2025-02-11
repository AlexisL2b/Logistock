import { useEffect, useState } from "react"
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTableDependancies from "../../../../../reusable-ui/EnhancedTableDependancies"

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState("")

  // Fonction pour charger les produits
  const fetchProducts = () => {
    axiosInstance
      .get("/products")
      .then((response) => setProducts(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des Produits :", error)
      )
  }

  // Fonction pour charger les catégories
  const fetchCategories = () => {
    axiosInstance
      .get("/categories")
      .then((response) => setCategories(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des catégories :", error)
      )
  }

  // Fonction pour charger les fournisseurs
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
    categorie_id: "Categorie",
    quantite_stock: "Quantité",
    ref: "Référence",
  }

  // 🔍 **Filtrage des produits par recherche, catégorie et fournisseur**
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

    // Vérification du filtre par fournisseur
    const matchesSupplier =
      selectedSupplier === "" || product.supplier_id?._id === selectedSupplier

    return matchesSearch && matchesCategory && matchesSupplier
  })

  return (
    <Box>
      {/* 🔍 Barre de recherche multi-critères */}
      <TextField
        label="Rechercher par Nom, ID, Catégorie, Fournisseur, Référence"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        {/* 🏷️ Filtre par catégorie */}
        <FormControl fullWidth>
          <InputLabel>Filtrer par Catégorie</InputLabel>
          <Select
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

        {/* 🚚 Filtre par fournisseur */}
        <FormControl fullWidth>
          <InputLabel>Filtrer par Fournisseur</InputLabel>
          <Select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
          >
            <MenuItem value="">Tous les fournisseurs</MenuItem>
            {suppliers.map((supplier) => (
              <MenuItem key={supplier._id} value={supplier._id}>
                {supplier.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

      {/* 📊 Affichage des produits filtrés */}
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
