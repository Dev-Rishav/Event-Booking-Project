import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../redux/slices/adminslice/adminActions';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleViewDetails = (email) => {
    navigate(`/admin/users/${email}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-md"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100"
      >
        All Registered Users
      </motion.h2>

      {loading && (
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">
          Loading users...
        </p>
      )}

      {error && (
        <p className="text-center text-red-500 font-medium">Error: {error}</p>
      )}

      {!loading && !error && users.length > 0 ? (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Role
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {users.map((user) => (
                  <motion.tr
                    key={user.email}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{user.email}</td>
                    <td className="px-6 py-4 text-sm capitalize text-gray-800 dark:text-gray-200">{user.role}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDetails(user.email)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm shadow-md transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-600 dark:text-gray-400">No users found.</p>
        )
      )}
    </motion.div>
  );
};

export default AdminUsers;
