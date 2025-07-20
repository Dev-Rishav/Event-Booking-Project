import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrganizers } from '../redux/slices/adminslice/adminActions';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminOrganizers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { organizers, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllOrganizers());
  }, [dispatch]);

  const handleViewDetails = (email) => {
    navigate(`/admin/organizers/${email}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-16 mt-12 px-4 sm:px-6 lg:ml-60 lg:px-8 backdrop-blur-sm"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl font-bold mb-8 text-center lg:text-left text-transparent bg-clip-text bg-gradient-to-r from-[#f40752] to-[#f9ab8f]"
      >
        All Registered Organizers
      </motion.h2>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f40752]"></div>
        </div>
      )}

      {error && (
        <p className="text-center lg:text-left text-red-500 font-medium">Error: {error}</p>
      )}

      {!loading && !error && organizers.length > 0 ? (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-white/30 bg-white/80 backdrop-blur-sm">
          {/* Mobile Cards View */}
          <div className="lg:hidden space-y-4 p-4">
            {organizers.map((organizer) => (
              <motion.div
                key={organizer.email}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="p-4 rounded-lg bg-white/90 border border-white/30 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{organizer.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white">
                    {organizer.role}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{organizer.email}</p>
                <button
                  onClick={() => handleViewDetails(organizer.email)}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-[#f40752] to-[#f9ab8f] hover:shadow-lg text-white text-sm shadow-md transition-all"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table View */}
          <table className="hidden lg:table min-w-full divide-y divide-white/30">
            <thead className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Role
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/30">
              <AnimatePresence>
                {organizers.map((organizer) => (
                  <motion.tr
                    key={organizer.email}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="hover:bg-white/50 transition-all"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">{organizer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{organizer.email}</td>
                    <td className="px-6 py-4 text-sm capitalize text-gray-800">{organizer.role}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDetails(organizer.email)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#f40752] to-[#f9ab8f] hover:shadow-lg text-white text-sm shadow-md transition-all transform hover:scale-105"
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
          <p className="text-center lg:text-left text-gray-600">No organizers found.</p>
        )
      )}
    </motion.div>
  );
};

export default AdminOrganizers;