import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../api/api"; // axios instance
import { useAuth } from "../auth/AuthProvider";
import { LoginForm } from "../components/ui/login-form";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/admin";

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Login submit called with email:", email);
    try {
      setLoading(true);
      console.log("Making API call to /auth/login");
      const res = await API.post("/auth/login", { email, password });
      console.log("Login API response:", res.data);
      const { token } = res.data;
      console.log("Calling login with token:", token);
      login(token);
      nav(from);
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ general: err?.response?.data?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {errors.general && (
        <p className="text-red-500 text-sm mb-4">{errors.general}</p>
      )}
      <LoginForm
        email={email}
        password={password}
        onEmailChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors({ ...errors, email: "" });
        }}
        onPasswordChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors({ ...errors, password: "" });
        }}
        onSubmit={submit}
        errors={errors}
        loading={loading}
      />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
