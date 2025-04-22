import { useState } from "react";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "../../User/UserContext/UserContext";
import { FaHome, FaMoneyBill, FaFilm, FaClipboardList, FaStar, FaBell, FaUser, FaBars ,FaCrown} from "react-icons/fa";
import UserNotifications from "../../User/UserNotifications";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const { hasNewNotification, clearNotificationBadge } = useUser();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    window.location.href = "/"; // Redirect to login after logout
  };

  const menuItems = [
    { name: "Home", path: "/organizer/home", icon: <FaHome /> },
    { name: "Revenue", path: "/organizer/revenue", icon: <FaMoneyBill /> },
    { name: "Events", path: "/organizer/events", icon: <FaFilm /> },
    { name: "Subscription", path: "/organizer/subscription", icon: <FaCrown /> },
    { name: "Bookings", path: "/organizer/bookings", icon: <FaClipboardList /> },
    { name: "Profile", path: "/organizer/profile", icon: <FaUser /> },
    
  ];

  return (
    <>
      {/* Navbar - Fixed at the top */}
      <div className="bg-gray-900 text-white fixed top-0 left-0 w-full h-16 flex justify-between items-center px-6 shadow-md z-50">
        <h1 className="text-xl font-bold ml-16">Atul The Great</h1>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => {
                setShowDropdown(!showDropdown);
                clearNotificationBadge();
              }}
              className="relative focus:outline-none"
            >
              <FaBell className="text-xl mr-8 mt-2" />
              {hasNewNotification && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
          </div> 


        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      {showDropdown && <UserNotifications />}
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

export default Sidebar;
