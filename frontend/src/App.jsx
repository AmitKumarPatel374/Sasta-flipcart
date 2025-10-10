import React from 'react'
import LoginForm from './pages/LoginForm'
import RegistrationForm from './pages/RegistrationForm'
import { useState } from 'react';

const App = () => {
  const [toggle, setTogggle] = useState(true);
  return (
    <div>
      {!toggle ? (
        <RegistrationForm setTogggle={setTogggle}/>
      ) :
        (
          <LoginForm setTogggle={setTogggle}/>
        )}
    </div>
  )
}

export default App
