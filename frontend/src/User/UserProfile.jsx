import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaUserCircle, FaPhoneAlt, FaEnvelope, FaUserTag, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const UserProfile = () => {
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

  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 px-6 py-8 bg-white shadow-2xl rounded-2xl">
      <div className="flex flex-col items-center">
        <FaUserCircle className="text-6xl text-blue-600 mb-2" />
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">User Profile</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <FaUserTag className="text-gray-500" />
          <div>
            <p className="text-sm text-gray-500 font-medium">Name</p>
            <p className="text-lg font-semibold text-gray-800">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <FaEnvelope className="text-gray-500" />
          <div>
            <p className="text-sm text-gray-500 font-medium">Email</p>
            <p className="text-lg font-semibold text-gray-800">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <FaUserTag className="text-gray-500" />
          <div>
            <p className="text-sm text-gray-500 font-medium">Role</p>
            <p className="capitalize text-lg font-semibold text-gray-800">{user.role}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <FaPhoneAlt className="text-gray-500 mt-1" />
          <div className="w-full">
            <p className="text-sm text-gray-500 font-medium">Phone</p>
            {editing ? (
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
                  title="Save"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setNewPhone(user.phone);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2 rounded-full"
                  title="Cancel"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-1">
                <p className="text-lg font-semibold text-gray-800">{user.phone}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
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

export default UserProfile;
