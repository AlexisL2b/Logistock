import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getProducts } from "../api/productsApi"

// AsyncThunk pour gérer les appels API
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  getProducts
)
export const fetchTransformedProducts = createAsyncThunk(
  "products/fetchTransformedProducts",
  async () => {
    const response = await getProducts()
    // Appelle l'API
    // Transforme les données avant de les retourner
    response.map((product) => ({
      ...product,
      categorie_id: product.categorie_id ? product.categorie_id.nom : null, // Vérifie l'existence
      supplier_id: product.supplier_id ? product.supplier_id.nom : null, // Remplace l'objet fournisseur par son nom
    }))
    console.log("response:")
    return transformedData // Retourne les données transformées
  }
)

// Fonction utilitaire pour gérer les cas de fetchProducts
const handleFetchProducts = (builder) => {
  builder
    .addCase(fetchProducts.pending, (state) => {
      state.status = "loading"
    })
    .addCase(fetchProducts.fulfilled, (state, action) => {
      state.status = "succeeded"
      state.items = action.payload // Assure-toi que les données transformées sont bien stockées ici
    })

    .addCase(fetchProducts.rejected, (state, action) => {
      state.status = "failed"
      state.error = action.error.message
    })
}

// Fonction utilitaire pour fetchTransformedProducts
const handleFetchTransformedProducts = (builder) => {
  builder
    .addCase(fetchTransformedProducts.pending, (state) => {
      state.status = "loading"
    })
    .addCase(fetchTransformedProducts.fulfilled, (state, action) => {
      console.log("Transformed products:", action.payload)
      state.status = "succeeded"
      state.items = action.payload
    })
    .addCase(fetchTransformedProducts.rejected, (state, action) => {
      state.status = "failed"
      state.error = action.error.message
    })
}

// Création de la slice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {}, // Ajoutez ici des reducers synchrones si nécessaire
  extraReducers: (builder) => {
    handleFetchProducts(builder)
    handleFetchTransformedProducts(builder)
  },
  decreaseStock: (state, action) => {
    const { productId } = action.payload
    const product = state.items.find((item) => item._id === productId)

    if (product && product.quantite_stock > 0) {
      product.quantite_stock -= 1 // Réduit le stock de 1
      console.log(
        `Stock réduit pour le produit ${productId}, restant : ${product.quantite_stock}`
      )
    }
  },
  increaseStock: (state, action) => {
    const { productId } = action.payload
    const product = state.items.find((item) => item._id === productId)

    if (product) {
      product.quantite_stock += 1 // Augmente le stock de 1
      console.log(
        `Stock rétabli pour le produit ${productId}, restant : ${product.quantite_stock}`
      )
    }
  },
})

export const { decreaseStock, increaseStock } = productsSlice.actions
export default productsSlice.reducer
