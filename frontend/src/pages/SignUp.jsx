import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaReceipt, FaPhone } from "react-icons/fa";

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
    "Music",
    "Sports",
    "Theater",
    "Stand Up",
    "Technology",
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
      await axios.post("http://localhost:8001/user/register", formData);
      navigation("/login");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to sign up");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#121212] dark:to-[#1B1C1E] flex items-center justify-center relative font-[DM Sans] text-[#1B1C1E] dark:text-white px-4">
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#034078]/30 to-[#1282a2]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse pointer-events-none" />

      <div className="max-w-md w-full z-10">
        <div className="flex justify-center mb-6 mt-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#034078] to-[#1282a2] flex items-center justify-center shadow-lg hover:rotate-12 transition-transform">
            <FaReceipt className="text-white text-3xl" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold font-[Poppins]">
          Start your journey on{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#034078] to-[#1282a2]">
            BOOKiT.com
          </span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#034078] hover:text-[#1282a2] transition"
          >
            Login
          </Link>
        </p>

        <div className="mt-8 mb-8 bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl p-8">
          {error && (
            <div className="mb-4 bg-red-100/50 dark:bg-red-500/10 border-l-4 border-[#F97316] p-4 rounded text-sm flex items-center gap-2">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#034078] bg-white/10 text-sm focus:outline-none"
                  placeholder="Your Full Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#034078] bg-white/10 text-sm focus:outline-none"
                  placeholder="you@bookit.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#034078] bg-white/10 text-sm focus:outline-none"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#034078] bg-white/10 text-sm focus:outline-none"
                  placeholder="Strong Password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                Register as
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-xl border  focus:ring-2 focus:ring-[#034078] bg-white/10 text-sm focus:outline-none"
              >
                <option value="user">User</option>
                <option value="organizer">Event Organizer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Interests
              </label>
              <div className="grid grid-cols-2 gap-2">
                {interestCategories.map((interest) => (
                  <label key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="w-4 h-4 text-[#034078] rounded focus:ring-[#034078]"
                    />
                    <span className="ml-2 text-sm">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={formData.interests.length === 0}
              className={`w-full py-3 px-4 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-[#034078] to-[#1282a2] hover:from-[#1282a2] hover:to-[#034078] transition duration-300 ${
                formData.interests.length === 0
                  ? "opacity-70 cursor-not-allowed"
                  : ""
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
