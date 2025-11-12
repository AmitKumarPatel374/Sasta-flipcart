// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-red-500">404 - Page Not Found</h1>
    </div>
  );
};

export default PageNotFound;
