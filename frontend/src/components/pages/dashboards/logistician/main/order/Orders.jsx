import { Box } from "@mui/material"
import React from "react"
import TabsWithPanels from "../../../../../reusable-ui/TabsWithPanels"
import Awaiting from "./pannels/Awaiting"
import InPreparation from "./pannels/InPreparation"
import Confirmed from "./pannels/Confirmed"
import Cancelled from "./pannels/Cancelled"

export default function Order() {
  const tabs = [
    { label: "En attente", component: <Awaiting /> },
    { label: "En préparation", component: <InPreparation /> },
    { label: "Validée", component: <Confirmed /> },
    { label: "Annulée", component: <Cancelled /> },
  ]
  return (
    <Box>
      <TabsWithPanels tabs={tabs} />
    </Box>
  )
}
