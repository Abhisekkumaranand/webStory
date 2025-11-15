// src/auth/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../auth/AuthProvider";
import { SignupForm } from "../components/ui/signup-form";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const nav = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      const { token, user } = res.data;
      login(token);
      nav(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      console.error(err);
      setErrors({ general: err?.response?.data?.message || "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {errors.general && (
        <p className="text-red-500 text-sm mb-4">{errors.general}</p>
      )}
      <SignupForm
        name={name}
        email={email}
        password={password}
        role={role}
        onNameChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors({ ...errors, name: "" });
        }}
        onEmailChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors({ ...errors, email: "" });
        }}
        onPasswordChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors({ ...errors, password: "" });
        }}
        onRoleChange={(e) => setRole(e.target.value)}
        onSubmit={handleSignup}
        errors={errors}
        loading={loading}
      />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Sign in here
          </Link>
        </p>
        <p className="text-sm text-gray-600">
          By signing up, you agree to our{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-800">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
}
