import mongoose from "mongoose"
const productSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    quantite_stock: { type: Number, required: true },
    categorie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    fournisseur_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
  },
  { collection: "products" } // Force le nom de la collection
)

const Product = mongoose.model("Product", productSchema)
export default Product
