import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaTicketAlt, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../config/api.js';

const AdminUsersDetails = () => {
  const { email } = useParams();
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.BOOKING.USER_BOOKINGS(email));
        setBookings(res.data.result);
      } catch (err) {
        console.error("Error fetching user bookings", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.ADMIN.GET_USER(email));
        setUser(res.data.result);
      } catch (err) {
        console.error("Error fetching user details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    fetchUserDetails();
  }, []);

  if (!user) return <p className="text-center text-red-500 mt-10">User not found.</p>;
  if (loading) return <p className="text-center text-gray-600">Loading user details...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-10 mt-12"
    >
      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-10 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-4">
          <div className="text-4xl text-blue-500 dark:text-blue-400">
            <FaUser />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{user.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">Role: {user.role}</p>
          </div>
        </div>
      </motion.div>

      {/* Bookings Section */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300"
      >
        Booking History
      </motion.h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No bookings found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <motion.div
              key={booking.booking_id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-all"
            >
              <div className="absolute top-4 right-4 text-red-500 text-xl">
                <FaTicketAlt />
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">{booking.event_title}</h3>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Booked by:</strong> {booking.username}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Email:</strong> {booking.user_email}
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Seat:</strong> #{booking.seat_number} ({booking.seat_category})
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Price:</strong> ₹{booking.price}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Show Date:</strong> {new Date(booking.show_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Time:</strong> {booking.start_time} - {booking.end_time}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                <strong>Booked on:</strong> {new Date(booking.booking_time).toLocaleString()}
              </p>

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  booking.payment_status === 'paid'
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                }`}
              >
                {booking.payment_status.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminUsersDetails;
