import React, { useEffect, useState } from "react";
import { productByCateGory } from "../Service/ProductFilterByCategoryService";
import { useNavigate } from "react-router-dom";

const HomeFullImageCard = ({ category }) => {
  const [randomProduct, setRandomProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await productByCateGory(category);

      if (response && response.length > 0) {
        // pick a random product
        const randomIndex = Math.floor(Math.random() * response.length);
        setRandomProduct(response[randomIndex]);
      }
    };

    fetchData();
  }, [category]);

  return (
    <div
      onClick={()=>navigate(`/${category}/${randomProduct.subCategory}/${randomProduct.item}`)}
      className="
        p-4 mt-5 rounded-lg shadow-sm bg-gray-300 
        w-full 
        sm:w-[100%]  
        md:w-[100%]  
        lg:w-[49%] 
        xl:w-[30%]
      "
    >
      {randomProduct && (
        <img
          src={randomProduct.images[0]}
          alt={randomProduct.title}
          className="w-full h-60 object-cover rounded-md"
        />
      )}
    </div>
  );
};

export default HomeFullImageCard;
