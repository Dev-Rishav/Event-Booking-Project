import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "./UserContext/UserContext";
import Cookies from "js-cookie";
import { FaHome, FaClipboardList, FaUser, FaBars, FaBell, FaChevronDown, FaSignOutAlt, FaTicketAlt } from "react-icons/fa";

const UserNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { hasNewNotification, clearNotificationBadge, user, notifications, removeNotification } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("id");
    window.location.href = "/";
  };

  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: <FaHome className="mr-2" /> },
    { name: "Profile", path: "/user/profile", icon: <FaUser className="mr-2" /> },
    { name: "Bookings", path: "/user/bookings", icon: <FaClipboardList className="mr-2" /> },
  ];

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md border-b border-white/30 text-gray-800 fixed top-0 left-0 w-full h-16 flex justify-between items-center px-4 sm:px-6 shadow-md z-50">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="h-9 w-9 bg-gradient-to-r from-[#f40752] to-[#f9ab8f] rounded-lg flex items-center justify-center mr-2 shadow-sm transform rotate-12">
              <FaTicketAlt className="text-white text-lg" />
            </div>
            <span className="font-bold text-xl">BOOKiT</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f40752] to-[#f9ab8f] ml-1">.com</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `transition-colors duration-200 flex items-center font-medium ${
                  isActive ? "text-[#f40752]" : "hover:text-[#f9ab8f]"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Right Side Icons */}
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
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none relative"
            >
              <FaBell className="text-xl text-[#f40752]" />
              {hasNewNotification && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white rounded-lg shadow-xl border border-white/30 py-2 z-50">
                {notifications.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">No notifications</div>
                ) : (
                  notifications.map((note) => (
                    <div
                      key={note.id}
                      className="flex justify-between items-start px-4 py-2 border-b border-gray-200 hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-semibold">{note.title}</div>
                        <div className="text-sm text-gray-600">
                          {note.message}
                        </div>
                      </div>
                      <button
                        onClick={() => removeNotification(note.id)}
                        className="text-[#f40752] text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
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
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <FaBars className="text-xl text-[#f40752]" />
            </button>
          </div>

          {/* Desktop Profile Dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f40752] to-[#f9ab8f] flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <FaChevronDown
                className={`text-xs text-[#f40752] transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-white/30 py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                  {user?.email || "User"}
                </div>
                <NavLink
                  to="/user/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <FaUser className="mr-2" />
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-40 mt-16" onClick={() => setShowMenu(false)}>
            <div className="bg-white shadow-lg animate-slide-in">
              <div className="px-4 pt-4 pb-6 space-y-3">
                {menuItems.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg text-base font-medium flex items-center ${
                        isActive
                          ? "bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white"
                          : "text-gray-800 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setShowMenu(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </NavLink>
                ))}
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-100 text-left flex items-center"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                </div>
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