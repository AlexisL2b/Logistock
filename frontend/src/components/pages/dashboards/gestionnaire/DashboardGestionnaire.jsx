import { useState } from "react"
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import CategoryIcon from "@mui/icons-material/Category"
import FmdGoodIcon from "@mui/icons-material/FmdGood"
import InventoryIcon from "@mui/icons-material/Inventory"
import SellIcon from "@mui/icons-material/Sell"
import MenuIcon from "@mui/icons-material/Menu"
import LogoutIcon from "@mui/icons-material/Logout"
import CompareArrowsIcon from "@mui/icons-material/CompareArrows"
import { useDispatch } from "react-redux"
import { logout } from "../../../../redux/slices/authSlice"
import Menu from "../../../reusable-ui/Menu"
import Categories from "./main/catégories/Categories"
import Suppliers from "./main/suppliers/Suppliers"
import Transporters from "./main/transporters/Transporters"
import Users from "./main/users/Users"
import Products from "./main/products/Products"
import Main from "./main/Main"
import Profile from "../user/main/profile/Profile"
import Stocks from "./main/stocks/Stocks"
import SalesPoints from "./main/salespoints/salesPoints"

export default function DashboardGestionnaire() {
  const [activeComponent, setActiveComponent] = useState("dashboard")
  const [openDrawer, setOpenDrawer] = useState(false)
  const dispatch = useDispatch()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleLogout = () => {
    dispatch(logout())
  }

  const links = [
    {
      path: "dashboard",
      label: "Profile",
      icon: <DashboardIcon />,
      component: <Profile />,
    },
    {
      path: "users",
      label: "Utilisateur",
      icon: <DashboardIcon />,
      component: <Users />,
    },

    {
      path: "categories",
      label: "Categories",
      icon: <CategoryIcon />,
      component: <Categories />,
    },
    {
      path: "stocks",
      label: "Stocks",
      icon: <CompareArrowsIcon />,
      component: <Stocks />,
    },
    {
      path: "suppliers",
      label: "Fournisseur",
      icon: <InventoryIcon />,
      component: <Suppliers />,
    },
    {
      path: "sales_points",
      label: "Points de vente",
      icon: <FmdGoodIcon />,
      component: <SalesPoints />,
    },
    {
      path: "transporters",
      label: "Transporteurs",
      icon: <LocalShippingIcon />,
      component: <Transporters />,
    },
    {
      path: "products",
      label: "Produits",
      icon: <SellIcon />,
      component: <Products />,
    },
  ]

  const activeElement = links.find(
    (link) => link.path === activeComponent
  )?.component

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Drawer (menu latéral caché sur mobile) */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box
          sx={{
            width: 250,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Menu
            links={links}
            onLinkClick={(path) => {
              setActiveComponent(path)
              setOpenDrawer(false) // Ferme le menu après sélection
            }}
          />
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ mt: "auto" }}
          >
            Déconnexion
          </Button>
        </Box>
      </Drawer>

      {/* Menu latéral fixe sur desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: "250px",
            bgcolor: "background.paper",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            padding: 2,
            justifyContent: "center",
          }}
        >
          <Menu links={links} onLinkClick={setActiveComponent} />
          <Button
            startIcon={<LogoutIcon />}
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ mt: "auto" }}
          >
            Déconnexion
          </Button>
        </Box>
      )}

      {/* Contenu principal */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, position: "relative" }}>
        {/* Bouton menu burger sur mobile (FIXÉ EN HAUT À GAUCHE) */}
        {isMobile && (
          <IconButton
            onClick={() => setOpenDrawer(true)}
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              color: "black",
              backgroundColor: "white",
              boxShadow: 2,
              zIndex: 1000, // Pour rester au-dessus du contenu
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Espace pour éviter que le menu burger cache le contenu */}
        <Box sx={{ mt: isMobile ? 6 : 0 }}>
          <Main>{activeElement}</Main>
        </Box>
      </Box>
    </Box>
  )
}
