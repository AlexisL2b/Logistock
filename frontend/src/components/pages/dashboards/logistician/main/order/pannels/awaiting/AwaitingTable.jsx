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
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import {
  fetchStocks,
  updateStock,
} from "../../../../../../../../redux/slices/stockSlice"
import { fetchOrdersWithDetails } from "../../../../../../../../redux/slices/orderSlice"
import { io } from "socket.io-client"
import _ from "lodash"
import axiosInstance from "../../../../../../../../axiosConfig"

function Row({ row }) {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const stocks = useSelector((state) => state.stocks.stocks)

  useEffect(() => {
    const socket = io("http://localhost:5000")

    socket.on("stocksUpdated", (updatedStocks) => {
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

    return () => socket.disconnect()
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchOrdersWithDetails())
  }, [dispatch])

  const handleCancel = async () => {
    if (!window.confirm("Confirmez-vous l'annulation de cette commande ?"))
      return
    try {
      await axiosInstance.put(
        `http://localhost:5000/api/orders/${row.order_id}`,
        { statut: "annulée" }
      )

      dispatch(fetchOrdersWithDetails())
      setModalOpen(false)
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de l'annulation"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const hasStockIssue = row.produitDetails.some((product) => {
    const stockInfo = stocks?.find(
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
      console.log("orderDetails from AwaitingTable", orderDetails)

      await axiosInstance.post("http://localhost:5000/api/stocks/decrement", {
        orderDetails,
      })
      await axiosInstance.put(
        `http://localhost:5000/api/orders/${row.order_id}`,
        { statut: "validée" }
      )

      dispatch(fetchStocks())
      dispatch(fetchOrdersWithDetails())
      setModalOpen(false)
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de la validation"
      )
    } finally {
      setIsLoading(false)
    }
  }
  console.log("row", row)

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.order_id}</TableCell>
        <TableCell>{new Date(row.date_commande).toLocaleString()}</TableCell>
        <TableCell
          sx={{
            fontWeight: "bold",
            color: row.statut === "annulée" ? "red" : "orange",
          }}
        >
          {_.capitalize(row.statut)}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom>
                Détails des produits
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID Produit</TableCell>
                    <TableCell>Nom du produit</TableCell>
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
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantite}</TableCell>
                        <TableCell>{product.prix_unitaire}</TableCell>
                        <TableCell>
                          {stockInfo ? stockInfo.quantite_disponible : "N/A"}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => setModalOpen(true)}
              >
                Voir Récapitulatif
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 500,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Récapitulatif de la commande
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID Produit</TableCell>
                  <TableCell>Quantité</TableCell>
                  <TableCell>Prix Unitaire</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {row.produitDetails.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.produit_id}</TableCell>
                    <TableCell>{product.quantite}</TableCell>
                    <TableCell>{product.prix_unitaire}</TableCell>
                    <TableCell>
                      {product.quantite * product.prix_unitaire}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
              {isLoading ? "Validation..." : "Valider"}
            </Button>
            <Button variant="contained" color="error" onClick={handleCancel}>
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
              <IconButton aria-label="expand row" size="small">
                {sortConfig.key === "order_id" &&
                  (sortConfig.direction === "asc" ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  ))}
              </IconButton>
            </TableCell>
            <TableCell
              onClick={() => handleSort("date_commande")}
              style={{ cursor: "pointer" }}
            >
              Date de Commande{" "}
              <IconButton aria-label="expand row" size="small">
                {sortConfig.key === "date_commande" &&
                  (sortConfig.direction === "asc" ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  ))}
              </IconButton>
            </TableCell>
            <TableCell
              onClick={() => handleSort("statut")}
              style={{ cursor: "pointer" }}
            >
              Statut{" "}
              <IconButton aria-label="expand row" size="small">
                {sortConfig.key === "statut" &&
                  (sortConfig.direction === "asc" ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  ))}
              </IconButton>
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
