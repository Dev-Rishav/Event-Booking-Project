import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "./UserContext/UserContext";
import Cookies from "js-cookie";
import {
  FaHome,
  FaClipboardList,
  FaUser,
  FaBars,
  FaBell,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";

const UserNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const {
    hasNewNotification,
    clearNotificationBadge,
    user,
    notifications,
    removeNotification,
  } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("id");
    window.location.href = "/";
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: <FaHome className="mr-2" />,
    },
    {
      name: "Profile",
      path: "/user/profile",
      icon: <FaUser className="mr-2" />,
    },
    {
      name: "Bookings",
      path: "/user/bookings",
      icon: <FaClipboardList className="mr-2" />,
    },
  ];

  return (
    <>
      <nav className="bg-[#0f172a] text-white fixed top-0 left-0 w-full h-16 flex justify-between items-center px-6 shadow-lg z-50">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gradient bg-gradient-to-r from-blue-100 to-blue-400 bg-clip-text text-transparent">
            BOOKiT
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map(
            (item, index) =>
              item.name !== "Profile" && (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `transition-colors duration-200 flex items-center font-medium ${
                      isActive ? "text-blue-400" : "hover:text-blue-300"
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              )
          )}
        </div>

        <div className="flex items-center space-x-5">
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                clearNotificationBadge();
                setShowMenu(false);
                setShowDropdown(false);
              }}
              className="p-2 rounded-full hover:bg-[#1e293b] focus:outline-none relative"
            >
              <FaBell className="text-xl" />
              {hasNewNotification && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-[#1e293b] rounded-lg shadow-lg py-2 z-50">
                {notifications.length === 0 ? (
                  <div className="px-4 py-2 text-gray-300">
                    No notifications
                  </div>
                ) : (
                  notifications.map((note) => (
                    <div
                      key={note.id}
                      className="flex justify-between items-start px-4 py-2 border-b border-gray-600"
                    >
                      <div>
                        <div className="font-semibold">{note.title}</div>
                        <div className="text-sm text-gray-300">
                          {note.message}
                        </div>
                      </div>
                      <button
                        onClick={() => removeNotification(note.id)}
                        className="text-red-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => {
                setShowMenu(!showMenu);
                setShowNotifications(false);
                setShowDropdown(false);
              }}
              className="p-2 rounded-full hover:bg-[#1e293b] focus:outline-none"
            >
              <FaBars className="text-xl" />
            </button>
          </div>

          <div className="hidden md:block relative">
            <button
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-[#1e293b] focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-400 flex items-center justify-center">
                <span className="text-sm font-medium text-black">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <FaChevronDown
                className={`text-xs transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                  {user?.email || "User"}
                </div>
                <NavLink
                  to="/user/profile"
                  className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#334155]"
                  onClick={() => setShowDropdown(false)}
                >
                  <FaUser className="mr-2" />
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#334155] w-full text-left"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {showMenu && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#1e293b] shadow-lg z-40">
            <div className="px-2 pt-2 pb-4 space-y-2">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-base font-medium flex items-center ${
                      isActive
                        ? "bg-green-500 text-black"
                        : "text-white hover:bg-[#334155]"
                    }`
                  }
                  onClick={() => setShowMenu(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              ))}
              <div className="border-t border-gray-700 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="block w-full px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-[#334155] text-left flex items-center"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="pt-16"></div>
    </>
  );
};

export default UserNavbar;
