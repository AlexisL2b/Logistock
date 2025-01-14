import axios from "../../axiosConfig"

export const getProducts = async () => {
  const response = await axios.get("/products")
  console.log("API Response:", response.data)
  return response.data
}
