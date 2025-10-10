import React from 'react'
import { useState } from 'react';
import { createContext } from 'react';
export const usercontext = createContext(null);

const DataContext = (props) => {
    const [toggle,setToggle] = useState(true);
  return (
    <usercontext.Provider value={{toggle,setToggle}}>
        {props.children}
    </usercontext.Provider>
  )
}

export default DataContext
