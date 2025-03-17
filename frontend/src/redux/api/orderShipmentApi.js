import axiosInstance from "../../axiosConfig"

// Récupérer tous les départs de commandes
export const getOrderShipments = async () => {
  const response = await axiosInstance.get(
    "http://localhost:5000/api/order_shipments"
  )

  return response.data
}

// Récupérer un départ de commande par ID
export const getOrderShipmentById = async (id) => {
  const response = await axiosInstance.get(
    `http://localhost:5000/api/orderShipments/${id}`
  )
  return response.data
}

// Récupérer un départ de commande par commande ID
export const getOrderShipmentByCommandeId = async (commandeId) => {
  const response = await axiosInstance.get(
    `http://localhost:5000/api/order_shipments/commande/${commandeId}`
  )
  return response.data
}

// Ajouter un nouveau départ de commande
export const addOrderShipment = async (orderShipmentData) => {
  const response = await axiosInstance.post(
    "http://localhost:5000/api/order_shipments",
    orderShipmentData
  )
  return response.data
}

// Mettre à jour un départ de commande par ID
export const updateOrderShipment = async (id, orderShipmentUpdates) => {
  const response = await axiosInstance.put(
    `http://localhost:5000/api/order_shipments/${id}`,
    orderShipmentUpdates
  )
  return response.data
}

// Supprimer un départ de commande par ID
export const deleteOrderShipment = async (id) => {
  const response = await axiosInstance.delete(
    `http://localhost:5000/api/order_shipments/${id}`
  )
  return response.data
}
