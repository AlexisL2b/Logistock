import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Paper,
  Button,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import { fetchOrdersWithDetails } from "../../../../../../../../redux/slices/orderSlice"
import axios from "axios"
import { fetchTransporters } from "../../../../../../../../redux/slices/transporterSlice"

function ConfirmedRow({ row }) {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedTransporter, setSelectedTransporter] = useState("")

  const dispatch = useDispatch()
  const transporters = useSelector((state) => state.transporters.list)
  console.log("transporters from ConfirmedRow", transporters)
  useEffect(() => {
    dispatch(fetchOrdersWithDetails())
    dispatch(fetchTransporters())
  }, [dispatch])

  const handleExpedition = async () => {
    try {
      console.log(selectedTransporter)
      if (!selectedTransporter) return
      setIsLoading(true)
      setErrorMessage("")

      const responseUpdate = await axios.put(
        `http://localhost:5000/api/orders/${row.order_id}`,
        { statut: "expédiée", transporteur_id: selectedTransporter }
      )
      const checkShipment = await axios.get(
        `http://localhost:5000/api/order_shipments/by_order_id/${row.order_id}`,
        {
          commande_id: row.order_id,
          transporteur_id: selectedTransporter,
          date_depart: new Date(),
        }
      )

      const responseShipment = await axios.post(
        `http://localhost:5000/api/order_shipments`,
        {
          commande_id: row.order_id,
          transporteur_id: selectedTransporter,
          date_depart: new Date(),
        }
      )

      console.log("Réponse après expédition :", responseUpdate)
      console.log("responseShipment après expédition :", responseShipment)
      dispatch(fetchOrdersWithDetails())
      setModalOpen(false)
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de l'expédition"
      )
      console.error(error)
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
        <TableCell>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            Expédier
          </Button>
        </TableCell>
      </TableRow>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ p: 4, backgroundColor: "white", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Sélectionner un transporteur
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }} variant="outlined">
            <InputLabel
              id="transporteur-label"
              sx={{ transform: "translate(14px, -14px) scale(0.75)" }} // Décale le label plus haut
            >
              Transporteur
            </InputLabel>
            <Select
              labelId="transporteur-label"
              id="transporteur-select"
              value={selectedTransporter}
              onChange={(e) => setSelectedTransporter(e.target.value)}
              label="Transporteur"
            >
              {transporters.data?.map((transporter) => (
                <MenuItem key={transporter._id} value={transporter._id}>
                  {transporter.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleExpedition}
              disabled={!selectedTransporter || isLoading}
            >
              {isLoading ? "Expédition..." : "Expédier"}
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

export default function ConfirmedTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Order ID</TableCell>
            <TableCell>Date de Commande</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <ConfirmedRow key={row.order_id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
