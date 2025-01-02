import mongoose from "mongoose"
const productSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    description: { type: String },
    prix: { type: Number, required: true },
    quantite_stock: { type: Number, default: 0 },
    categorie_id: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
    fournisseur_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fournisseurs",
    },
  },
  { collection: "products" } // Force le nom de la collection
)

const Product = mongoose.model("Product", productSchema)
export default Product
