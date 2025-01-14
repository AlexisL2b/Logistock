// import { Link, Route, Router, Routes } from "react-router"
// import LoginPage from "../loginPage/LoginPage"
// import { Box, Button } from "@mui/material"
// import DashboardIcon from "@mui/icons-material/Dashboard"
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
// import LocalShippingIcon from "@mui/icons-material/LocalShipping"
// import CategoryIcon from "@mui/icons-material/Category"
// import StoreIcon from "@mui/icons-material/Store"
// import FmdGoodIcon from "@mui/icons-material/FmdGood"
// import InventoryIcon from "@mui/icons-material/Inventory"
// import SellIcon from "@mui/icons-material/Sell"

// import Menu from "../../reusable-ui/Menu"
// import Orders from "./orders/Orders"
// import Categories from "./catégories/Categories"
// import Home from "./home/Home"
// import Suppliers from "./suppliers/Suppliers"
// import SalesPoints from "./salespoints/salesPoints"
// import Transporters from "./transporters/Transporters"
// import Products from "./products/Products"

// export default function Dashboard() {
//   const links = [
//     { path: "/dashboard/home", label: "Dashboard", icon: <DashboardIcon /> },
//     { path: "/dashboard/orders", label: "Orders", icon: <ShoppingCartIcon /> },
//     {
//       path: "/dashboard/categories",
//       label: "Categories",
//       icon: <CategoryIcon />,
//     },
//     {
//       path: "/dashboard/suppliers",
//       label: "Fournisseur",
//       icon: <InventoryIcon />,
//     },
//     {
//       path: "/dashboard/sales_points",
//       label: "Points de vente",
//       icon: <FmdGoodIcon />,
//     },
//     {
//       path: "/dashboard/transporters",
//       label: "Transporteurs",
//       icon: <LocalShippingIcon />,
//     },
//     {
//       path: "/dashboard/products",
//       label: "Produits",
//       icon: <SellIcon />,
//     },
//   ]
//   return (
//     <Box sx={{ height: "100vh" }}>
//       <h1>Dashboard</h1>
//       <Box
//         sx={{
//           display: "flex", // Flexbox pour aligner les enfants
//           height: "100%", // Prend toute la hauteur
//         }}
//         className="dashboardContainer"
//       >
//         <Box
//           sx={{
//             borderRadius: 2,

//             borderTopLeftRadius: "0px",
//             borderBottomLeftRadius: "0px",
//             height: "100%",
//             backgroundColor: "background.paper",
//           }}
//           className="dashboardSideBarre"
//         >
//           <Menu links={links} />
//         </Box>

//         <Box
//           sx={{
//             flex: 1, // Prend tout l'espace restant
//             backgroundColor: "white", // Optionnel : couleur de fond
//             padding: 2, // Espacement interne
//           }}
//           className="dashboardMain"
//         >
//           <Routes>
//             <Route path="home" element={<Home />} /> {/* Chemin relatif */}
//             <Route path="orders" element={<Orders />} />
//             <Route path="categories" element={<Categories />} />
//             <Route path="suppliers" element={<Suppliers />} />
//             <Route path="sales_points" element={<SalesPoints />} />
//             <Route path="transporters" element={<Transporters />} />
//             <Route path="products" element={<Products />} />
//           </Routes>
//         </Box>
//       </Box>
//     </Box>
//   )
// }
import React from "react"
import { Box } from "@mui/material"
import { Routes, Route } from "react-router"
import Menu from "./Menu"

export default function Dashboard({ links }) {
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
        {/* Barre latérale (Menu) */}
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

        {/* Contenu principal (Routes) */}
        <Box
          sx={{
            flex: 1, // Prend tout l'espace restant
            backgroundColor: "white", // Optionnel : couleur de fond
            padding: 2, // Espacement interne
          }}
          className="dashboardMain"
        >
          <Routes>
            {links.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}
          </Routes>
        </Box>
      </Box>
    </Box>
  )
}
