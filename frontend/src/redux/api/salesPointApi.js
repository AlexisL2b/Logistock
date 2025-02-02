import axiosInstance from "../../axiosConfig"

export const getSalesPoint = async () => {
  const response = await axiosInstance.get(
    `http://localhost:5000/api/sales_points`
  )
  return response.data
}
