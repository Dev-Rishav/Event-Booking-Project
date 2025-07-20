import { Outlet } from "react-router-dom";
import UserNavbar from "../User/UserNavbar";

const UserLayout = () => {
  return (
    <div className="min-h-screen">
      <UserNavbar />

      {/* Content below navbar */}
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
