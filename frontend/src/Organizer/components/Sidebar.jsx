import { useState } from "react";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "../../User/UserContext/UserContext";
import {
  FaMoneyBill,
  FaFilm,
  FaClipboardList,
  FaUser,
  FaBell,
  FaBars,
  FaCrown,
  FaTimes,
} from "react-icons/fa";
import UserNotifications from "../../User/UserNotifications";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // For mobile sidebar
  const [showDropdown, setShowDropdown] = useState(false);
  const { hasNewNotification, clearNotificationBadge } = useUser();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Revenue", path: "/organizer/revenue", icon: <FaMoneyBill /> },
    { name: "Events", path: "/organizer/events", icon: <FaFilm /> },
    { name: "Subscription", path: "/organizer/subscription", icon: <FaCrown /> },
    { name: "Bookings", path: "/organizer/bookings", icon: <FaClipboardList /> },
    { name: "Profile", path: "/organizer/profile", icon: <FaUser /> },
  ];

  return (
    <>
      {/* Top Navbar */}
      <div className="bg-gray-900 text-white fixed top-0 left-0 w-full h-16 z-50 flex justify-between items-center px-4 md:px-6 shadow-md">
        {/* Left */}
        <div className="flex items-center">
          <button className="md:hidden mr-4" onClick={toggleSidebar}>
            <FaBars className="text-2xl" />
          </button>
          <h1 className="text-lg md:text-xl font-bold">Atul The Great</h1>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4 relative">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              clearNotificationBadge();
            }}
            className="relative"
          >
            <FaBell className="text-xl" />
            {hasNewNotification && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Logout
          </button>
        </div>

        {showDropdown && (
          <div className="absolute right-4 top-16 z-50">
            <UserNotifications />
          </div>
        )}
      </div>

      {/* Sidebar (Desktop) */}
      <div className="hidden md:block fixed top-16 left-0 h-full w-64 bg-gray-900 text-white p-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Drawer (Mobile) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden" onClick={toggleSidebar}>
          <div
            className="w-64 h-full bg-gray-900 text-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <FaTimes className="text-2xl cursor-pointer" onClick={toggleSidebar} />
            </div>
            <ul className="space-y-4">
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <NavLink
                    to={item.path}
                    onClick={toggleSidebar}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-red-600 text-white"
                          : "hover:bg-gray-800 text-gray-300"
                      }`
                    }
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
