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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"
import axiosInstance from "../../../../../../axiosConfig"
import _ from "lodash"
import { useDispatch, useSelector } from "react-redux"
import { modifyOrder } from "../../../../../../redux/slices/orderSlice"
import { fetchOrderShipments } from "../../../../../../redux/slices/orderShipmentSlice"

function Row({ row, onStatusUpdate }) {
  const [open, setOpen] = useState(false)
  const orderShipments = useSelector((state) => state.orderShipments.list)
  const [dialogOpen, setDialogOpen] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const dispatch = useDispatch()
  console.log("orderShipments depuis CollapsingTable.jsx", orderShipments)
  // Définition des couleurs pour les statuts
  const color = {
    "en cours": "orange",
    validée: "green",
    expédiée: "blue",
    annulée: "red",
    réceptionné: "purple",
  }
  useEffect(() => {
    dispatch(fetchOrderShipments())
  }, [dispatch])
  console.log("row depuis CollapsingTable.jsx", row)
  const handleReception = async () => {
    try {
      const response = await dispatch(
        modifyOrder({
          orderId: row._id,
          orderData: { statut: "réceptionné", receivedAt: new Date() },
        })
      )

      // 🔥 Mettre à jour le statut de la commande dans l'interface
      onStatusUpdate(row._id, "réceptionné")
      setDialogOpen(false)
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error)
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
        <TableCell>{row._id}</TableCell>
        <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
        <TableCell>
          {new Date(
            orderShipments?.find(
              (order) => order.order_id._id === row._id
            )?.date_shipment
          ).toLocaleString()}
        </TableCell>
        <TableCell
          sx={{ color: color[row.statut] || "black", fontWeight: "700" }}
        >
          {_.capitalize(row.statut)}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
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
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Référence</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Prix Unitaire</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.details.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.reference}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.quantity * product.price}</TableCell>
                    </TableRow>
                  ))}
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

              <Box mt={2} textAlign="right">
                {row.statut !== "réceptionné" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setDialogOpen(true)}
                    disabled={row.statut !== "expédiée"}
                  >
                    Réceptionné
                  </Button>
                )}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Dialog
        fullScreen={fullScreen}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Confirmez-vous la réception de cette commande ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleReception} color="primary" variant="contained">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
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
        name: PropTypes.string.isRequired,
        reference: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
}

export default function CollapsingTable({ data }) {
  const [orders, setOrders] = useState(data)

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, statut: newStatus } : order
      )
    )
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Identifiant commande</TableCell>
            <TableCell>Date de Commande</TableCell>
            <TableCell>Date d'éxpédition</TableCell>
            <TableCell>Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <Row key={row._id} row={row} onStatusUpdate={updateOrderStatus} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

CollapsingTable.propTypes = {
  data: PropTypes.arrayOf(Row.propTypes.row).isRequired,
}
