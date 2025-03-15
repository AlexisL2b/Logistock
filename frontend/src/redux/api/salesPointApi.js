import axiosInstance from "../../axiosConfig"

export const getSalesPoint = async () => {
  const response = await axiosInstance.get(
    `https://intranet.logistock/api/sales_points`
  )
  return response.data
}
