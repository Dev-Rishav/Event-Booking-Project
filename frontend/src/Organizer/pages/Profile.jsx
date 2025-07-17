import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaUserTag,
  FaEdit,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get('http://localhost:8001/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userData = response.data.result;
        setUser(userData);
        setNewPhone(userData.phone);
      } catch {
        setError('Failed to fetch profile data');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = Cookies.get('token');
      await axios.put(
        'http://localhost:8001/user/profile',
        { phone: newPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(prev => ({ ...prev, phone: newPhone }));
      setEditing(false);
      alert("📞 Phone updated successfully!");
    } catch {
      setError('Failed to update phone');
    }
  };

  if (error)
    return (
      <div className="text-red-500 text-center mt-6">{error}</div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen mt-10 bg-[#F1EFEC] dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-[#D4C9BE] dark:border-gray-700">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#123458] to-[#030303] p-8 text-center">
            <div className="flex justify-center">
              <FaUserCircle className="text-[90px] text-white bg-gray-300 dark:bg-gray-700 rounded-full p-2 border-4 border-white shadow-lg" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">
              User Profile
            </h2>
            <p className="mt-2 text-gray-200">
              Manage your account information
            </p>
          </div>

          {/* Profile Content */}
          <div className="px-8 py-10 sm:p-12 space-y-8">
            {[
              {
                icon: <FaUserTag className="text-[#123458] dark:text-blue-300 text-xl" />,
                label: "Name",
                value: user.name
              },
              {
                icon: <FaEnvelope className="text-[#123458] dark:text-blue-300 text-xl" />,
                label: "Email",
                value: user.email
              },
              {
                icon: <FaUserTag className="text-[#123458] dark:text-blue-300 text-xl" />,
                label: "Role",
                value: user.role
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="flex items-start gap-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-all duration-200"
              >
                <div className="bg-[#D4C9BE] dark:bg-gray-600 p-3 rounded-full">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold text-[#030303] dark:text-gray-100 break-all">{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Phone Field */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-all duration-200"
            >
              <div className="bg-[#D4C9BE] dark:bg-gray-600 p-3 rounded-full">
                <FaPhoneAlt className="text-[#123458] dark:text-blue-300 text-xl" />
              </div>
              <div className="flex-1 w-full">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                {editing ? (
                  <div className="mt-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#123458] dark:bg-gray-800 dark:text-white"
                      placeholder="Enter new phone number"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                      >
                        <FaCheck />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setNewPhone(user.phone);
                        }}
                        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                      >
                        <FaTimes />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-between items-center">
                    <p className="text-lg font-semibold text-[#030303] dark:text-gray-100">{user.phone || 'Not provided'}</p>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-red-600 hover:text-[#123458] dark:hover:text-blue-400 font-medium flex items-center gap-2 transition"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
