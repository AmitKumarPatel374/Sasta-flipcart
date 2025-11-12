import { useState, useEffect, useContext } from "react";
import apiInstance from '../config/apiInstance';
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Shield } from "lucide-react";
import { usercontext } from "../context/DataContext";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setToken, setRole } = useContext(usercontext);

  const fetchUser = async () => {
    try {
      const response = await apiInstance.get("/auth/profile", {
        withCredentials: true,
      });
      setUser(response.data.user || response.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch profile");
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logoutHandler = async () => {
    try {
      const response = await apiInstance.delete("/auth/logout");
      setToken(false);
      setRole(null);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log("Error in logout ->", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-base sm:text-lg font-semibold text-gray-700">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-base sm:text-lg">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-base sm:text-lg">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg text-center border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center">
          {/* Profile Image or Initial */}
          {user.profileLogo ? (
            <img
              src={user.profileLogo}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-md border-2 border-blue-500"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-md">
              {user.fullname?.[0]?.toUpperCase()}
            </div>
          )}

          <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-800 break-words">
            {user.fullname}
          </h2>
          <p className="text-sm sm:text-base text-gray-500">@{user.username}</p>

          {/* User Details */}
          <div className="mt-6 w-full text-left space-y-4">
            <div className="flex flex-wrap items-center gap-3 border-b pb-2">
              <Mail className="text-blue-500 min-w-[20px]" size={18} />
              <span className="text-gray-700 break-all text-sm sm:text-base">
                {user.email}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-b pb-2">
              <Phone className="text-green-500 min-w-[20px]" size={18} />
              <span className="text-gray-700 text-sm sm:text-base">
                {user.mobile || "Not provided"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="text-purple-500 min-w-[20px]" size={18} />
              <span className="capitalize text-gray-700 text-sm sm:text-base">
                {user.role === "seller" ? "Seller" : "User"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => navigate("/update-user-profile")}
              className="w-full bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition-all text-sm sm:text-base shadow-md active:scale-[0.98]"
            >
              Update Profile
            </button>

            <button
              onClick={logoutHandler}
              className="w-full bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition-all text-sm sm:text-base shadow-md active:scale-[0.98]"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
