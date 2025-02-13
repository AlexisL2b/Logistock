import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { collection: "categories", versionKey: false }
)

const Category = mongoose.model("Category", categorySchema)

export default Category
