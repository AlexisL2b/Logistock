import React, { useEffect, useState } from "react"
import { Box, Button, Modal, Typography } from "@mui/material"
import Menu from "../../../reusable-ui/Menu" // Importez votre composant Menu
import Main from "./main/Main" // Import du composant Main
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import BarChartIcon from "@mui/icons-material/BarChart"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import Profile from "./main/profile/Profile"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import Shop from "./main/shop/Shop"
import CartModal from "./cart/CartModal"
import { useDispatch, useSelector } from "react-redux"
import {
  addToCart,
  decrementFromCart,
  loadCart,
  removeFromCart,
} from "../../../../redux/slices/cartSlice"
import Orders from "./main/order/Orders"
import {
  loadUserFromLocalStorage,
  logout,
} from "../../../../redux/slices/authSlice"

export default function DashboardUser() {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(
    (state) => state.auth.user || loadUserFromLocalStorage()
  )
  const userId = user?._id
  const handleLohgout = () => {
    console.log("logout")
    dispatch(logout())
  }
  useEffect(() => {
    if (userId) {
      dispatch(loadCart(userId))
      console.log("userId from useEffect", userId)
    }
  }, [userId, dispatch])
  // Sélection des articles du panier depuis le Redux store
  const cartItems = useSelector((state) => state.cart.items)
  // const user = useSelector((state) => state.auth.user)

  console.log("userId", userId) // Récupérer l'ID utilisateur connecté
  // console.log("user", user) // Récupérer l'ID utilisateur connecté
  useEffect(() => {
    if (userId) {
      dispatch(loadCart(userId))
      console.log("userId from useEffect", userId)
    }
  }, [userId, dispatch])
  // Calcul du total à partir des articles du panier
  const total = cartItems.reduce(
    (acc, item) => acc + item.detailsProduit.prix * item.quantity,
    0
  )
  // console.log("cartItems", cartItems)
  // État pour gérer le composant actif
  const [activeComponent, setActiveComponent] = useState("profile")

  // État pour gérer l'ouverture/fermeture de la modal
  const [isModalOpen, setModalOpen] = useState(false)

  // Liste des liens avec leurs composants associés
  const links = [
    {
      path: "profile",
      label: "Profile",
      icon: <AccountCircleIcon />,
      component: <Profile />, // Composant à afficher
    },
    {
      path: "orders",
      label: "Commandes",
      icon: <LocalShippingIcon />,
      component: <Orders />, // Composant à afficher
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

  // Gestion de la fermeture de la modal
  const handleCloseModal = () => setModalOpen(false)

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Bouton d'ouverture de la modal */}
      <Box sx={{ marginBottom: 2, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Panier
        </Button>
      </Box>
      {/* Menu */}
      <Box sx={{ display: "flex" }}>
        <Menu links={links} onLinkClick={setActiveComponent} />

        {/* Main */}
        <Main>{activeElement}</Main>
      </Box>
      {/* Modal */}

      <CartModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        cartItems={cartItems} // Passer les produits du panier en props
        total={total} // Passer le total en props
      />
      <Button onClick={handleLohgout}>Déconnexion</Button>
    </Box>
  )
}
