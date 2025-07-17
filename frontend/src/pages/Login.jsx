import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FaReceipt, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8001/user/login", formData);
      const { token, role, userId } = response.data;

      Cookies.set("token", token, { expires: 1 });
      Cookies.set("role", role, { expires: 1 });
      Cookies.set("id", userId, { expires: 1 });

      if (rememberMe) {
        localStorage.setItem("userEmail", formData.email);
      } else {
        localStorage.removeItem("userEmail");
      }

      if (role === "user") {
        navigation("/user/dashboard");
      } else if (role === "organizer") {
        navigation("/organizer/revenue");
      } else if (role === "admin") {
        navigation("/admin/dashboard");
      }
    } catch (error) {
      setError("Galat email ya password. Dobara try karo!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#121212] dark:to-[#1B1C1E] font-[DM Sans] text-[#1B1C1E] dark:text-white px-4 relative overflow-hidden">
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#034078]/30 to-[#1282a2]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#034078] to-[#1282a2] flex items-center justify-center shadow-lg hover:rotate-12 transition-transform">
            <FaReceipt className="text-white text-3xl" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold font-[Poppins]">
          Welcome back to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#034078] to-[#1282a2]">
            BOOKiT.com
          </span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#034078] hover:text-[#1282a2] transition"
          >
            Sign up
          </Link>
        </p>

        <div className="mt-8 bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl p-8">
          {error && (
            <div className="mb-4 bg-red-100/50 dark:bg-red-500/10 border-l-4 border-[#F97316] p-4 rounded">
              <div className="flex items-center gap-2 text-sm text-[#111827] dark:text-white">
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#034078] bg-white/70 dark:bg-[#2A2A2E] text-sm focus:outline-none"
                  placeholder="example@bookit.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#034078] bg-white/70 dark:bg-[#2A2A2E] text-sm focus:outline-none"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-white text-sm font-semibold bg-gradient-to-r from-[#034078] to-[#1282a2] hover:from-[#1282a2] hover:to-[#034078] transition duration-300"
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
