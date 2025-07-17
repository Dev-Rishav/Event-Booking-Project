import { Outlet } from "react-router-dom";
import UserNavbar from "../User/UserNavbar";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#0a1128] dark:to-[#001f54]">
      <UserNavbar />

      {/* Content below navbar */}
      <div className="pt-16 px-6">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
