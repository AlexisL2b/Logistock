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
    `http://localhost:5000/api/stocks/${stockId}`,
    stockUpdates
  )
  return response.data
}

export const getStock = async () => {
  const response = await axiosInstance.get(
    `http://localhost:5000/api/stocks/all`
  )
  return response.data
}
export const decrementStock = async (orderDetails) => {
  const response = await axiosInstance.post(
    `http://localhost:5000/api/stocks/decrement`,
    { orderDetails }
  )
  return response.data
}
