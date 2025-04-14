import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserBookings = ({  }) => {
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

    fetchBookings(id);
  }, []);

  if (loading) return <p className="text-center">Loading your bookings...</p>;

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return <p className="text-center text-gray-600">No bookings found.</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center m-8">My Bookings</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div
            key={booking.booking_id}
            className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">{booking.event_title}</h3>
            <p><strong>Venue:</strong> {booking.venue_name}, {booking.city}</p>
            <p><strong>Show Date:</strong> {booking.show_date}</p>
            <p><strong>Time:</strong> {booking.start_time} - {booking.end_time}</p>
            <p><strong>Seat:</strong> #{booking.seat_number} ({booking.seat_category})</p>
            <p><strong>Price:</strong> ₹{booking.price}</p>
            <p><strong>Booking Status:</strong> <span className="capitalize">{booking.payment_status}</span></p>
            {booking.transaction_id && (
              <>
                <p><strong>Transaction:</strong> {booking.transaction_id}</p>
                <p><strong>Amount Paid:</strong> ₹{booking.amount}</p>
              </>
            )}
            <p className="text-xs text-gray-500 mt-2">Booked on {new Date(booking.booking_time).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookings;
