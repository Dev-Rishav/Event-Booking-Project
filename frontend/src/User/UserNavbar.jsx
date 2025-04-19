import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "./UserContext/UserContext";
import Cookies from "js-cookie";
import {
  FaHome, FaClipboardList, FaStar,
  FaUser, FaBars, FaBell, FaChevronDown, FaSignOutAlt, FaCog
} from "react-icons/fa";
import UserNotifications from "./UserNotifications";

const UserNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { hasNewNotification, clearNotificationBadge, user } = useUser();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    window.location.href = "/";
  };

  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: <FaHome className="mr-2" /> },
    { name: "Profile", path: "/user/profile", icon: <FaUser className="mr-2" /> },
    { name: "Bookings", path: "/user/bookings", icon: <FaClipboardList className="mr-2" /> },
    { name: "Liked Events", path: "/user/likedevents", icon: <FaStar className="mr-2" /> },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-800 text-white fixed top-0 left-0 w-full h-16 flex justify-between items-center px-4 shadow-md z-50">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold">EventHub</h1>
        </div>

        {/* Desktop Menu Items */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item, index) => (
            // Skip rendering if the item is "Profile"
            item.name !== "Profile" && (
              <NavLink
                key={index}
                to={item.path}
                className="hover:text-red-400 transition-colors duration-200 flex items-center"
                activeClassName="text-red-500"
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            )
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                clearNotificationBadge();
                setShowMenu(false);
                setShowDropdown(false);
              }}
              className="relative p-2 rounded-full hover:bg-gray-700 focus:outline-none"
            >
              <FaBell className="text-xl" />
              {hasNewNotification && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <UserNotifications />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                setShowMenu(!showMenu);
                setShowNotifications(false);
                setShowDropdown(false);
              }}
              className="p-2 rounded-full hover:bg-gray-700 focus:outline-none"
            >
              <FaBars className="text-xl" />
            </button>
          </div>

          {/* Desktop User Dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-700 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <FaChevronDown className={`text-xs transition-transform duration-200 ${showDropdown ? 'transform rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                  {user?.email || 'User'}
                </div>
                <NavLink
                  to="/user/profile"
                  className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                  onClick={() => setShowDropdown(false)}
                >
                  <FaUser className="mr-2" />
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMenu && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-800 shadow-lg z-40">
            <div className="px-2 pt-2 pb-4 space-y-1">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 flex items-center"
                  activeClassName="bg-gray-900"
                  onClick={() => setShowMenu(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              ))}
              <div className="border-t border-gray-700 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700 text-left flex items-center"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Add padding to content to account for fixed navbar */}
      <div className="pt-16"></div>
    </>
  );
};

export default UserNavbar;