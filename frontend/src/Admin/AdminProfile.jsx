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

const AdminProfile = () => {
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
      } catch (error) {
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
    } catch (error) {
      setError('Failed to update phone');
    }
  };

  if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-700 dark:to-gray-600 p-8 text-center">
          <div className="flex justify-center">
            <FaUserCircle className="text-[90px] text-white bg-gray-300 dark:bg-gray-800 rounded-full p-2 border-4 border-white shadow-lg" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-white">User Profile</h2>
          <p className="mt-2 text-indigo-100">Manage your account information</p>
        </div>

        {/* Profile Content */}
        <div className="px-8 py-10 sm:p-12 space-y-8">
          {[
            { label: 'Name', icon: <FaUserTag />, value: user.name },
            { label: 'Email', icon: <FaEnvelope />, value: user.email },
            { label: 'Role', icon: <FaUserTag />, value: user.role?.toUpperCase() }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              layout
              className="flex items-start gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full text-gray-700 dark:text-gray-300">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{item.label}</p>
                <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-gray-100 break-all">
                  {item.value}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Phone Field */}
          <motion.div
            layout
            className="flex items-start gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full text-gray-700 dark:text-gray-300">
              <FaPhoneAlt />
            </div>
            <div className="flex-1 w-full">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Phone</p>
              {editing ? (
                <div className="mt-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex justify-between items-center">
                  <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{user.phone || 'Not provided'}</p>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-red-600 hover:text-gray-800 dark:hover:text-gray-200 font-medium flex items-center gap-2 transition"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile;
