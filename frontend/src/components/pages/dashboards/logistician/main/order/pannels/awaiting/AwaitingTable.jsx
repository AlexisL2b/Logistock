import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Box,
  Typography,
  Paper,
  Button,
  Modal,
  Tooltip,
} from "@mui/material"
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import {
  fetchStocks,
  updateStock,
} from "../../../../../../../../redux/slices/stockSlice"
import { io } from "socket.io-client"
import axios from "axios"
import { fetchOrdersWithDetails } from "../../../../../../../../redux/slices/orderSlice"

function Row({ row }) {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const dispatch = useDispatch()

  // Récupérer les stocks depuis Redux
  const stocks = useSelector((state) => state.stocks.stocks)

  // Écouter les mises à jour en temps réel via Socket.IO
  useEffect(() => {
    const socket = io("http://localhost:5000") // Connexion au backend

    // Réception des mises à jour des stocks
    socket.on("stocksUpdated", (updatedStocks) => {
      //("Stocks mis à jour via Socket.IO :", updatedStocks)
      updatedStocks.forEach((stock) => {
        dispatch(
          updateStock({
            stockId: stock.stockId,
            stockUpdates: { quantite_totale: stock.quantite_totale },
          })
        )
      })
      dispatch(fetchStocks())
      dispatch(fetchOrdersWithDetails())
    })
    //("stocks from useEffect", stocks)
    return () => socket.disconnect() // Déconnexion propre
  }, [dispatch])

  const hasStockIssue = row.produitDetails.some((product) => {
    const stockInfo = stocks.find(
      (stock) => stock.produit_id === product.produit_id
    )
    return product.quantite > (stockInfo ? stockInfo.quantite_totale : 0)
  })

  const handleValidate = async () => {
    try {
      dispatch(fetchStocks())
      setIsLoading(true)
      setErrorMessage("")

      const orderDetails = row.produitDetails.map((product) => ({
        produit_id: product.produit_id,
        quantite: product.quantite,
      }))
      //("row/////////////////////", row)
      const response = await axios.post(
        "http://localhost:5000/api/stocks/decrement",
        { orderDetails }
      )
      const responseUpdate = await axios.put(
        `http://localhost:5000/api/orders/${row.order_id}`,
        { statut: "validée" }
      )

      console.log("responseUpdate brute :", responseUpdate)

      response.data.updatedStocks.forEach((stock) => {
        dispatch(
          updateStock({
            stockId: stock.stockId,
            stockUpdates: { quantite_totale: stock.quantite_totale },
          })
        )
      })

      //(
      // "Stocks mis à jour après validation :",
      // response.data.updatedStocks
      // )
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de la validation"
      )
      //(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.order_id}</TableCell>
        <TableCell>{new Date(row.date_commande).toLocaleString()}</TableCell>
        <TableCell>{row.statut}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom>
                Détails des produits
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell>ID Produit</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Prix Unitaire</TableCell>
                    <TableCell>Stock Disponible</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.produitDetails.map((product) => {
                    const stockInfo = stocks.find(
                      (stock) => stock.produit_id === product.produit_id
                    )
                    return (
                      <TableRow key={product._id}>
                        <TableCell>{product.produit_id}</TableCell>
                        <TableCell>{product.quantite}</TableCell>
                        <TableCell>{product.prix_unitaire}</TableCell>
                        <TableCell>
                          {stockInfo ? stockInfo.quantite_totale : "N/A"}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setModalOpen(true)}
                sx={{ mt: 2 }}
              >
                Voir Récapitulatif
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ p: 4 }}>
          <Typography id="modal-title" variant="h6" gutterBottom>
            Récapitulatif de la commande
          </Typography>
          <Table size="small" aria-label="recapitulatif">
            <TableHead>
              <TableRow>
                <TableCell>ID Produit</TableCell>
                <TableCell>Quantité</TableCell>
                <TableCell>Prix Unitaire</TableCell>
                <TableCell>Stock Disponible</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.produitDetails.map((product) => {
                const stockInfo = stocks.find(
                  (stock) => stock.produit_id === product.produit_id
                )
                return (
                  <TableRow key={product._id}>
                    <TableCell>{product.produit_id}</TableCell>
                    <TableCell>{product.quantite}</TableCell>
                    <TableCell>{product.prix_unitaire}</TableCell>
                    <TableCell>
                      {stockInfo ? stockInfo.quantite_totale : "N/A"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleValidate}
              disabled={hasStockIssue || isLoading}
            >
              {isLoading ? "Validation..." : "Valider la commande"}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setModalOpen(false)}
            >
              Annuler
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

Row.propTypes = {
  row: PropTypes.shape({
    order_id: PropTypes.string.isRequired,
    date_commande: PropTypes.string.isRequired,
    statut: PropTypes.string.isRequired,
    produitDetails: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        produit_id: PropTypes.string.isRequired,
        quantite: PropTypes.number.isRequired,
        prix_unitaire: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
}

export default function CollapsingTable({ data }) {
  const dispatch = useDispatch()
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" })

  // Charger les stocks au démarrage
  useEffect(() => {
    dispatch(fetchStocks())
  }, [dispatch])

  // Fonction de tri
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  // Appliquer le tri sur les données
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0 // Si pas de tri sélectionné, ne rien changer
    const order = sortConfig.direction === "asc" ? 1 : -1
    return a[sortConfig.key] > b[sortConfig.key] ? order : -order
  })

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell
              onClick={() => handleSort("order_id")}
              style={{ cursor: "pointer" }}
            >
              Order ID{" "}
              {sortConfig.key === "order_id" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableCell>
            <TableCell
              onClick={() => handleSort("date_commande")}
              style={{ cursor: "pointer" }}
            >
              Date de Commande{" "}
              {sortConfig.key === "date_commande" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableCell>
            <TableCell
              onClick={() => handleSort("statut")}
              style={{ cursor: "pointer" }}
            >
              Statut{" "}
              {sortConfig.key === "statut" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <Row key={row.order_id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

CollapsingTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      order_id: PropTypes.string.isRequired,
      date_commande: PropTypes.string.isRequired,
      statut: PropTypes.string.isRequired,
      produitDetails: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          produit_id: PropTypes.string.isRequired,
          quantite: PropTypes.number.isRequired,
          prix_unitaire: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
}
