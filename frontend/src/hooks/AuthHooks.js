import { useMutation } from "@tanstack/react-query"
import { loginUserApi, RegisterUserApi } from "../api/AuthApis"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const RegisterUserHook = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: RegisterUserApi,
    onSuccess: (data) => {
      console.log("✅ Mutation success:", data);
      toast.success("Registration successful!");

      // optional delay to let toast appear
      setTimeout(() => navigate("/login"), 1500);
    },
    onError:(error)=>{
      toast.error("Registration failed.");
    }
  })
}
export const loginUserHook = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: loginUserApi,
    onSuccess: (data) => {
      console.log("✅ Mutation success:", data);
      toast.success("login successful!");

      // optional delay to let toast appear
      setTimeout(() => navigate("/"), 1500);
    },
    onError:(error)=>{
      toast.error("login failed.");
    }
  })
}
