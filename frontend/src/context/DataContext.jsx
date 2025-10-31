import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import apiInstance from '../apiInstance';
export const usercontext = createContext(null);

const DataContext = (props) => {
  const [toggle, setToggle] = useState(true);
  const [token, setToken] = useState(false);
  const [role, setRole] = useState(null);
  // const [users, setUsers] = useState([]);

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
        const response=await apiInstance.get("/auth/profile");
        console.log(response.data.user.role);
        setToken(true);
        setRole(response.data.user.role)
      } catch (error) {
        setToken(false);
        setRole(null)
      }
    }
    checkAuth();
  },[])




  // useEffect(() => {
  //   localStorage.setItem("token", token || "");
  //   localStorage.setItem("role", role || "");
  // }, [token, role]);
  return (
    <usercontext.Provider value={{ toggle, setToggle, token, setToken, role, setRole }}>
      {props.children}
    </usercontext.Provider>
  )
}

export default DataContext
