import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBars } from "react-icons/fa";

function HeaderUser() {
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState("");

  const handleNavigation = () => {
    navigate("/Login");
  };

  const toggleDropdown = (name) => {
    setDropdown(dropdown === name ? "" : name);
  };

  return (
    <header className="bg-gray-900 shadow-md sticky top-0 z-50 px-6 py-3 ">
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <NavLink to="/" className="text-2xl font-bold text-gray-200">
            book<span className="text-red-600 font-bold">my</span>show
          </NavLink>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-grow items-center mx-4 relative ">
          <FaSearch className="absolute left-3 text-gray-200" />
          <input
            type="text"
            placeholder="Search for Movies, Events, Plays, Sports and Activities"
            className="w-full border rounded-full py-2 pl-10 pr-4 text-gray-200 focus:outline-none"
          />
        </div>

        {/* Location & Login Button */}
        <div className="flex items-center space-x-4">
          {/* City Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("city")}
              className="text-gray-200 font-medium"
            >
              Bhopal ▼
            </button>
            {dropdown === "city" && (
              <div className="absolute bg-white shadow-md mt-2 py-2 w-32 rounded-md">
                <button className="block px-4 py-2 hover:bg-gray-100">Mumbai</button>
                <button className="block px-4 py-2 hover:bg-gray-100">Delhi</button>
                <button className="block px-4 py-2 hover:bg-gray-100">Bangalore</button>
              </div>
            )}
          </div>

          {/* Sign-in Button */}
          <button
            className="bg-red-500 text-white px-5 py-1 rounded-md font-medium hover:bg-red-600 transition-all duration-300"
            onClick={handleNavigation}
          >
            Sign in
          </button>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <FaBars className="text-xl text-gray-200" />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderUser;
