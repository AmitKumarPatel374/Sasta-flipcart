import apiInstance from "../config/apiInstance"
import React from "react"

export const productByCateGory = async (category) => {
  try {
    const response = await apiInstance.get(`/product/${category}`)
    return response.data.products
  } catch (error) {
    console.log(`error in find ${category} products->`, error)
  }
}
