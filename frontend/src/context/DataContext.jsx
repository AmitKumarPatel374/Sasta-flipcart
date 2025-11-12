import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import apiInstance from '../config/apiInstance';
export const usercontext = createContext(null);

const DataContext = (props) => {
  const [toggle, setToggle] = useState(true);
  const [token, setToken] = useState(false);
  const [role, setRole] = useState(null);
  const [contact, setContact] = useState('');
  const [user_id, setUser_id] = useState(null);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       let response = await apiInstance.get("/admin/get-users");
  //       const users = response?.data?.users || [];
        
  //       if (users.length === 0) {
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("role");
  //         setToken("");
  //         setRole("");
  //         window.dispatchEvent(new Event("storage"));
  //       }
  //     } catch (error) {
  //       console.log("Error in fetching users", error);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

  useEffect(()=>{
    const checkAuth=async()=>{
      try {
        console.log("Checking authentication status...");
        const response=await apiInstance.get("/auth/profile");

        if (response && response.data) {
          console.log("✓ Authentication verified - User role:", response.data.user.role);
          setToken(true);
          setRole(response.data.user.role);
          setUser_id(response.data.user._id);
        }
      } catch (error) {
        console.log("✗ Not authenticated or session expired");
        console.log("Error details:", error?.response?.status, error?.response?.data?.message);
        setToken(false);
        setRole(null);
        setUser_id(null);
      }
    }
    checkAuth();
  },[])




  // useEffect(() => {
  //   localStorage.setItem("token", token || "");
  //   localStorage.setItem("role", role || "");
  // }, [token, role]);
  return (
    <usercontext.Provider value={{ toggle, setToggle, token, setToken, role, setRole,user_id,setUser_id,contact, setContact }}>
      {props.children}
    </usercontext.Provider>
  )
}

export default DataContext
