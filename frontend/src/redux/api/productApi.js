import axiosInstance from "../../axiosConfig"

// Récupérer les produits
export const getProducts = async () => {
  const response = await axiosInstance.get("http://localhost:5000/api/products")

  return response.data
}

// Mettre à jour le stock d'un produit
export const updateProductStock = async (productId, newStock) => {
  const response = await axiosInstance.put(
    `http://localhost:5000/api/products/${productId}`,
    {
      quantite_stock: newStock,
    }
  )
  return response.data
}
