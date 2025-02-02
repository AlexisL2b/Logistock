import axiosInstance from "../../axiosConfig"

export const getTransporters = async () => {
  const response = await axiosInstance.get(
    "http://localhost:5000/api/transporters"
  )
  return response
}
export const updateTransporter = async (transporterId, transporterUpdates) => {
  const response = await axiosInstance.put(
    `http://localhost:5000/api/transporters/${transporterId}`,
    transporterUpdates
  )
  return response
}
