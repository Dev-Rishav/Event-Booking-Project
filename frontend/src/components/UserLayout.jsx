import { Outlet } from "react-router-dom";
import UserSidebar from "../User/UserSidebar";
// import OrganizerSidebar from "../Organizer/components/Sidebar";

const UserLayout = () => {
  return (
    <div className="flex h-screen">
    //   {/* Sidebar (Fixed) */}
    //  <UserSidebar />

    //   {/* Main Content Area */}
      <div className="flex-1 p-6 ml-64">
        <Outlet /> {/* This will dynamically load the clicked page */}
      </div>
    </div>
  );
};

export default UserLayout;