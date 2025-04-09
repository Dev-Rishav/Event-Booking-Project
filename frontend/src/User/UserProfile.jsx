import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

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

        const userData = response.data.result; // assuming array
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
      alert("Phone updated successfully");
    } catch (error) {
      setError('Failed to update phone');
    }
  };

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">User Profile</h2>

      <div className="space-y-4">
        <div>
          <label className="font-medium text-gray-700">Name:</label>
          <p className="text-gray-800">{user.name}</p>
        </div>

        <div>
          <label className="font-medium text-gray-700">Email:</label>
          <p className="text-gray-800">{user.email}</p>
        </div>

        <div>
          <label className="font-medium text-gray-700">Role:</label>
          <p className="capitalize text-gray-800">{user.role}</p>
        </div>

        <div>
          <label className="font-medium text-gray-700">Phone:</label>
          {editing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-1"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="text-sm text-gray-500 hover:underline"
                onClick={() => {
                  setEditing(false);
                  setNewPhone(user.phone);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-800">{user.phone}</p>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
