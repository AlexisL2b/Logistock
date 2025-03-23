import axiosInstance from "../../axiosConfig"

// 🔥 Récupérer toutes les commandes fournisseurs
export const getSupplierOrders = async () => {
  const response = await axiosInstance.get(
    "http://localhost:5000/api/suppliers_orders"
  )
  return response.data
}

// 🔥 Récupérer une commande fournisseur par ID
export const getSupplierOrderById = async (orderId) => {
  const response = await axiosInstance.get(
    `http://localhost:5000/api/suppliers_orders/${orderId}`
  )
  return response.data
}

// 🔥 Ajouter une nouvelle commande fournisseur
export const addSupplierOrder = async (orderData) => {
  const response = await axiosInstance.post(
    "http://localhost:5000/api/suppliers_orders",
    orderData
  )
  return response.data
}

// 🔥 Mettre à jour une commande fournisseur
export const updateSupplierOrder = async (orderId, orderData) => {
  const response = await axiosInstance.put(
    `http://localhost:5000/api/suppliers_orders/${orderId}`,
    orderData
  )
  return response.data
}

// 🔥 Supprimer une commande fournisseur
export const deleteSupplierOrder = async (orderId) => {
  const response = await axiosInstance.delete(
    `http://localhost:5000/api/suppliers_orders/${orderId}`
  )
  return response.data
}
