import { useState } from "react";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { FaHome, FaMoneyBill, FaFilm, FaClipboardList, FaStar, FaBell, FaUser, FaBars , FaSearch } from "react-icons/fa";

const UserSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    window.location.href = "/"; // Redirect to login after logout
  };

  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: <FaHome /> },
    { name: "Profile", path: "/user/profile", icon:  <FaUser /> },
    { name: "Bookings", path: "/user/bookings", icon: <FaClipboardList /> },
    { name: "Notifications", path: "/user/notifications", icon: <FaBell /> },
    { name: "Liked Events", path: "/user/likedevents", icon: <FaHome /> },
  ];

  return (
    <>
      {/* Navbar - Fixed at the top */}
      <div className="bg-gray-900 text-white fixed top-0 left-0 w-full h-16 flex justify-between items-center px-6 shadow-md z-50">
        <h1 className="text-xl font-bold ml-4">User Dashboard</h1>
        {/* Search Bar */}
        <div className="hidden md:flex flex-grow items-center mx-18 relative ">
          <FaSearch className="absolute left-3 text-gray-200" />
          <input
            type="text"
            placeholder="Search for Movies, Events, Plays, Sports and Activities"
            className="w-full border rounded-full py-2 pl-10 pr-4 text-gray-200 focus:outline-none"
          />
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Sidebar - Fixed to the left */}
      <div className={`bg-gray-900 text-white h-screen fixed top-16 left-0 ${isOpen ? "w-64" : "w-20"} transition-all duration-300 p-4`}>
        {/* Toggle Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-lg font-bold transition-all duration-300 ${isOpen ? "block" : "hidden"}`}>
            Dashboard
          </h1>
          <FaBars className="text-2xl cursor-pointer" onClick={toggleSidebar} />
        </div>

        {/* Menu Items */}
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-500 transition-all duration-300"
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`${isOpen ? "block" : "hidden"}`}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UserSidebar;
