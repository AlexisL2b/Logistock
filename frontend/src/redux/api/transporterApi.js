import axiosInstance from "../../axiosConfig"

export const getTransporters = async () => {
  const response = await axiosInstance.get(
    "https://intranet.logistock/api/transporters"
  )
  return response
}
export const updateTransporter = async (transporterId, transporterUpdates) => {
  const response = await axiosInstance.put(
    `https://intranet.logistock/api/transporters/${transporterId}`,
    transporterUpdates
  )
  return response
}
