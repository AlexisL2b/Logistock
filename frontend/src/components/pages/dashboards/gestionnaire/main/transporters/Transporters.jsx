import { useEffect, useState } from "react"
import { Box, TextField, Typography } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTable from "../../../../../reusable-ui/tables/EnhancedTable"
import { useDispatch, useSelector } from "react-redux"
import { fetchTransporters } from "../../../../../../redux/slices/transporterSlice"

export default function Transporters() {
  const [searchTerm, setSearchTerm] = useState("")
  const transporters = useSelector((state) => state.transporters.list)
  const dispatch = useDispatch()

  // Chargement initial des transporteurs
  useEffect(() => {
    dispatch(fetchTransporters())
  }, [transporters])

  // Callback pour gérer les changements de données
  const handleDataChange = () => {
    fetchTransporters() // Recharge les données lorsque le callback est déclenché
  }

  const headerMapping = {
    _id: "ID",
    nom: "Nom",
    phone: "Téléphone",
    email: "Email",
  }

  const fields = {
    name: { type: "text", label: "Nom", required: true },
    phone: { type: "tel", label: "phone", required: true },
    email: { type: "email", label: "Email", required: true },
  }

  // 🔍 Filtrage multi-critères : Nom, ID, Téléphone, Email
  const filteredTransporters = transporters.filter((transporter) => {
    const searchLower = searchTerm.toLowerCase()

    return (
      transporter.name.toLowerCase().includes(searchLower) || // Nom du transporteur
      transporter._id.toLowerCase().includes(searchLower) || // ID du transporteur
      (transporter.phone && transporter.phone.includes(searchLower)) || // Téléphone
      (transporter.email &&
        transporter.email.toLowerCase().includes(searchLower)) // Email
    )
  })

  return (
    <Box sx={{ padding: 3 }}>
      {/* 🏷️ Titre principal */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Transporteurs
      </Typography>
      {/* 🔍 Champ de recherche multi-critères */}
      <TextField
        label="Rechercher par Nom, ID, Téléphone, Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Passe les transporteurs filtrés à EnhancedTable */}
      <EnhancedTable
        formStructure={fields}
        data={filteredTransporters}
        coll={"transporters"}
        onDataChange={handleDataChange}
        headerMapping={headerMapping}
      />
    </Box>
  )
}
