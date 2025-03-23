import { Box, Typography } from "@mui/material"
import React from "react"
import TabsWithPanels from "../../../../../reusable-ui/tables/TabsWithPanels"
import AwaitingSupplierOrders from "./pannels/awaiting/AwaitingSupplierOrders"
import ReceivedSupplierOrders from "./pannels/received/ReceivedSupplierOrders"
// import CancelledSupplierOrders from "./panels/cancelled/CancelledSupplierOrders"
// import AllSupplierOrders from "./panels/all/AllSupplierOrders"

export default function SupplierOrder() {
  const tabs = [
    {
      label: "En attente de traitement",
      component: <AwaitingSupplierOrders />,
    },
    { label: "Réceptionnée", component: <ReceivedSupplierOrders /> },
    // { label: "Annulée", component: <CancelledSupplierOrders /> },
    // { label: "Toutes", component: <AllSupplierOrders /> },
  ]

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Commandes Fournisseurs
      </Typography>
      <TabsWithPanels tabs={tabs} />
    </Box>
  )
}
