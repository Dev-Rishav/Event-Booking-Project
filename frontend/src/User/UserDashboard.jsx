import React from "react";
import UserEvents from "./UserEvents";

const UserDashboard = () => {
  return (
    <div className="min-h-screen w-full pt-16 relative">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#3EB489]/30 to-[#A5F3A1]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse" />
      </div>

      {/* Main Content */}
      <UserEvents />
    </div>
  );
};

export default UserDashboard;

