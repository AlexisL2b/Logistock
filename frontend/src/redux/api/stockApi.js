import axiosInstance from "../../axiosConfig"

// Récupérer un stock par l'ID du produit
export const getStockByProductId = async (productId) => {
  const response = await axiosInstance.get(
    `http://localhost:5000/api/stocks/product/${productId}`
  )
  return response.data
}

// Mettre à jour un stock par son ID
export const updateStockById = async (stockId, stockUpdates) => {
  const response = await axiosInstance.put(
    `/api/stocks/${stockId}`,
    stockUpdates
  )
  return response.data
}

export const getStock = async () => {
  const response = await axiosInstance.get(`/api/stocks/all`)
  return response.data
}
