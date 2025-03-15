import axiosInstance from "../../axiosConfig"

// 🔥 Récupérer toutes les commandes avec détails
export const getOrders = async () => {
  const response = await axiosInstance.get(
    "https://intranet.logistock/api/orders"
  )
  return response.data
}
// 🔥 Récupérer une commande par ID
export const getOrderById = async (orderId) => {
  const response = await axiosInstance.get(
    `https://intranet.logistock/api/orders/${orderId}`
  )
  return response.data
}
// 🔥 Ajouter une nouvelle commande
export const addOrder = async (orderData) => {
  const response = await axiosInstance.post(
    "https://intranet.logistock/api/orders",
    orderData
  )

  return response.data
}
// 🔥 Mettre à jour une commande
export const updateOrder = async (orderId, orderData) => {
  const response = await axiosInstance.put(
    `https://intranet.logistock/api/orders/${orderId}`,
    orderData
  )
  return response.data
}
// 🔥 Supprimer une commande
export const deleteOrder = async (orderId) => {
  const response = await axiosInstance.delete(
    `https://intranet.logistock/api/orders/${orderId}`
  )
  return response.data
}
