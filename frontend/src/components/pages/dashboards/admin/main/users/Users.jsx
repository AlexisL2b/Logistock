import { useEffect, useState } from "react"
import { Box, TextField } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import BasicTable from "./BasicTableAdmin"
import BasicTableAdmin from "./BasicTableAdmin"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers } from "../../../../../../redux/slices/userSlice"

export default function Users() {
  const [usersFiltered, setUsersFiltered] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const users = useSelector((state) => state.users.list)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUsers()) // Charger les stocks une seule fois
  }, [dispatch])

  // Fonction pour récupérer les utilisateurs depuis l'API

  // Mettre à jour `usersFiltered` à chaque changement de `users`
  useEffect(() => {
    if (users?.length) {
      const userTab = users.map((user) => ({
        _id: user._id,
        nom: user.lastname,
        prenom: user.firstname,
        adresse: user.address,
        email: user.email,
        "point de vente": user.sales_point?.name || "N/A", // ✅ Correction du champ sales_point
        rôle: user.role?.name || "N/A", // ✅ Suppression de `role_id`
      }))
      setUsersFiltered(userTab)
    }
  }, [users]) // 🔥 users est dans les dépendances, donc mise à jour automatique

  // Chargement initial des utilisateurs
  useEffect(() => {
    dispatch(fetchUsers())
  }, [])

  // Fonction appelée pour recharger les données après une modification
  const handleDataChange = () => {
    dispatch(fetchUsers())
  }

  // Mapping des en-têtes du tableau
  const headerMapping = {
    _id: "ID",
    nom: "Nom",
    prenom: "Prénom",
    adresse: "Adresse",
    email: "Email",
    point_vente_nom: "Point de vente",
    role: "Role",
  }

  return (
    <Box>
      {/* 🔍 Champ de recherche multi-critères */}
      <TextField
        label="Rechercher par Nom, ID, Téléphone, Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table avec les données filtrées */}
      <BasicTableAdmin
        admin={true}
        data={usersFiltered}
        coll={"users"}
        onDataChange={handleDataChange}
        headerMapping={headerMapping}
        trigger={users.length} // 🔥 Change la prop pour forcer un rerender
      />
    </Box>
  )
}
