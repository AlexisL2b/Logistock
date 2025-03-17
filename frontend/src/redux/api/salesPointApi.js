import axiosInstance from "../../axiosConfig"

// 🔹 Récupérer tous les points de vente
export const getSalesPoint = async () => {
  const response = await axiosInstance.get(
    `http://localhost:5000/api/sales_points`
  )
  return response.data
}

// ✅ 🔹 Récupérer les points de vente sans utilisateur
export const getSalesPointsWithoutUsers = async () => {
  const response = await axiosInstance.get(
    `http://localhost:5000/api/sales_points/without-users`
  )
  return response.data
}
