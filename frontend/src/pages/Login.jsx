import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FaTicketAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { API_ENDPOINTS } from "../config/api.js";

const Login = () => {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, formData);
      const { token, role, userId } = response.data;

      Cookies.set("token", token, { expires: 1 });
      Cookies.set("role", role, { expires: 1 });
      Cookies.set("id", userId, { expires: 1 });


      if (role === "user") {
        navigation("/user/dashboard");
      } else if (role === "organizer") {
        navigation("/organizer/revenue");
      } else if (role === "admin") {
        navigation("/admin/dashboard");
      }
    } catch (error) {
      setError("Invalid email or password. Please try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] font-sans text-gray-800 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#f9ab8f]/30 to-[#f40752]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-lg bg-gradient-to-r from-[#f40752] to-[#f9ab8f] flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform">
            <FaTicketAlt className="text-white text-3xl" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-center text-3xl font-bold font-sans">
          Welcome back to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f40752] to-[#f9ab8f] font-bold">
            BOOKiT.com
          </span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#f40752] hover:text-[#f9ab8f] transition-colors"
          >
            Sign up
          </Link>
        </p>

        {/* Login Form */}
        <div className="mt-8 bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8">
          {error && (
            <div className="mb-4 bg-red-100/50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center gap-2 text-sm text-red-800">
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-sm focus:outline-none placeholder-gray-400"
                  placeholder="example@bookit.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-sm focus:outline-none placeholder-gray-400"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-white text-sm font-semibold bg-gradient-to-r from-[#f40752] to-[#f9ab8f] hover:from-[#f9ab8f] hover:to-[#f40752] transition-all duration-300 hover:shadow-xl"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;