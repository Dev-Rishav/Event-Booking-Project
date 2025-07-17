import React, { useEffect, useState } from 'react';
import { useEvent } from '../EventContext/EventContext';
import { FaTicketAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';

const Bookings = () => {
  const id = Cookies.get("id");
  const { bookings, getAllBookingOfOrganizer } = useEvent();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllBookingOfOrganizer(id);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600 dark:text-gray-400">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F1EFEC] dark:bg-gray-900 min-h-screen">
      <motion.h2
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-6 mt-12 text-center text-[#123458] dark:text-blue-300 bg-[#D4C9BE] dark:bg-gray-800 rounded-lg py-3 shadow-md"
      >
        Your Show Bookings
      </motion.h2>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {bookings.map((booking, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="relative group bg-white dark:bg-gray-800 border border-[#D4C9BE] dark:border-gray-700 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all"
            >
              {/* Ticket Icon */}
              <div className="absolute top-4 right-4">
                <FaTicketAlt className="text-[#123458] dark:text-blue-400 text-2xl group-hover:scale-110 transition-transform" />
              </div>

              {/* Event Title */}
              <div className="text-xl font-bold text-[#123458] dark:text-blue-300 mb-3">
                {booking.event_title}
              </div>

              <div className="space-y-2 text-sm text-[#030303] dark:text-gray-300">
                <p><strong>Booked by:</strong> {booking.booked_by} ({booking.user_email})</p>
                <p><strong>Seat:</strong> #{booking.seat_number} ({booking.seat_category})</p>
                <p><strong>Price:</strong> ₹{booking.price}</p>
                <p><strong>Show Date:</strong> {booking.show_date}</p>
                <p><strong>Time:</strong> {booking.start_time} - {booking.end_time}</p>
              </div>

              {/* Payment Status */}
              <div className="mt-4">
                <span
                  className={`px-4 py-1 rounded-full text-xs font-semibold shadow ${
                    booking.payment_status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                  }`}
                >
                  {booking.payment_status.toUpperCase()}
                </span>
              </div>

              {/* Booking Time */}
              <div className="text-xs text-gray-400 mt-3">
                Booked on: {new Date(booking.booking_time).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Bookings;
