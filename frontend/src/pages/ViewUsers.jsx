import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiInstance from '../config/apiInstance';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response = await apiInstance.get("/admin/get-users");
        setUsers(response.data.users);
      } catch (error) {
        console.log("Error in fetching users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg sm:text-xl font-semibold text-gray-600">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
          User List
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg text-sm sm:text-base">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-2 sm:px-4 text-left whitespace-nowrap">
                  Full Name
                </th>
                <th className="py-3 px-2 sm:px-4 text-left whitespace-nowrap">
                  Username
                </th>
                <th className="py-3 px-2 sm:px-4 text-left whitespace-nowrap">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-4 text-gray-500 text-sm sm:text-base"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(
                  (user, index) =>
                    user.role === "user" && (
                      <tr
                        key={user._id}
                        onClick={() => navigate(`/user/${user._id}`)}
                        className={`cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="py-3 px-2 sm:px-4 text-gray-700 truncate max-w-[150px] sm:max-w-none">
                          {user.fullname}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-gray-700 truncate max-w-[150px] sm:max-w-none">
                          {user.username}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-gray-700 truncate max-w-[200px] sm:max-w-none">
                          {user.email}
                        </td>
                      </tr>
                    )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view note */}
        <p className="text-xs text-gray-500 text-center mt-4 sm:hidden">
          Tip: Swipe left/right to view more columns
        </p>
      </div>
    </div>
  );
};

export default ViewUsers;
