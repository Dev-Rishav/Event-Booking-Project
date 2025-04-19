import { Outlet } from "react-router-dom";
import UserNavbar from "../User/UserNavbar";
// import OrganizerSidebar from "../Organizer/components/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex h-screen">
      <UserNavbar />
      <div className="flex-1 p-6">
        <Outlet /> 
      </div>
    </div>
  );
};

export default UserLayout;