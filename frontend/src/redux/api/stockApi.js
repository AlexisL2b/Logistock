import axios from "axios"

// Récupérer un stock par l'ID du produit
export const getStockByProductId = async (productId) => {
  const response = await axios.get(`/api/stocks/product/${productId}`)
  return response.data
}

// Mettre à jour un stock par son ID
export const updateStockById = async (stockId, stockUpdates) => {
  const response = await axios.put(`/api/stocks/${stockId}`, stockUpdates)
  return response.data
}
