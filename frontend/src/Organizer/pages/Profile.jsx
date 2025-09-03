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
import { API_ENDPOINTS } from '../../config/api.js';

const Profile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE, {
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
        API_ENDPOINTS.AUTH.PROFILE,
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
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5]"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/30 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] p-6 text-center">
            <div className="flex justify-center">
              <FaUserCircle className="text-6xl text-white bg-[#f9ab8f] rounded-full p-2 border-4 border-white shadow-sm" />
            </div>
            <h2 className="mt-3 text-xl font-bold text-white">
              User Profile
            </h2>
          </div>

          {/* Profile Content */}
          <div className="p-6 space-y-4">
            {[
              {
                icon: <FaUserTag className="text-[#f40752] text-lg" />,
                label: "Name",
                value: user.name
              },
              {
                icon: <FaEnvelope className="text-[#f40752] text-lg" />,
                label: "Email",
                value: user.email
              },
              {
                icon: <FaUserTag className="text-[#f40752] text-lg" />,
                label: "Role",
                value: user.role
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-4 p-3 bg-white/80 rounded-lg border border-white/30 shadow-sm"
              >
                <div className="bg-[#f9ab8f]/20 p-2 rounded-full">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Phone Field */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-4 p-3 bg-white/80 rounded-lg border border-white/30 shadow-sm"
            >
              <div className="bg-[#f9ab8f]/20 p-2 rounded-full">
                <FaPhoneAlt className="text-[#f40752] text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500">Phone</p>
                {editing ? (
                  <div className="mt-1 flex flex-col gap-2">
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#f40752]/50"
                      placeholder="Enter phone number"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        <FaCheck size={12} />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setNewPhone(user.phone);
                        }}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-1"
                      >
                        <FaTimes size={12} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.phone || 'Not provided'}
                    </p>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-[#f40752] hover:text-[#f9ab8f] text-sm flex items-center gap-1"
                    >
                      <FaEdit size={12} />
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