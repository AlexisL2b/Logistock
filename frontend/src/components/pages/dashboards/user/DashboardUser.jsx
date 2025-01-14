import React, { useState } from "react"
import { Box } from "@mui/material"
import Menu from "../../../reusable-ui/Menu" // Importez votre composant Menu
import Main from "./main/Main" // Import du composant Main
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import BarChartIcon from "@mui/icons-material/BarChart"
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket"
import Profile from "./main/profile/Profile"
import Analytics from "./main/analytics/Analytics"
import Basket from "./main/basket/Basket"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import Shop from "./main/shop/Shop"

export default function DashboardUser() {
  // État pour gérer le composant actif
  const [activeComponent, setActiveComponent] = useState("profile")

  // Liste des liens avec leurs composants associés
  const links = [
    {
      path: "profile",
      label: "Profile",
      icon: <AccountCircleIcon />,
      component: <Profile />, // Composant à afficher
    },
    {
      path: "analytics",
      label: "Analytics",
      icon: <BarChartIcon />,
      component: <Analytics />, // Composant à afficher
    },
    {
      path: "basket",
      label: "Panier",
      icon: <ShoppingBasketIcon />,
      component: <Basket />, // Composant à afficher
    },
    {
      path: "shop",
      label: "Produits",
      icon: <ShoppingCartIcon />,
      component: <Shop />, // Composant à afficher
    },
  ]

  // Récupérer le composant actif
  const activeElement = links.find(
    (link) => link.path === activeComponent
  )?.component

  return (
    <Box sx={{ display: "flex" }}>
      {/* Menu */}
      <Menu links={links} onLinkClick={setActiveComponent} />

      {/* Main */}
      <Main>{activeElement}</Main>
    </Box>
  )
}
