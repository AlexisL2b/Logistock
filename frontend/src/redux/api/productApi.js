import axiosInstance from "../../axiosConfig"

// Récupérer les produits
export const getProducts = async () => {
  const response = await axiosInstance.get(
    "https://intranet.logistock/api/products"
  )

  return response.data
}

// Mettre à jour le stock d'un produit
export const updateProductStock = async (productId, newStock) => {
  const response = await axiosInstance.put(
    `https://intranet.logistock/api/products/${productId}`,
    {
      quantite_stock: newStock,
    }
  )
  return response.data
}
