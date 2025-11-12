import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import UserRoutes from "./routes/UserRoutes";

// ✅ Import your Login and Register components
import LoginForm from "./pages/LoginForm";
import RegistrationForm from "./pages/RegistrationForm";

const App = () => {
  const [toggle, setToggle] = useState(true);
  const location = useLocation(); // required for AnimatePresence

  return (
    <div>
      <Nav />

      {/* ✅ AnimatePresence makes route transitions smooth */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* main user routes */}
          <Route path="/*" element={<UserRoutes />} />

          {/* login / register routes with animation */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default App;
