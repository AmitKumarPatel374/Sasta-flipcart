import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-purple-50 flex flex-col items-center px-6 py-20">
      <h1 className="text-5xl font-extrabold text-indigo-900 mb-8 tracking-wide drop-shadow-md">
        About ShopMaster
      </h1>

      <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 text-gray-700 text-lg leading-relaxed space-y-8">
        <p>
          Welcome to <span className="font-semibold text-indigo-600">ShopMaster</span>, where
          quality meets convenience. Our passion is connecting you with the best products, carefully selected to enhance your lifestyle.
        </p>

        <p>
          Since our founding in 2023, we’ve committed to delivering exceptional service,
          reliable shipping, and unbeatable value. Your satisfaction is our top priority.
        </p>

        <p>
          With an intuitive shopping experience and a diverse product lineup, ShopMaster empowers you to find exactly what you need—fast and hassle-free.
        </p>

        <p className="italic text-indigo-700 font-semibold">
          “Shopping made simple. Trusted by thousands.” 
        </p>
      </div>

      <div className="mt-12 w-full max-w-3xl rounded-lg overflow-hidden shadow-2xl transform transition duration-500 hover:scale-105">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"
          alt="ShopMaster team"
          className="w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default About;
