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
      <div className="backdrop-blur-md bg-white/80 dark:bg-[#1B1C1E]/90 text-gray-800 dark:text-white fixed top-0 left-0 w-full h-16 flex justify-between items-center px-6 shadow z-50">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 bg-gradient-to-r from-[#034078] to-[#1282a2] rounded-full flex items-center justify-center shadow-sm">
            <FaReceipt className="text-white text-lg" />
          </div>
          <h1 className="text-xl font-bold hidden sm:block">
            BOOKiT<span className="text-[#1282a2]">.com</span>
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium bg-white text-[#1282a2] hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl shadow-sm transition"
        >
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <motion.div
        animate={{ width: isOpen ? 260 : 80 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-md bg-white/80 dark:bg-[#1B1C1E]/90 text-gray-800 dark:text-white fixed top-16 left-0 h-screen overflow-hidden shadow-lg flex flex-col border-r border-gray-200 dark:border-white/10"
      >
        <div className="flex justify-between items-center p-4">
          {isOpen && <h1 className="text-lg font-bold">Dashboard</h1>}
          <FaBars
            className="text-2xl cursor-pointer hover:text-red-500 transition"
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
                    ? "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
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
    </>
  );
};

export default AdminSidebar;
