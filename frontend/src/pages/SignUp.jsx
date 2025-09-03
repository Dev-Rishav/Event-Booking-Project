import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaTicketAlt, FaPhone } from "react-icons/fa";
import { API_ENDPOINTS } from "../config/api.js";

const Signup = () => {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "user",
    phone: "",
    interests: [],
  });
  const [error, setError] = useState("");

  const interestCategories = [
    "Movie",
    "Sports",
    "Concert",
    "Stand Up",
    "Technical",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInterestChange = (interest) => {
    setFormData((prev) => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: prev.interests.filter((i) => i !== interest),
        };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_ENDPOINTS.AUTH.REGISTER, formData);
      navigation("/login");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to sign up");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] flex items-center justify-center relative font-sans text-gray-800 px-4">
      {/* Background elements */}
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#f9ab8f]/30 to-[#f40752]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse pointer-events-none" />

      <div className="max-w-md w-full z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6 mt-8">
          <div className="w-20 h-20 rounded-lg bg-gradient-to-r from-[#f40752] to-[#f9ab8f] flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform">
            <FaTicketAlt className="text-white text-3xl" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-center text-3xl font-bold">
          Start your journey on{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f40752] to-[#f9ab8f] font-bold">
            BOOKiT.com
          </span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#f40752] hover:text-[#f9ab8f] transition-colors"
          >
            Login
          </Link>
        </p>

        {/* Signup Form */}
        <div className="mt-8 mb-8 bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8">
          {error && (
            <div className="mb-4 bg-red-100/50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center gap-2 text-sm text-red-800">
                {error}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-sm focus:outline-none placeholder-gray-400"
                  placeholder="Your Full Name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-sm focus:outline-none placeholder-gray-400"
                  placeholder="you@bookit.com"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-500" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-sm focus:outline-none placeholder-gray-400"
                  placeholder="9876543210"
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
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-sm focus:outline-none placeholder-gray-400"
                  placeholder="Strong Password"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1 text-gray-700">
                Register as
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-sm focus:outline-none"
              >
                <option value="user">User</option>
                <option value="organizer">Event Organizer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Interests
              </label>
              <div className="grid grid-cols-2 gap-2">
                {interestCategories.map((interest) => (
                  <label key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="w-4 h-4 text-[#f40752] rounded focus:ring-[#f40752]"
                    />
                    <span className="ml-2 text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formData.interests.length === 0}
              className={`w-full py-3 px-4 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-[#f40752] to-[#f9ab8f] hover:from-[#f9ab8f] hover:to-[#f40752] transition-all duration-300 hover:shadow-xl ${
                formData.interests.length === 0 ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;