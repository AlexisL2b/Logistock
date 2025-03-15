import axiosInstance from "../../axiosConfig"

// Récupérer un stock par l'ID du produit
export const createStockLog = async (logsData) => {
  const response = await axiosInstance.post(
    "https://intranet.logistock/api/stock_logs/",
    logsData
  )
  return response.data
}
