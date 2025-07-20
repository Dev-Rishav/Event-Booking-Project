import { useState } from "react";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import {
  FaReceipt,
  FaHome,
  FaMoneyBill,
  FaFilm,
  FaClipboardList,
  FaUser,
  FaBars,
  FaCrown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    window.location.href = "/";
  };

  const menuItems = [
    { name: "Home", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Revenue", path: "/admin/revenue", icon: <FaMoneyBill /> },
    { name: "Subscriptions", path: "/admin/subscription", icon: <FaCrown /> },
    { name: "Users", path: "/admin/users", icon: <FaFilm /> },
    { name: "Organizers", path: "/admin/organizers", icon: <FaClipboardList /> },
    { name: "Profile", path: "/admin/profile", icon: <FaUser /> },
  ];

  return (
    <>
      {/* Navbar */}
      <div className="backdrop-blur-md bg-white/80 border-b border-white/30 text-gray-800 fixed top-0 left-0 w-full h-16 flex justify-between items-center px-6 shadow-md z-50">
        <div className="flex items-center gap-4">
          <FaBars
            className="text-2xl cursor-pointer md:hidden text-[#f40752]"
            onClick={toggleSidebar}
          />
          <h1 className="text-xl font-bold flex items-center">
            <div className="h-9 w-9 bg-gradient-to-r from-[#f40752] to-[#f9ab8f] rounded-lg flex items-center justify-center mr-2 shadow-sm transform rotate-12">
              <FaReceipt className="text-white text-lg" />
            </div>
            <span className="font-bold">BOOKiT</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f40752] to-[#f9ab8f] ml-1">.com</span>
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white hover:shadow-lg px-4 py-2 rounded-lg shadow transition transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <motion.div
        animate={{ 
          width: isOpen ? 260 : 80,
          x: window.innerWidth < 768 ? (isOpen ? 0 : -260) : 0
        }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-md bg-white/80 text-gray-800 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-hidden shadow-lg flex flex-col z-40 border-r border-white/30"
      >
        <div className="flex justify-between items-center p-4">
          {isOpen && <h2 className="text-lg font-semibold">Dashboard</h2>}
          <FaBars
            className="text-2xl cursor-pointer text-[#f40752] transition hidden md:block"
            onClick={toggleSidebar}
          />
        </div>

        <ul className="flex flex-col gap-2 p-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white shadow-md"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <AnimatePresence>
                {isOpen && (
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

      {/* Mobile Overlay */}
      {!isOpen && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default AdminSidebar;