import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaTicketAlt } from 'react-icons/fa';

const UserBookings = () => {
  const id = Cookies.get("id");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://localhost:8001/api/userbookings/${id}`);
        setBookings(res.data.result); 
      } catch (err) {
        console.error("Error fetching user bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading your bookings...</p>;

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return <p className="text-center text-gray-500">No bookings found.</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-red-600 text-center">Your Bookings</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div
            key={booking.booking_id}
            className="relative bg-white border rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            {/* Ticket Icon */}
            <div className="absolute top-4 right-4 text-red-500 text-xl">
              <FaTicketAlt />
            </div>

            {/* Event Title */}
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">{booking.event_title}</h3>

            {/* User Info */}
            <p className="text-sm text-gray-700 mb-1">
              <strong>Booked by:</strong> {booking.username}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Email:</strong> {booking.user_email}
            </p>

            {/* Seat Info */}
            <p className="text-sm text-gray-700 mb-1">
              <strong>Seat:</strong> #{booking.seat_number} ({booking.seat_category})
            </p>

            {/* Price */}
            <p className="text-sm text-gray-700 mb-1">
              <strong>Price:</strong> ₹{booking.price}
            </p>

            {/* Show Date and Time */}
            <p className="text-sm text-gray-700 mb-1">
              <strong>Show Date:</strong> {new Date(booking.show_date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Time:</strong> {booking.start_time} - {booking.end_time}
            </p>

            {/* Booking Time */}
            <p className="text-xs text-gray-500 mb-3">
              <strong>Booked on:</strong> {new Date(booking.booking_time).toLocaleString()}
            </p>

            {/* Payment Status */}
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full ${
                booking.payment_status === 'paid'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {booking.payment_status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookings;
