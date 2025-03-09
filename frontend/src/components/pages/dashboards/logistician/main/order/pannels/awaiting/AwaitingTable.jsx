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
  decrementStock,
  fetchStocks,
} from "../../../../../../../../redux/slices/stockSlice"
import {
  fetchOrders,
  modifyOrder,
} from "../../../../../../../../redux/slices/orderSlice"
import _ from "lodash"
import axiosInstance from "../../../../../../../../axiosConfig"
import { showNotification } from "../../../../../../../../redux/slices/notificationSlice"
import { createStockLog } from "../../../../../../../../redux/api/stockLogApi"
import { createLog } from "../../../../../../../../redux/slices/stockLogSlice"

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
    dispatch(fetchStocks())
    // dispatch(fetchOrders())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const handleCancel = async () => {
    if (!window.confirm("Confirmez-vous l'annulation de cette commande ?"))
      return
    try {
      await axiosInstance.put(`http://localhost:5000/api/orders/${row._id}`, {
        statut: "annulée",
      })

      dispatch(fetchOrders())
      setModalOpen(false)
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de l'annulation"
      )
    } finally {
      setIsLoading(false)
    }
  }
  const hasStockIssue = row.details.some((product) => {
    const stockInfo = stocks?.find(
      (stock) => stock.product_id === product.product_id
    )
    return product.quantity > (stockInfo ? stockInfo.quantity : 0)
  })

  const handleValidate = async () => {
    try {
      dispatch(fetchStocks())
      setIsLoading(true)
      setErrorMessage("")

      const orderDetails = row.details.map((product) => ({
        product_id: product.product_id,
        quantity: product.quantity,
      }))

      console.log("orderDetails", orderDetails)
      const responseStock = await dispatch(decrementStock({ orderDetails }))
      console.log("responseStock depuis AwaitingTable.jsx", responseStock)
      console.log(responseStock.payload.updatedStocks)
      console.log("row._id depuis AwaitingTable.jsx", row._id)
      await dispatch(
        modifyOrder({
          orderId: row._id,
          orderData: {
            statut: "validée",
            confirmedAt: new Date(),
          },
        })
      )

      responseStock.payload.updatedStocks.map(async (stock) => {
        // Trouver le produit correspondant dans le tableau d'origine
        const product = orderDetails.find(
          (p) => p.product_id === stock.product_id
        )

        // Vérifier si le produit existe pour éviter une erreur
        const quantity = product ? product.quantity : 0

        // Envoyer la requête avec la quantité trouvée

        await dispatch(
          createLog({
            stock_id: stock.stockId,
            event: "sortie",
            quantity: quantity, // Prend la valeur trouvée ou 0 par défaut
          })
        )
      })

      dispatch(fetchStocks())
      dispatch(fetchOrders())
      setModalOpen(false)
      dispatch(
        showNotification({
          message: "Commande validée avec succès",
          severity: "success",
        })
      )
    } catch (error) {
      dispatch(
        showNotification({
          message:
            "Une erreur est survenue lors de la validation de la commande.",
          severity: "error",
        })
      )
      console.error(error)
    }
  }

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row._id}</TableCell>
        <TableCell>{new Date(row.orderedAt).toLocaleString()}</TableCell>
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
              <Typography variant="body1" gutterBottom>
                {row.buyer.firstname}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {row.buyer.lastname}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {row.buyer.address}
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
                  {row.details.map((product) => {
                    const stockInfo = stocks.find(
                      (stock) => stock.product_id === product.product_id
                    )
                    const isStockInsufficient =
                      product.quantity > (stockInfo ? stockInfo.quantity : 0)

                    return (
                      <TableRow
                        key={product._id}
                        sx={{
                          backgroundColor: isStockInsufficient
                            ? "#ffebee"
                            : "#edffeb", // Rouge léger si stock insuffisant
                          transition: "background-color 0.3s ease-in-out", // Effet fluide
                        }}
                      >
                        <TableCell>{product.product_id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.price}€</TableCell>
                        <TableCell>
                          {stockInfo ? stockInfo.quantity : "N/A"}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow>
                    <TableCell
                      align="right"
                      colSpan={4}
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        paddingTop: "20px",
                        paddingBottom: "10px",
                        borderTop: "2px solid #ddd",
                        backgroundColor: "#f5f5f5", // Fond léger pour différencier
                      }}
                    >
                      Total de la commande :
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        paddingTop: "20px",
                        paddingBottom: "10px",
                        borderTop: "2px solid #ddd",
                        backgroundColor: "#f5f5f5",
                        color: "#d32f2f", // Couleur rouge pour mettre en valeur
                      }}
                    >
                      {row.totalAmount}€
                    </TableCell>
                  </TableRow>
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
            width: isMobile ? "90%" : 700,
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
                  <TableCell>Produit</TableCell>
                  <TableCell>Quantité</TableCell>
                  <TableCell>Prix Unitaire</TableCell>
                  <TableCell>Total disponible</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {row.details.map((product) => {
                  const stockInfo = stocks.find(
                    (stock) => stock.product_id === product.product_id
                  )
                  const isStockInsufficient =
                    product.quantity > (stockInfo ? stockInfo.quantity : 0)

                  return (
                    <TableRow
                      key={product._id}
                      sx={{
                        backgroundColor: isStockInsufficient
                          ? "#ffebee"
                          : "#edffeb", // Rouge léger si stock insuffisant
                        transition: "background-color 0.3s ease-in-out", // Effet de transition fluide
                      }}
                    >
                      <TableCell>{product.product_id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.price}€</TableCell>
                      <TableCell>
                        {stockInfo ? stockInfo.quantity : "N/A"}
                      </TableCell>
                    </TableRow>
                  )
                })}
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
    _id: PropTypes.string.isRequired,
    date_order: PropTypes.string.isRequired,
    statut: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        product_id: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
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
              onClick={() => handleSort("_id")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Order ID{" "}
              <IconButton aria-label="expand row" size="small">
                {sortConfig.key === "_id" &&
                  (sortConfig.direction === "asc" ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  ))}
              </IconButton>
            </TableCell>
            <TableCell
              onClick={() => handleSort("date_order")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Date de Commande{" "}
              <IconButton aria-label="expand row" size="small">
                {sortConfig.key === "date_order" &&
                  (sortConfig.direction === "asc" ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  ))}
              </IconButton>
            </TableCell>
            <TableCell
              onClick={() => handleSort("statut")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
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
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

CollapsingTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      date_order: PropTypes.string.isRequired,
      statut: PropTypes.string.isRequired,
      details: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          product_id: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          price: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
}
