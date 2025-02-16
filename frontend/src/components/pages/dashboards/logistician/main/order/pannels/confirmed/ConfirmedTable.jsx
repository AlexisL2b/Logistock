import React, { useEffect, useState } from "react"
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Backdrop,
  Fade,
} from "@mui/material"
import { KeyboardArrowDown, KeyboardArrowUp, Close } from "@mui/icons-material"
import { useSelector, useDispatch } from "react-redux"
import { fetchOrdersWithDetails } from "../../../../../../../../redux/slices/orderSlice"
import { fetchTransporters } from "../../../../../../../../redux/slices/transporterSlice"
import _ from "lodash"
import axiosInstance from "../../../../../../../../axiosConfig"
import CustomSelect from "../../../../../../../reusable-ui/CustomSelect"

function ConfirmedRow({ row }) {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedTransporter, setSelectedTransporter] = useState("")
  const color = {
    "en cours": "orange",
    validée: "green",
    expédiée: "blue",
    annulée: "red",
    réceptionné: "purple", // Nouveau statut
  }
  const dispatch = useDispatch()
  const transporters = useSelector((state) => state.transporters.list)

  useEffect(() => {
    dispatch(fetchOrdersWithDetails())
    dispatch(fetchTransporters())
  }, [dispatch])

  const handleExpedition = async () => {
    try {
      if (!selectedTransporter) return
      setIsLoading(true)
      setErrorMessage("")

      await axiosInstance.put(`http://localhost:5000/api/orders/${row._id}`, {
        statut: "expédiée",
        transporteur_id: selectedTransporter,
      })
      console.log(row._id)

      await axiosInstance.post(`http://localhost:5000/api/order_shipments`, {
        order_id: row._id,
        transporter_id: selectedTransporter,
      })

      dispatch(fetchOrdersWithDetails())
      setModalOpen(false)
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de l'expédition"
      )
    } finally {
      setIsLoading(false)
    }
  }
  console.log(transporters)
  return (
    <>
      {/* Ligne principale */}
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
        <TableCell>{new Date(row.date_order).toLocaleString()}</TableCell>
        <TableCell
          sx={{
            color: color[row.statut] || "black",
            fontWeight: "700",
          }}
        >
          {_.capitalize(row.statut)}
        </TableCell>
      </TableRow>

      {/* Volet déroulant pour les détails */}
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
                    <TableCell>Nom</TableCell>
                    <TableCell>Référence</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Prix Unitaire</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.produitDetails.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.reference}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.quantity * product.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Bouton Expédier dans le volet déroulant */}
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setModalOpen(true)}
                >
                  Expédier
                </Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Nouvelle Modale pour sélectionner un transporteur */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              borderRadius: "10px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" fontWeight="bold">
                Sélectionner un transporteur
              </Typography>
              <IconButton onClick={() => setModalOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            <CustomSelect
              inputLabelId="transporteurLabel"
              inputLabel="Transporteur"
              selectId="transporteurLabel"
              selectLabel="Transporteur"
              defaultMenuItemLabel="Tous les transporteurs"
              menuItems={transporters}
              selectedValue={selectedTransporter}
              onChange={(e) => setSelectedTransporter(e.target.value)}
            />
            {/* <FormControl fullWidth sx={{ mt: 2 }} variant="outlined">
              <InputLabel id="transporteur-label">Transporteur</InputLabel>
              <Select
                labelId="transporteur-label"
                value={selectedTransporter}
                onChange={(e) => setSelectedTransporter(e.target.value)}
                label="Transporteur"
              >
                {transporters.data?.map((transporter) => (
                  <MenuItem key={transporter._id} value={transporter._id}>
                    {transporter.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}

            <Box
              sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
            >
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
        </Fade>
      </Modal>
    </>
  )
}

export default function ConfirmedTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" })

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
              {sortConfig.key === "_id" && (
                <IconButton size="small">
                  {sortConfig.direction === "asc" ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              )}
            </TableCell>
            <TableCell
              onClick={() => handleSort("date_order")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Date de Commande{" "}
              {sortConfig.key === "date_order" && (
                <IconButton size="small">
                  {sortConfig.direction === "asc" ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              )}
            </TableCell>
            <TableCell
              onClick={() => handleSort("statut")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Statut{" "}
              {sortConfig.key === "statut" && (
                <IconButton size="small">
                  {sortConfig.direction === "asc" ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <ConfirmedRow key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
