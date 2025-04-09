import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/");
  };

  return (
    <div className="bg-gray-900 text-white h-16 fixed top-0 left-0 w-full flex items-center justify-end px-6 shadow-md">
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-2 text-white hover:text-red-500 transition-all duration-300"
      >
        <FaSignOutAlt size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Navbar;
