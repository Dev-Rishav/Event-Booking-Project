import { Link, useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - Updated with ticket icon */}
          <Link
            to="/"
            className="flex items-center font-[Poppins] text-xl font-semibold text-gray-800 hover:text-gray-900 transition-colors"
          >
            <div className="h-9 w-9 bg-gradient-to-r from-[#f40752] to-[#f9ab8f] rounded-lg flex items-center justify-center mr-2 shadow-sm transform rotate-12">
              <FaTicketAlt className="text-white text-lg" />
            </div>
            <span className="font-bold">BOOKiT</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f40752] to-[#f9ab8f] ml-1">.com</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-xl transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white hover:shadow-lg rounded-xl shadow-sm transition transform hover:scale-105"
              >
                Register
              </Link>
            </>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-800 focus:outline-none"
              aria-label="Menu"
              onClick={() => {
                const menu = document.getElementById("mobile-menu");
                menu.classList.toggle("hidden");
              }}
            >
              <svg
                className="h-6 w-6 text-[#f40752]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden hidden px-4 pb-4 pt-2 space-y-2" id="mobile-menu">
        <>
          <Link
            to="/login"
            className="block px-4 py-2 text-gray-800 bg-white/70 rounded-lg hover:bg-white/90"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block px-4 py-2 text-white bg-gradient-to-r from-[#f40752] to-[#f9ab8f] rounded-lg hover:shadow-md"
          >
            Register
          </Link>
        </>
      </div>
    </nav>
  );
};

export default Navbar;