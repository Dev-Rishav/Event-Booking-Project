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
      } catch (error) {
        setError('Failed to fetch profile data');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = Cookies.get('token');
      await axios.put('http://localhost:8001/user/profile', {
        phone: newPhone
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(prev => ({ ...prev, phone: newPhone }));
      setEditing(false);
      alert("📞 Phone updated successfully!");
    } catch (error) {
      setError('Failed to update phone');
    }
  };

  if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-16 bg-white border border-gray-200 shadow-lg rounded-3xl p-10 relative">
      <div className="flex flex-col items-center">
        <FaUserCircle className="text-[90px] text-indigo-600 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-wide">User Profile</h2>
      </div>

      <div className="space-y-8">
        {/* Name */}
        <div className="flex items-center gap-4">
          <FaUserTag className="text-indigo-500 text-xl" />
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-xl font-semibold text-gray-800">{user.name}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4">
          <FaEnvelope className="text-indigo-500 text-xl" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-xl font-semibold text-gray-800">{user.email}</p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-center gap-4">
          <FaUserTag className="text-indigo-500 text-xl" />
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="capitalize text-xl font-semibold text-gray-800">{user.role}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4">
          <FaPhoneAlt className="text-indigo-500 text-xl mt-1" />
          <div className="w-full">
            <p className="text-sm text-gray-500">Phone</p>
            {editing ? (
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition"
                  title="Save"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setNewPhone(user.phone);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2 rounded-full transition"
                  title="Cancel"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-1">
                <p className="text-xl font-semibold text-gray-800">{user.phone}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition"
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
