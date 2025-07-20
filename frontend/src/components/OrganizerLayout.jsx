import { Outlet } from "react-router-dom";
import OrganizerSidebar from "../Organizer/components/Sidebar";

const OrganizerLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar (Fixed) */}
      <OrganizerSidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <Outlet /> {/* This will dynamically load the clicked page */}
      </div>
    </div>
  );
};

export default OrganizerLayout;
