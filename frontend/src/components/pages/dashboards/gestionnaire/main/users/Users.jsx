import { useEffect, useState } from "react"
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import BasicTable from "./BasicTable"
import { useDispatch, useSelector } from "react-redux"
import { fetchSalesPoints } from "../../../../../../redux/slices/salesPointSlice"

export default function Transporters() {
  const [users, setUsers] = useState([])
  const [usersFiltered, setUsersFiltered] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPointVente, setSelectedPointVente] = useState("")

  const salesPoints = useSelector((state) => state.salesPoints.salesPoints)
  const dispatch = useDispatch()

  // Fonction pour récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/buyers")
      console.log("Utilisateurs reçus :", response.data)

      const usersData = response.data.buyers || []

      setUsers(usersData)
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error)
    }
  }

  // Mise à jour de usersFiltered en fonction des filtres
  useEffect(() => {
    let filteredUsers = users.map((user) => ({
      _id: user._id,
      nom: user.name,
      prenom: user.firstname,
      adresse: user.address,
      email: user.email,
      point_vente_nom: user.sale_point_id?.name || "N/A",
    }))

    if (selectedPointVente) {
      filteredUsers = filteredUsers.filter(
        (user) => user.point_vente_nom === selectedPointVente
      )
    }

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.nom.toLowerCase().includes(lowerSearchTerm) ||
          user.prenom.toLowerCase().includes(lowerSearchTerm) ||
          user.email.toLowerCase().includes(lowerSearchTerm)
      )
    }

    setUsersFiltered(filteredUsers)
  }, [users, searchTerm, selectedPointVente])

  useEffect(() => {
    fetchUsers()
    dispatch(fetchSalesPoints())
  }, [])

  const handleDataChange = () => {
    fetchUsers()
  }

  const headerMapping = {
    nom: "Nom",
    prenom: "Prénom",
    adresse: "Adresse",
    email: "Email",
    point_vente_nom: "Point de vente",
  }

  return (
    <Box>
      {/* Filtres alignés proprement */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        {/* 🔍 Champ de recherche */}
        <TextField
          label="Rechercher par Nom, Prénom, Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* 📍 Filtre par Point de Vente */}
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel
            shrink
            sx={{
              position: "absolute",
              background: "white",
              px: 1,
              mt: -0.5,
              // Ajuste la hauteur pour éviter l'encadrement
            }}
          >
            Point de Vente
          </InputLabel>
          <Select
            value={selectedPointVente}
            onChange={(e) => setSelectedPointVente(e.target.value)}
            displayEmpty
            sx={{ textAlign: "left" }}
          >
            <MenuItem value="">Points de vente</MenuItem>

            {salesPoints.map((point) => (
              <MenuItem key={point._id} value={point.nom}>
                {point.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 🔄 Bouton de réinitialisation (hauteur réduite) */}
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setSearchTerm("")
            setSelectedPointVente("")
          }}
          sx={{
            height: "40px", // Hauteur fixe
            width: { xs: "120px", sm: "140px", md: "160px" }, // Largeur responsive
            px: 2, // Padding horizontal
            py: 1, // Padding vertical ajusté
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.35rem", sm: "0.55rem", md: "0.8rem" }, // Taille du texte responsive
              fontWeight: 600,
              whiteSpace: "nowrap", // Évite la coupure du texte
              overflow: "hidden", // Prévient les débordements
              textOverflow: "ellipsis", // Ajoute "..." si le texte dépasse
            }}
          >
            Réinitialiser
          </Typography>
        </Button>
      </Box>

      {/* Table avec les données filtrées */}
      <BasicTable
        admin={false}
        data={usersFiltered}
        coll={"users"}
        onDataChange={handleDataChange}
        headerMapping={headerMapping}
        trigger={users.length} // 🔥 Change la prop pour forcer un rerender
      />
    </Box>
  )
}
