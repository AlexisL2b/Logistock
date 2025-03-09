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
import CustomSelect from "../../../../../reusable-ui/selects/CustomSelect"
import {
  deleteUserById,
  fetchBuyers,
} from "../../../../../../redux/slices/userSlice"

export default function Transporters() {
  const [users, setUsers] = useState([])
  const [usersFiltered, setUsersFiltered] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPointVente, setSelectedPointVente] = useState("")
  const users2 = useSelector((state) => state)
  console.log("users2 depuis Users.jsx", users2)
  const salesPoints = useSelector((state) => state.salesPoints.list)
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
      nom: user.lastname,
      prenom: user.firstname,
      adresse: user.address,
      email: user.email,
      point_vente_nom: user.sales_point?.name || "N/A",
      role: user.role?.name || "N/A",
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
          user.name.toLowerCase().includes(lowerSearchTerm) ||
          user.prenom.toLowerCase().includes(lowerSearchTerm) ||
          user.email.toLowerCase().includes(lowerSearchTerm)
      )
    }

    setUsersFiltered(filteredUsers)
  }, [users, searchTerm, selectedPointVente])

  useEffect(() => {
    fetchUsers()
    dispatch(fetchSalesPoints())
    dispatch(fetchBuyers())
  }, [])

  const handleDataChange = () => {
    dispatch(fetchUsers())
  }

  const headerMapping = {
    nom: "Nom",
    prenom: "Prénom",
    adresse: "Adresse",
    email: "Email",
    point_vente_nom: "Point de vente",
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* 🏷️ Titre principal */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Utilisateurs
      </Typography>
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

        <CustomSelect
          inputLabelId="filtrePointVenteLabel"
          inputLabel="Filtrer par Points de vente"
          selectId="filtrePointVente"
          selectLabel="Filtrer par Points de vente"
          defaultMenuItemLabel="Tous les Points de vente"
          menuItems={salesPoints}
          selectedValue={selectedPointVente}
          onChange={(e) => setSelectedPointVente(e.target.value)}
        />

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
        trigger={users.length}
      />
    </Box>
  )
}
