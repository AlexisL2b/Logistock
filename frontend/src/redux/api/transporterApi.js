export const getTransporters = async () => {
  const response = await axiosInstance.get("/api/transporters")
  return response
}
export const updateTransporter = async (transporterId, transporterUpdates) => {
  const response = await axiosInstance.put(
    `/api/transporters/${transporterId}`,
    transporterUpdates
  )
  return response
}
