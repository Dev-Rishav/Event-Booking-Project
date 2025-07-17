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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import UserNotifications from "../../User/UserNotifications";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const { hasNewNotification, clearNotificationBadge } = useUser();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
      <div className="backdrop-blur-md bg-white/30 dark:bg-[#1B1C1E]/90 border-b border-white/10 dark:border-white/10 text-gray-800 dark:text-white fixed top-0 left-0 w-full h-16 z-50 flex justify-between items-center px-6 shadow-md">
        <div className="flex items-center gap-4">
          <FaBars
            className="text-2xl cursor-pointer md:hidden"
            onClick={toggleSidebar}
          />
          <h1 className="text-xl font-bold flex items-center">
            <div className="h-9 w-9 bg-gradient-to-r from-[#034078] to-[#1282a2] rounded-full flex items-center justify-center mr-2 shadow-sm">
              <FaFilm className="text-white text-lg" />
            </div>
            BOOKiT
            <span className="text-[#1282a2] dark:text-[#1282a2]">.com</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 relative">
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
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
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

      {/* Sidebar */}
      <motion.div
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-md bg-white/30 dark:bg-[#1B1C1E]/90 text-gray-800 dark:text-white fixed top-16 left-0 h-screen overflow-hidden shadow-lg flex flex-col"
      >
        <div className="flex justify-between items-center p-4">
          {isSidebarOpen && <h2 className="text-lg font-semibold">Dashboard</h2>}
          <FaBars
            className="text-2xl cursor-pointer hover:text-red-500 transition hidden md:block"
            onClick={toggleSidebar}
          />
        </div>

        <ul className="flex flex-col gap-2 p-2">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-red-700 shadow-md"
                    : "hover:bg-gray-800 dark:hover:bg-gray-700"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </ul>
      </motion.div>
    </>
  );
};

export default Sidebar;
