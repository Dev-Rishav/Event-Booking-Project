import React, { useEffect, useState } from 'react';
import { useEvent } from '../Organizer/EventContext/EventContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaTicketAlt, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../config/api.js';

const AdminOrganizersDetails = () => {
  const { email } = useParams();
  const { bookings, getAllBookingOfOrganizer } = useEvent();
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.ADMIN.GET_USER(email));
        setOrganizer(res.data.result);
      } catch (err) {
        console.error("Error fetching user details", err);
      }
    };

    const fetchData = async () => {
      try {
        await getAllBookingOfOrganizer(email);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchData();
  }, []);

  if (!organizer) return <p className="text-center text-red-500 mt-10">Organizer not found.</p>;
  if (loading) return <p className="text-center text-blue-500 mt-10">Loading bookings...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-10 mt-12"
    >
      {/* Organizer Info */}
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
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{organizer.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{organizer.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">Role: {organizer.role}</p>
          </div>
        </div>
      </motion.div>

      {/* Booking Info */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300"
      >
        Your Show Bookings
      </motion.h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-5 hover:shadow-lg transition-all"
            >
              <div className="absolute top-4 right-4 text-red-500 text-xl">
                <FaTicketAlt />
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-300">{booking.event_title}</div>
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Booked by:</strong> {booking.booked_by} ({booking.user_email})
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Seat:</strong> #{booking.seat_number} ({booking.seat_category})
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Price:</strong> ₹{booking.price}
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Show Date:</strong> {booking.show_date}
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Time:</strong> {booking.start_time} - {booking.end_time}
              </div>

              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.payment_status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                  }`}
                >
                  {booking.payment_status.toUpperCase()}
                </span>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Booked on: {new Date(booking.booking_time).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminOrganizersDetails;
