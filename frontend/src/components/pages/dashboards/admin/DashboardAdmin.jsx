import { Link, Route, Router, Routes } from "react-router"
import { Box, Button } from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import CategoryIcon from "@mui/icons-material/Category"
import StoreIcon from "@mui/icons-material/Store"
import FmdGoodIcon from "@mui/icons-material/FmdGood"
import InventoryIcon from "@mui/icons-material/Inventory"
import SellIcon from "@mui/icons-material/Sell"

import Menu from "../../../reusable-ui/Menu"
import Orders from "./main/orders/Orders"
import Categories from "./main/catégories/Categories"
import Home from "./main/home/Home"
import Suppliers from "./main/suppliers/Suppliers"
import SalesPoints from "./main/salesPoints/salesPoints"
import Transporters from "./main/transporters/Transporters"
import Products from "./main/products/Products"
import { useState } from "react"
import { useDispatch } from "react-redux"
import Main from "./main/main"

export default function DashboardAdmin() {
  const [activeComponent, setActiveComponent] = useState("profile")
  const handleLogout = () => {
    //("logout")
    dispatch(logout())
  }
  const dispatch = useDispatch()

  const links = [
    {
      path: "/dashboard/home",
      label: "Dashboard",
      icon: <DashboardIcon />,
      component: <Home />,
    },
    {
      path: "/dashboard/orders",
      label: "Orders",
      icon: <ShoppingCartIcon />,
      component: <Orders />,
    },
    {
      path: "/dashboard/categories",
      label: "Categories",
      icon: <CategoryIcon />,
      component: <Categories />,
    },
    {
      path: "/dashboard/suppliers",
      label: "Fournisseur",
      icon: <InventoryIcon />,
      component: <Suppliers />,
    },
    {
      path: "/dashboard/sales_points",
      label: "Points de vente",
      icon: <FmdGoodIcon />,
      component: <SalesPoints />,
    },
    {
      path: "/dashboard/transporters",
      label: "Transporteurs",
      icon: <LocalShippingIcon />,
      component: <Transporters />,
    },
    {
      path: "products/products",
      label: "Produits",
      icon: <SellIcon />,
      component: <Products />, // Composant à afficher
    },
  ]
  const activeElement = links.find(
    (link) => link.path === activeComponent
  )?.component
  return (
    <Box sx={{ display: "flex" }}>
      <Menu links={links} onLinkClick={setActiveComponent} />

      <Main>{activeElement}</Main>
      <Button onClick={handleLogout}>Déconnexion</Button>
    </Box>
  )
}
