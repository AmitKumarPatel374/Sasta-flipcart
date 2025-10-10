import React from 'react'
import { useState } from 'react';
import { createContext } from 'react';
export const usercontext = createContext(null);

const DataContext = (props) => {
    const [toggle,setTogggle] = useState(true);
    // const [users,setUsers] = useState([]);
  return (
    <usercontext.Provider value={{toggle,setTogggle}}>
        {props.children}
    </usercontext.Provider>
  )
}

export default DataContext
