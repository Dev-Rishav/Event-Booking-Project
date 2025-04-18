import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../User/UserContext/UserContext";
import { XCircle, CheckCircle, Info } from "lucide-react";

const UserNotifications = () => {
    const { notifications, removeNotification } = useUser();

    const getIcon = (type) => {
        if (type === "success") return <CheckCircle className="text-green-600" />;
        if (type === "info") return <Info className="text-blue-600" />;
        return <Info className="text-gray-600" />;
    };

    const getBorder = (type) => {
        if (type === "success") return "border-green-500";
        if (type === "info") return "border-blue-500";
        return "border-gray-400";
    };

    const getBg = (type) => {
        if (type === "success") return "bg-green-100";
        if (type === "info") return "bg-blue-100";
        return "bg-gray-100";
    };
    

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
            <AnimatePresence>
                {notifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start p-4 rounded-xl shadow-lg border-l-4 ${getBorder(notif.type)} ${getBg(notif.type)}`}
                    >
                        <div className="pr-3 pt-1">
                            {getIcon(notif.type)}
                        </div>
                        <div className="flex-grow">
                            <h4 className="text-base font-semibold text-gray-800">{notif.title}</h4>
                            <p className="text-sm text-gray-700 mt-1">{notif.message}</p>
                        </div>
                        <button
                            onClick={() => removeNotification(notif.id)}
                            className="ml-4 mt-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <XCircle size={20} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default UserNotifications;
