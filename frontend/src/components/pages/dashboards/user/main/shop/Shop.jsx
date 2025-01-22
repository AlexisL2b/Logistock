import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchProducts } from "../../../../../../redux/slices/productsSlice"
import { Box } from "@mui/material"
import ProductCard from "./ProductCard"

export default function Shop() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.items)
  const status = useSelector((state) => state.products.status)
  const error = useSelector((state) => state.products.error)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts())
    }
  }, [status, dispatch])
  // console.log("Products in Shop.jsx:", products)

  return (
    <Box>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </Box>
  )
}
