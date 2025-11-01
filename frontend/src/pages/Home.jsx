import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { usercontext } from "../context/DataContext";

const LandingPage = () => {

  const {token} = useContext(usercontext);

  const navigate=useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          ShopMaster
        </h1>
      </header>

      {/* Main Content */}
      <main className="max-w-xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to ShopMaster
        </h2>
        <p className="text-gray-600 mb-8">
          Your one-stop online store for the latest and greatest products. 
          Discover, shop, and enjoy exclusive deals all in one place.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex justify-center gap-6 mb-10">
          <button onClick={()=>token?navigate("/view-all-product"):navigate("/login")} className="bg-blue-600 cursor-pointer text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">
            Shop Now
          </button>
          <button onClick={()=>token?navigate("/about"):navigate("/login")} className="border border-blue-600 cursor-pointer text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition">
            Learn More
          </button>
        </div>

        {/* Feature Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">
              Get your orders delivered quickly and reliably, right at your doorstep.
            </p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">Best Quality</h3>
            <p className="text-gray-600 text-sm">
              We carefully select the best products to ensure you get only top quality.
            </p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">
              Our support team is here to assist you anytime, anywhere.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ShopMaster. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
