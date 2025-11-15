import React, { useEffect, useState } from "react"
import Slider from "react-slick"
import { productByCateGory } from "../Service/ProductFilterByCategoryService"
import { useNavigate } from "react-router-dom"

// =============================
// ARROW STYLING (INLINE CSS)
// =============================
const arrowStyles = `
  .slick-prev:before,
  .slick-next:before {
    font-size: 35px !important;     /* Arrow size */
    color: black !important;         /* Arrow color */
  }

  .slick-prev, .slick-next {
    z-index: 10;
    width: 45px !important;          /* Click area width */
    height: 45px !important;         /* Click area height */
  }

  .slick-prev {
    left: -10px !important;          /* Left arrow position */
  }

  .slick-next {
    right: -10px !important;         /* Right arrow position */
  }
`

const HomeProductRectangleCard = ({ category }) => {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const response = await productByCateGory(category)
      setProducts((response || []).slice(0, 10)) // Only 10 products
    }
    fetchData()
  }, [category])

  // =============================
  // SLICK SLIDER SETTINGS
  // =============================
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 5, // show 6 cards
    slidesToScroll: 2, // next click = show remaining 4
    arrows: true,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,

    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4, // tablet
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1028,
        settings: {
          slidesToShow: 3, // mobile
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 2, // mobile
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1, // mobile
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div className="w-full h-[40vh] p-4 bg-gray-300 rounded-xl">
      {/* ----- Header ----- */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{`${category} Top Deals`}</h1>
      </div>

      {/* Inject Arrow CSS */}
      <style>{arrowStyles}</style>

      <Slider {...sliderSettings}>
        {products.slice(0, 10).map((product, i) => (
          <div
            key={i}
            className="p-2"
          >
            <div
              onClick={() => navigate(`/${category}/${product.subCategory}/${product.item}`)}
              className="bg-white rounded-xl shadow-md p-3 flex flex-col items-center justify-center h-full"
            >
              <img
                src={product.images[0]}
                alt=""
                className="w-full h-40 object-contain"
              />
              <h1 className="text-sm mt-2 text-center line-clamp-1">{product.title}</h1>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default HomeProductRectangleCard
