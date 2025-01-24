import { Box, Button } from "@mui/material"
import Menu from "../../../reusable-ui/Menu" // Importez votre composant Menu

import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { logout } from "../../../../redux/slices/authSlice"
import AccountTreeIcon from "@mui/icons-material/AccountTree"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import Orders from "./main/order/Orders"
import Main from "./main/Main"
import Profile from "./main/profile/Profile"

export default function DashboardLogistician() {
  const [activeComponent, setActiveComponent] = useState("profile")
  const handleLohgout = () => {
    console.log("logout")
    dispatch(logout())
  }
  const dispatch = useDispatch()

  const links = [
    {
      path: "orders",
      label: "Commandes",
      icon: <AccountTreeIcon />,
      component: <Orders />, // Composant à afficher
    },
    {
      path: "profile",
      label: "Profile",
      icon: <AccountCircleIcon />,
      component: <Profile />, // Composant à afficher
    },
  ]
  const activeElement = links.find(
    (link) => link.path === activeComponent
  )?.component

  return (
    <Box sx={{ display: "flex" }}>
      <Menu links={links} onLinkClick={setActiveComponent} />

      <Main>{activeElement}</Main>
      <Button onClick={handleLohgout}>Déconnexion</Button>
    </Box>
  )
}
