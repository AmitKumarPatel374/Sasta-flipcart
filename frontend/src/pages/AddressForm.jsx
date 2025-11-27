import GetDeliveryAddress from "../components/GetDeliveryAddress";
import AddressFormLayout from "../layouts/AddressFormLayout";
import React, { useState } from "react";

const AddressForm = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* DELIVERY ADDRESSES */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Delivery Addresses
        </h1>
        <GetDeliveryAddress selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
      </div>

      {/* ADD NEW BUTTON */}
      <div className="flex justify-center">
        <button
          className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition mb-8"
          onClick={() => setIsAdd(true)}
        >
          + Add New Delivery Address
        </button>
      </div>

      {/* ADD NEW ADDRESS FORM */}
      {isAdd && (
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6 mb-10">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Add Delivery Address
          </h2>
          <button onClick={()=>setIsAdd(false)} className="bg-red-500 py-2 px-6 rounded-xl font-bold">X</button>
          </div>
          <AddressFormLayout setIsAdd={setIsAdd} />
        </div>
      )}
    </div>
  );
};

export default AddressForm;
