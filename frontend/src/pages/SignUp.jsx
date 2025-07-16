import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "user", 
    phone: "",
    interests: []
  });
  
  const [error, setError] = useState("");
  
  
  const interestCategories = [
    "Music",
    "Sports",
    "Theater",
    "Stand Up",
    "Technology"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return {
          ...prev,
          interests: prev.interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interest]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8001/user/register", formData);
      navigation('/login');
    } catch (error) {
      setError(error.response?.data?.error || "Failed to sign up");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        {error && (
          <div className="p-2 text-sm text-center text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="3"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Role Field - Changed to select dropdown */}
          <div>
            <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700">
              Register as
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">User</option>
              <option value="organizer">Event Organizer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {/* Interests Section */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Interests (Select at least one)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {interestCategories.map((interest) => (
                <div key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`interest-${interest}`}
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`interest-${interest}`} className="ml-2 text-sm text-gray-700">
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={formData.interests.length === 0}
            className={`w-full px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              formData.interests.length === 0 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Sign Up
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;