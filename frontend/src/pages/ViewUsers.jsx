import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiInstance from "../config/apiInstance";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User, Mail, Shield } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response = await apiInstance.get("/admin/get-users");
        setUsers(response.data.users);
      } catch (error) {
        console.log("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ✅ GSAP animations
  useEffect(() => {
    if (!loading && users.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".page-title",
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );

        gsap.fromTo(
          ".user-card",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".user-card",
              start: "top 90%",
            },
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [users, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100">
        <p className="text-lg font-semibold text-gray-700 animate-pulse">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 px-6 py-12"
    >
      {/* Page Title */}
      <h1 className="page-title text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">
        All Registered Users
      </h1>

      {users.filter((u) => u.role === "user").length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {users
            .filter((u) => u.role === "user")
            .map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/user/${user._id}`)}
                className="user-card relative bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              >
                {/* Avatar / Icon */}
                <div className="flex justify-center mb-5">
                  {user.profileLogo ? (
                    <img
                      src={user.profileLogo}
                      alt={user.fullname}
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                      {user.fullname?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {user.fullname}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">@{user.username}</p>

                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center justify-center gap-2">
                      <Mail size={16} className="text-blue-500" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Shield size={16} className="text-purple-500" />
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </div>
                </div>

                {/* Hover gradient glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-300 via-blue-200 to-purple-300 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
