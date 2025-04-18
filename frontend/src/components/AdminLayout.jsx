import { Outlet } from "react-router-dom";
import AdminSidebar from "../Admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
     <div className="flex-1 p-6 ml-64">
      <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
