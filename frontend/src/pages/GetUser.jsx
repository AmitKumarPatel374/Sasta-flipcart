import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, Phone, Shield, Calendar, ArrowLeft } from "lucide-react";
import apiInstance from '../config/apiInstance';

const GetUser = () => {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await apiInstance.get(`/admin/get-user/${user_id}`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading user details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 sm:p-6 text-white flex flex-col sm:flex-row justify-between items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
            User Details
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 text-sm bg-white text-blue-600 px-4 py-1.5 rounded-lg shadow-sm hover:bg-blue-50 transition-all w-full sm:w-auto"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center rounded-full text-4xl font-bold shadow-md">
              {user.fullname?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mt-3 text-gray-800">
              {user.fullname}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">@{user.username}</p>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" />
              <div>
                <label className="text-gray-500 text-xs sm:text-sm">Email</label>
                <p className="font-medium text-gray-800 break-words text-sm sm:text-base">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-blue-600" />
              <div>
                <label className="text-gray-500 text-xs sm:text-sm">Mobile</label>
                <p className="font-medium text-gray-800 text-sm sm:text-base">
                  {user.mobile || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="text-blue-600" />
              <div>
                <label className="text-gray-500 text-xs sm:text-sm">Role</label>
                <p className="font-medium text-gray-800 capitalize text-sm sm:text-base">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" />
              <div>
                <label className="text-gray-500 text-xs sm:text-sm">Created At</label>
                <p className="font-medium text-gray-800 text-sm sm:text-base">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <Calendar className="text-blue-600" />
              <div>
                <label className="text-gray-500 text-xs sm:text-sm">
                  Last Updated
                </label>
                <p className="font-medium text-gray-800 text-sm sm:text-base">
                  {new Date(user.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-all w-full sm:w-auto"
            >
              Back
            </button>
            <button
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all w-full sm:w-auto"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetUser;
