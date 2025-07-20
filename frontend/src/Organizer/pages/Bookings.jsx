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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f40752]"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5]">
      <motion.h2
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl md:text-3xl font-bold mb-6 mt-8 md:mt-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#f40752] to-[#f9ab8f]"
      >
        Your Show Bookings
      </motion.h2>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto"
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
              className="relative group bg-white/90 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-5 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Ticket Icon */}
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] p-2 rounded-lg shadow-sm">
                  <FaTicketAlt className="text-white text-xl group-hover:rotate-12 transition-transform" />
                </div>
              </div>

              {/* Event Title */}
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 pr-8">
                {booking.event_title}
              </h3>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start">
                  <span className="font-medium min-w-[90px]">Booked by:</span>
                  <span>{booking.booked_by} ({booking.user_email})</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium min-w-[90px]">Seat:</span>
                  <span>#{booking.seat_number} ({booking.seat_category})</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium min-w-[90px]">Price:</span>
                  <span>₹{booking.price}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium min-w-[90px]">Show Date:</span>
                  <span>{booking.show_date}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium min-w-[90px]">Time:</span>
                  <span>{booking.start_time} - {booking.end_time}</span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.payment_status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {booking.payment_status.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(booking.booking_time).toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Bookings;