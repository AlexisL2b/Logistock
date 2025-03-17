import { Box, Typography } from "@mui/material"
import React from "react"
import TabsWithPanels from "../../../../../reusable-ui/tables/TabsWithPanels"
import Awaiting from "./pannels/awaiting/Awaiting"
import Shipped from "./pannels/shipped/Shipped"
import Confirmed from "./pannels/confirmed/Confirmed"
import Cancelled from "./pannels/cancelled/Cancelled"
import Receive from "./pannels/receive/Receive"

export default function Order() {
  const tabs = [
    { label: "En attente", component: <Awaiting /> },
    { label: "Validée", component: <Confirmed /> },
    { label: "Expédiée", component: <Shipped /> },
    { label: "Réceptionnée", component: <Receive /> },
    { label: "Annulée", component: <Cancelled /> },
  ]
  return (
    <Box sx={{ padding: 3 }}>
      {/* 🏷️ Titre principal */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Commandes
      </Typography>
      <TabsWithPanels tabs={tabs} />
    </Box>
  )
}
