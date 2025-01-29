import axios from "axios"

export const getTransporters = async () => {
  const response = await axios.get("/api/transporters")
  return response
}
export const updateTransporter = async (transporterId, transporterUpdates) => {
  const response = await axios.put(
    `/api/transporters/${transporterId}`,
    transporterUpdates
  )
  return response
}
