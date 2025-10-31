import { useState, useEffect, useContext } from "react";
import apiInstance from "../apiInstance";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Shield } from "lucide-react";
import axios from "axios";
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
                withCredentials: true, // JWT in cookies
            });
            setUser(response.data.user || response.data);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch profile");
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logoutHandler=async()=>{
          try {
            const response= await apiInstance.delete("/auth/logout");
            setToken(false);
            setRole(null);
            toast.success(response.data.message);
            navigate("/login");
          } catch (error) {
            console.log("error in logout->",error);
          }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-semibold">Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md text-center border border-gray-200">
                <div className="flex flex-col items-center">
                    {/* Profile Image or Initial */}
                    {user.profileLogo ? (
                        <img
                            src={user.profileLogo}
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover shadow-md border-2 border-blue-500"
                        />
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                            {user.fullname?.[0]?.toUpperCase()}
                        </div>
                    )}

                    <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                        {user.fullname}
                    </h2>
                    <p className="text-sm text-gray-500">@{user.username}</p>

                    {/* User Details */}
                    <div className="mt-6 w-full text-left space-y-4">
                        <div className="flex items-center gap-3 border-b pb-2">
                            <Mail className="text-blue-500" />
                            <span className="text-gray-700">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 border-b pb-2">
                            <Phone className="text-green-500" />
                            <span className="text-gray-700">{user.mobile}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="text-purple-500" />
                            <span className="capitalize text-gray-700">
                                {user.role === "seller" ? "Seller" : "User"}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <button
                        onClick={()=>navigate("/update-user-profile")}
                        className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all cursor-pointer"
                    >
                        Update Profile
                    </button>

                    <button
                        onClick={logoutHandler}
                        className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
