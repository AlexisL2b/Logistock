import Stock from "../models/stockModel.js"
import mongoose from "mongoose"

// Récupérer tous les stocks
export const getAllStocks = async (req, res) => {
  try {
    console.log("Requête reçue pour récupérer les stocks")
    const stocks = await Stock.find().populate("produit_id") // Inclut les infos du produit lié
    res.json({
      message: "Stocks récupérés avec succès",
      data: stocks,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des stocks",
      error,
    })
  }
}

// Récupérer un stock par ID
export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id).populate("produit_id")
    if (!stock) {
      return res.status(404).json({ message: "Stock introuvable" })
    }
    res.json({
      message: "Stock récupéré avec succès",
      data: stock,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du stock",
      error,
    })
  }
}

// Ajouter un nouveau stock
export const addStock = async (req, res) => {
  try {
    const newStock = new Stock(req.body)
    const savedStock = await newStock.save()
    res.status(201).json({
      message: "Stock ajouté avec succès",
      data: savedStock,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du stock",
      error,
    })
  }
}

// Mettre à jour un stock par ID
export const updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Renvoie l'objet mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock introuvable" })
    }

    res.json({
      message: "Stock mis à jour avec succès",
      data: updatedStock,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du stock",
      error,
    })
  }
}

// Mettre à jour un stock par l'ID du produit
export const updateStockByProductId = async (req, res) => {
  try {
    const { produit_id } = req.params // Récupération de l'ID du produit depuis les paramètres
    const updatedStock = await Stock.findOneAndUpdate(
      { produit_id }, // Trouve le stock correspondant à l'ID du produit
      req.body, // Mise à jour des champs
      {
        new: true, // Renvoie le document mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )

    if (!updatedStock) {
      return res
        .status(404)
        .json({ message: "Stock introuvable pour ce produit" })
    }

    res.json({
      message: "Stock mis à jour avec succès pour le produit",
      data: updatedStock,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du stock par produit",
      error,
    })
  }
}

export const handleStockEntry = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { produit_id, quantite } = req.body

    // Trouver le stock lié au produit
    const stock = await Stock.findOne({ produit_id }).session(session)

    if (!stock) {
      return res
        .status(404)
        .json({ message: "Stock introuvable pour ce produit" })
    }

    // Ajouter la quantité totale
    stock.quantite_totale += quantite

    await stock.save({ session })
    await session.commitTransaction()

    res.json({ message: "Entrée en stock réussie", data: stock })
  } catch (error) {
    await session.abortTransaction()
    res.status(500).json({ message: "Erreur lors de l'entrée en stock", error })
  } finally {
    session.endSession()
  }
}
export const handleOrderReception = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { produit_id, quantite } = req.body

    const stock = await Stock.findOne({ produit_id }).session(session)

    if (!stock) {
      return res
        .status(404)
        .json({ message: "Stock introuvable pour ce produit" })
    }

    const quantite_disponible = stock.quantite_totale - stock.quantite_reserve

    if (quantite > quantite_disponible) {
      return res
        .status(400)
        .json({ message: "Stock insuffisant pour cette commande" })
    }

    stock.quantite_reserve += quantite

    await stock.save({ session })
    await session.commitTransaction()

    res.json({ message: "Commande reçue avec succès", data: stock })
  } catch (error) {
    await session.abortTransaction()
    res
      .status(500)
      .json({ message: "Erreur lors de la réception de commande", error })
  } finally {
    session.endSession()
  }
}
export const handleStockRelease = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { produit_id, quantite } = req.body

    const stock = await Stock.findOne({ produit_id }).session(session)

    if (!stock) {
      return res
        .status(404)
        .json({ message: "Stock introuvable pour ce produit" })
    }

    if (quantite > stock.quantite_reserve) {
      return res.status(400).json({ message: "Quantité réservée insuffisante" })
    }

    stock.quantite_totale -= quantite
    stock.quantite_reserve -= quantite

    await stock.save({ session })
    await session.commitTransaction()

    res.json({ message: "Sortie de stock réussie", data: stock })
  } catch (error) {
    await session.abortTransaction()
    res
      .status(500)
      .json({ message: "Erreur lors de la sortie de stock", error })
  } finally {
    session.endSession()
  }
}

export const handleOrderDispatch = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { produit_id, quantite } = req.body

    const stock = await Stock.findOne({ produit_id }).session(session)

    if (!stock) {
      return res
        .status(404)
        .json({ message: "Stock introuvable pour ce produit" })
    }

    if (quantite > stock.quantite_reserve) {
      return res
        .status(400)
        .json({ message: "Quantité réservée insuffisante pour le départ" })
    }

    stock.quantite_reserve -= quantite

    await stock.save({ session })
    await session.commitTransaction()

    res.json({ message: "Départ de commande validé", data: stock })
  } catch (error) {
    await session.abortTransaction()
    res
      .status(500)
      .json({ message: "Erreur lors du départ de commande", error })
  } finally {
    session.endSession()
  }
}

// export const updateStockByProductId = async (req, res) => {
//   try {
//     const { produit_id } = req.params
//     console.log("produit_id", produit_id) // Convertir en ObjectId
//     const existingStock = await Stock.findOne({ produit_id: produit_id })
//     console.log("Stock trouvé :", existingStock)

//     if (!existingStock) {
//       return res
//         .status(404)
//         .json({ message: "Stock introuvable pour ce produit" })
//     }

//     // const updatedStock = await Stock.findOneAndUpdate(
//     //   { produit_id: produitId }, // Utilisation de l'ObjectId
//     //   req.body,
//     //   {*
//     //     new: true,
//     //     runValidators: true,
//     //   }
//     // )

//     // if (!updatedStock) {
//     //   return res
//     //     .status(404)
//     //     .json({ message: "Stock introuvable pour ce produit" })
//     // }

//     // res.json({
//     //   message: "Stock mis à jour avec succès pour le produit",
//     //   data: updatedStock,
//     // })
//   } catch (error) {
//     res.status(500).json({
//       message: "Erreur lors de la mise à jour du stock par produit",
//       error,
//     })
//   }
// }
// Supprimer un stock par ID
export const deleteStock = async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id)
    if (!deletedStock) {
      return res.status(404).json({ message: "Stock introuvable" })
    }
    res.json({
      message: "Stock supprimé avec succès",
      data: deletedStock,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du stock",
      error,
    })
  }
}
