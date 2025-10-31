// src/pages/LoginSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const name = searchParams.get("name");
    if (name) {
      localStorage.setItem("userName", name);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    }
  }, [navigate, searchParams]);

  return <div>Logging you in via Google...</div>;
};

export default LoginSuccess;
