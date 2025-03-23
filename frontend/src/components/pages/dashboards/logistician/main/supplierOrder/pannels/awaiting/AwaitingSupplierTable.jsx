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
import { useDispatch } from "react-redux"
import {
  fetchSupplierOrders,
  modifySupplierOrder,
} from "../../../../../../../../redux/slices/supplierOrderSlice"
import { incrementStocks } from "../../../../../../../../redux/slices/stockSlice"

function Row({ row }) {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleReceive = async () => {
    await dispatch(
      modifySupplierOrder({
        orderId: row._id,
        orderData: {
          statut: "Reçue",
          receivedAt: new Date(),
        },
      })
    )
    dispatch(fetchSupplierOrders())
    row.details.map(async (product) => {
      await dispatch(
        incrementStocks({
          stockId: product.stock_id,
          quantity: product.quantity,
        })
      )
    })
    await axiosInstance.post(`/stock_logs`, {
      quantity: product.quantity,
      event: "entrée",
      stock_id: product.stock_id,
    })

    setModalOpen(false)
  }
  console.log("row depuis AwaitingSupplierTable.jsx", row)

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
        <TableCell sx={{ fontWeight: "bold", color: "#ffa000" }}>
          {row.statut}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom>
                Détails de la commande
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID Produit</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Référence</TableCell>
                    <TableCell>Catégorie</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.details.map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell>{product.product_id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.reference}</TableCell>
                      <TableCell>{product.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={() => setModalOpen(true)}
              >
                Marquer comme reçue
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
            width: isMobile ? "90%" : 600,
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Confirmer la réception de la commande ?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="success" onClick={handleReceive}>
              Oui, marquer comme reçue
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
}

export default function AwaitingSupplierTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" })
  console.log("data depuis AwaitingSupplierTable.jsx", data)
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0
    const order = sortConfig.direction === "asc" ? 1 : -1
    return a[sortConfig.key] > b[sortConfig.key] ? order : -order
  })
  console.log("sortedData depuis AwaitingSupplierTable.jsx", sortedData)
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
              ID
            </TableCell>
            <TableCell
              onClick={() => handleSort("orderedAt")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Date
            </TableCell>
            <TableCell
              onClick={() => handleSort("statut")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Statut
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

AwaitingSupplierTable.propTypes = {
  data: PropTypes.array.isRequired,
}
