import axiosInstance from "../../axiosConfig"

// 🔥 Récupérer toutes les commandes avec détails
export const getOrderDetails = async () => {
  const response = await axiosInstance.get(
    "http://localhost:5000/api/order_details"
  )
  return response.data
}

// 🔥 Récupérer une commande par ID
export const getOrderDetailsById = async (orderId) => {
  const response = await axiosInstance.get(
    `http://localhost:5000/api/orders/${orderId}`
  )
  return response.data
}

// 🔥 Ajouter une nouvelle commande
export const addOrderDetails = async (orderData) => {
  const response = await axiosInstance.post(
    "http://localhost:5000/api/order_details",
    orderData
  )
  return response.data
}

// 🔥 Mettre à jour une commande
export const updateOrderDetails = async (orderId, orderData) => {
  const response = await axiosInstance.put(
    `http://localhost:5000/api/order_details/${orderId}`,
    orderData
  )
  return response.data
}

// 🔥 Supprimer une commande
export const deleteOrderDetails = async (orderId) => {
  const response = await axiosInstance.delete(
    `http://localhost:5000/api/order_details/${orderId}`
  )
  return response.data
}
