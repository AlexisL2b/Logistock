import { Link, Route, Router, Routes } from "react-router"
import LoginPage from "../loginPage/LoginPage"
import { Box, Button } from "@mui/material"
import Menu from "../../reusable-ui/Menu"
import DashboardIcon from "@mui/icons-material/Dashboard"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import CategoryIcon from "@mui/icons-material/Category"

import Orders from "./orders/Orders"
import Categories from "./catégories/Categories"
import Home from "./home/Home"

export default function Dashboard() {
  const links = [
    { path: "/dashboard/home", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/dashboard/orders", label: "Orders", icon: <ShoppingCartIcon /> },
    {
      path: "/dashboard/categories",
      label: "Categories",
      icon: <CategoryIcon />,
    },
  ]
  return (
    <Box sx={{ height: "100vh" }}>
      <h1>Dashboard</h1>
      <Box
        sx={{
          display: "flex", // Flexbox pour aligner les enfants
          height: "100%", // Prend toute la hauteur
        }}
        className="dashboardContainer"
      >
        <Box
          sx={{
            borderRadius: 2,

            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            height: "100%",
            backgroundColor: "background.paper",
          }}
          className="dashboardSideBarre"
        >
          <Menu links={links} />
        </Box>

        <Box
          sx={{
            flex: 1, // Prend tout l'espace restant
            backgroundColor: "white", // Optionnel : couleur de fond
            padding: 2, // Espacement interne
          }}
          className="dashboardMain"
        >
          <Routes>
            <Route path="home" element={<Home />} /> {/* Chemin relatif */}
            <Route path="orders" element={<Orders />} />
            <Route path="categories" element={<Categories />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  )
}
