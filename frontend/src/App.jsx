import React from 'react'
import LoginForm from './pages/LoginForm'
import RegistrationForm from './pages/RegistrationForm'
import { useState } from 'react';
import CreateProduct from './pages/CreateProduct';

const App = () => {
  const [toggle, setTogggle] = useState(true);
  return (
    <div>
      {/* {!toggle ? (
        <RegistrationForm setTogggle={setTogggle}/>
      ) :
        (
          <LoginForm setTogggle={setTogggle}/>
        )} */}
        <CreateProduct />
    </div>
  )
}

export default App
