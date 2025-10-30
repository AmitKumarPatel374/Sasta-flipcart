import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiInstance from "../apiInstance";

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
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-600">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          User List
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    onClick={() => navigate(`/admin/users/${user._id}`)}
                    className={`cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4 text-gray-700">{user.fullname}</td>
                    <td className="py-3 px-4 text-gray-700">{user.username}</td>
                    <td className="py-3 px-4 text-gray-700">{user.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
