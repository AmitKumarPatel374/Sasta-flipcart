import React, { useEffect, useState } from "react";
import { productByCateGory } from "../Service/ProductFilterByCategoryService";
import { useParams } from "react-router-dom";

const CategoryBasedTopProduct = () => {
  const { category } = useParams();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await productByCateGory(category);
      setProducts(response || []);
      console.log(response);
    };
    fetchData();
  }, [category]);

  return (
    <div className="flex flex-col p-5">
      {/* ----- Header ----- */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{`${category} Top Deals`}</h1>
      </div>

      {/* ----- Grid Layout ----- */}
      <div
        className="
          grid 
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          gap-4
        "
      >
        {products.map((product, index) => {
          const discount =
            ((product?.price?.MRP - product?.price?.amount) * 100) /
            product?.price?.MRP;

          return (
            discount >= 30 && (
              <div
                key={index}
                className="
                  border border-gray-300 rounded-xl p-4 bg-white 
                  flex flex-col items-center
                  hover:shadow-md transition-all
                "
              >
                <img
                  src={product?.images?.[0]}
                  alt={product?.title}
                  className="w-full h-40 object-contain"
                />

                <h1 className="text-sm font-semibold mt-2 text-center line-clamp-2">
                  {product?.title}
                </h1>

                <p className="text-green-600 text-sm mt-1 font-medium">
                  Min. {Math.round(discount)}% Off
                </p>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBasedTopProduct;
