import React, { useEffect, useState } from "react"
import { productByCateGory } from "../Service/ProductFilterByCategoryService"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const HomeProductSquareCard = ({ category }) => {
  const [products, setProducts] = useState([])
  const navigate=useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await productByCateGory(category)
      setProducts(response || [])
    }
    fetchData()
  }, [])

  return (
    <div
      className="
        p-4 mt-5 rounded-lg shadow-sm bg-gray-300 
        w-full 
        sm:w-[100%]  
        md:w-[100%]  
        lg:w-[49%] 
        xl:w-[30%]
      "
    >
      {/* ----- Header ----- */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{`${category} Top Deals`}</h1>

        <button onClick={()=>navigate(`/${category}`)} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
          <ArrowRight size={18} />
        </button>
      </div>

      {/* ----- Grid (Responsive Layout) ----- */}
      <div
        className="
          grid
          grid-cols-1       /* Mobile: 1 column */
          sm:grid-cols-2    /* Tablet: 2 columns */
          lg:grid-cols-2    /* Laptop: 2 columns */
          gap-4
        "
      >
        {products.slice(0, 4).map((product, index) => (
          <div
            key={index}
            className="
              border border-gray-300 rounded-xl p-4 bg-white 
              flex flex-col items-center
              hover:shadow-md transition-all
            "
          >
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-40 object-contain"
            />

            <h1 className="text-sm font-semibold mt-2 text-center line-clamp-2">{product.title}</h1>

            <p className="text-green-600 text-sm mt-1 font-medium">Min. 30% Off</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomeProductSquareCard
