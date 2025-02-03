import { useEffect, useState } from "react"
import { Box, TextField } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import BasicTable from "./BasicTable"

export default function Transporters() {
  const [users, setUsers] = useState([])
  const [usersFiltered, setUsersFiltered] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fonction pour récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users")
      console.log("Utilisateurs reçus :", response.data)

      const usersData = response.data || [] // Sécurisation des données

      // 🔹 Filtrer les utilisateurs ayant le role_id spécifique
      const filteredUsers = usersData.filter(
        (user) => user.role_id === "677cf977b39853e4a17727e3"
      )

      setUsers(filteredUsers) // Mise à jour du state avec les utilisateurs filtrés
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error)
    }
  }

  // Mettre à jour `usersFiltered` à chaque changement de `users`
  useEffect(() => {
    const userTab = users.map((user) => ({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      adresse: user.adresse,
      email: user.email,
      point_vente_nom: user.point_vente_id?.nom || "N/A",
    }))
    setUsersFiltered(userTab) // Mise à jour propre du state
  }, [users]) // 🔥 users est dans les dépendances, donc mise à jour automatique

  // Chargement initial des utilisateurs
  useEffect(() => {
    fetchUsers()
  }, [])

  // Fonction appelée pour recharger les données après une modification
  const handleDataChange = () => {
    fetchUsers()
  }

  // Mapping des en-têtes du tableau
  const headerMapping = {
    _id: "ID",
    nom: "Nom",
    prenom: "Prénom",
    adresse: "Adresse",
    email: "Email",
    point_vente_nom: "Point de vente",
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
      <BasicTable
        admin={false}
        data={usersFiltered}
        coll={"users"}
        onDataChange={handleDataChange}
        headerMapping={headerMapping}
      />
    </Box>
  )
}
