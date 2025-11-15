import React, { useContext, useEffect, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import apiInstance from "../config/apiInstance"
import { useNavigate } from "react-router-dom"
import { usercontext } from "../context/DataContext"
import { toast } from "react-toastify"
import NavbarFilter from "../components/NavbarFilter"
import HomeProductSquareCard from "../layouts/HomeProductSquareCard"
import HomeProductRectangleCard from "../layouts/HomeProductRectangleCard"
import HomeFullImageCard from "../layouts/HomeFullImageCard"
import HomeProductSlider from "../layouts/HomeProductSlider"

const ViewAllProducts = () => {
 
  return (
    <div className="">
      <NavbarFilter />
      <HomeProductSlider />
      <div className="p-10">
        <div className="flex flex-wrap  mt-5 justify-between">
          <HomeProductSquareCard category={"Fashion"} />
          <HomeProductSquareCard category={"Electronics"} />
          <HomeProductSquareCard category={"Electronics"} />
        </div>
        <div className=" mt-5">
          <HomeProductRectangleCard category={"Fashion"} />
        </div>
        <div className="flex flex-wrap  mt-5 justify-between">
          <HomeProductSquareCard category={"Home & Furniture"} />
          <HomeProductSquareCard category={"Beauty & Food"} />
          <HomeFullImageCard category={"Beauty & Food"}/>
        </div>
      </div>
    </div>
  )
}

export default ViewAllProducts
