import React, { useEffect, useState } from "react"
import { Box, Button, Drawer, IconButton, Badge } from "@mui/material"
import Menu from "../../../reusable-ui/Menu" // Import du composant Menu
import Main from "./main/Main" // Import du composant Main
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import MenuIcon from "@mui/icons-material/Menu"
import Profile from "./main/profile/Profile"
import Shop from "./main/shop/Shop"
import CartDrawer from "./cart/cartDrawer"
import Orders from "./main/order/Orders"
import { useDispatch, useSelector } from "react-redux"
import { loadCart } from "../../../../redux/slices/cartSlice"
import { logout } from "../../../../redux/slices/authSlice"
import { loadUserFromLocalStorage } from "../../../../utils/localStorage"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

export default function DashboardUser() {
  const [openCart, setOpenCart] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const user = useSelector(
    (state) => state.auth.user || loadUserFromLocalStorage()
  )
  const userId = user?._id

  useEffect(() => {
    if (userId) {
      dispatch(loadCart(userId))
    }
  }, [userId, dispatch])
  const handleLogout = () => {
    dispatch(logout())
  }

  const cartItems = useSelector((state) => state.cart.items)
  const total = cartItems.reduce(
    (acc, item) => acc + item.detailsProduit.prix * item.quantity,
    0
  )
  const cartCount = cartItems.length // Nombre total d'articles

  const [activeComponent, setActiveComponent] = useState("profile")

  // Liste des liens avec leurs composants associés
  const links = [
    {
      path: "profile",
      label: "Profile",
      icon: <AccountCircleIcon />,
      component: <Profile />,
    },
    {
      path: "orders",
      label: "Commandes",
      icon: <LocalShippingIcon />,
      component: <Orders />,
    },
    {
      path: "shop",
      label: "Produits",
      icon: <ShoppingCartIcon />,
      component: <Shop />,
    },
  ]

  // Trouver le composant actif
  const activeElement = links.find(
    (link) => link.path === activeComponent
  )?.component

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Drawer pour mobile */}
      {isMobile && (
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
                setOpenDrawer(false)
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
      )}

      {/* Menu latéral sur desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: "250px",
            bgcolor: "background.paper",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            padding: 2,
          }}
        >
          <Menu links={links} onLinkClick={setActiveComponent} />
          <Button
            variant="outlined"
            color="error"
            onClick={() => dispatch(logout())}
            sx={{
              mt: "auto",
              borderColor: "transparent",
              "&:hover": {
                borderColor: "red",
              },
            }}
          >
            Déconnexion
          </Button>
        </Box>
      )}

      {/* Contenu principal */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {/* Header avec menu burger (gauche) et panier (droite) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {isMobile && (
            <IconButton onClick={() => setOpenDrawer(true)}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Bouton panier toujours à droite */}
          <IconButton
            color="primary"
            onClick={() => setOpenCart(true)}
            sx={{ ml: "auto" }} // Force l'alignement à droite
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>

        {/* Affichage du composant actif */}
        <Main>{activeElement}</Main>
      </Box>

      {/* Cart Drawer */}
      <CartDrawer
        open={openCart}
        onClose={() => setOpenCart(false)}
        cartItems={cartItems}
        total={total}
      />
    </Box>
  )
}
