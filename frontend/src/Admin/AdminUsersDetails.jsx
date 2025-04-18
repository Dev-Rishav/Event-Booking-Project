import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaTicketAlt, FaUser } from 'react-icons/fa';

const AdminUsersDetails = () => {
    const { email } = useParams();
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // console.log(email);
        
        const fetchBookings = async () => {
            try {
                const res = await axios.get(`http://localhost:8001/api/userbookings/${email}`);
                setBookings(res.data.result);
            } catch (err) {
                console.error("Error fetching user bookings", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:8001/api/user/${email}`);
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

    if (!user) {
        return <p className="text-center text-red-500 mt-10">User not found.</p>;
      }
    
    if (loading) return <p className="text-center text-gray-600">Loading your bookings...</p>;


    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* User Info */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="text-4xl text-blue-500">
                <FaUser />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
              </div>
            </div>
          </div>
    
          {/* Bookings Section */}
          <h2 className="text-3xl font-bold mb-6 text-red-600 text-center">Booking History</h2>
    
          {bookings.length === 0 ? (
            <p className="text-center text-gray-500">No bookings found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking.booking_id}
                  className="relative bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="absolute top-4 right-4 text-red-500 text-xl">
                    <FaTicketAlt />
                  </div>
    
                  <h3 className="text-xl font-semibold text-indigo-700 mb-2">{booking.event_title}</h3>
    
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Booked by:</strong> {booking.username}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Email:</strong> {booking.user_email}
                  </p>
    
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Seat:</strong> #{booking.seat_number} ({booking.seat_category})
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Price:</strong> ₹{booking.price}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Show Date:</strong> {new Date(booking.show_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Time:</strong> {booking.start_time} - {booking.end_time}
                  </p>
    
                  <p className="text-xs text-gray-500 mb-3">
                    <strong>Booked on:</strong> {new Date(booking.booking_time).toLocaleString()}
                  </p>
    
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      booking.payment_status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {booking.payment_status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      );

}

export default AdminUsersDetails;