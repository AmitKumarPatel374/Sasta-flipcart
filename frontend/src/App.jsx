import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import UserRoutes from "./routes/UserRoutes";

import LoginForm from "./pages/LoginForm";
import RegistrationForm from "./pages/RegistrationForm";
import NavbarFilter from "./components/NavbarFilter";
import HomeProductSquareCard from "./layouts/HomeProductSquareCard";

const App = () => {
  const [toggle, setToggle] = useState(true);
  const location = useLocation(); 

  return (
    <div>
      <Nav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default App;
