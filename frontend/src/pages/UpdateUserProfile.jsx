import { useState, useEffect } from "react";
import apiInstance from '../config/apiInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const navigate = useNavigate();

  // Fetch current user data
  const fetchUser = async () => {
    try {
      const response = await apiInstance.get("/auth/profile", {
        withCredentials: true,
      });
      const userData = response.data.user || response.data;
      setUser(userData);
      setProfilePreview(userData.profileLogo || null);
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      setUser((prev) => ({ ...prev, profileLogo: file }));
    }
  };

  // Handle image URL
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setProfilePreview(url);
    setUser((prev) => ({ ...prev, profileLogo: url }));
  };

  // Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullname", user.fullname);
      formData.append("username", user.username);
      formData.append("mobile", user.mobile);
      formData.append("email", user.email);
      formData.append("role", user.role);

      if (user.profileLogo instanceof File) {
        formData.append("profileLogo", user.profileLogo);
      } else if (typeof user.profileLogo === "string") {
        formData.append("profileLogoUrl", user.profileLogo);
      }

      const response = await apiInstance.put("/auth/update-profile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Profile updated successfully");
      navigate("/user-profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg border border-gray-100"
      >
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Update Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          {profilePreview ? (
            <img
              src={profilePreview}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user.fullname?.[0]?.toUpperCase()}
            </div>
          )}

          {/* Upload and URL input */}
          <div className="flex flex-col gap-3 mt-4 w-full sm:w-3/4">
            <label className="cursor-pointer bg-blue-500 border border-dashed border-3 border-black text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-all text-center">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <input
              type="text"
              placeholder="Or paste image URL"
              onChange={handleUrlChange}
              className="border border-dashed border-2 border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              value={user.fullname || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={user.username || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email || ""}
              readOnly
              className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              value={user.mobile || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={user.role || ""}
              readOnly
              className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed capitalize"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold text-sm sm:text-base transition-all"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
