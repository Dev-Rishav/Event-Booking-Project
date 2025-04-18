import React, { useEffect, useState } from 'react';
import { useEvent } from '../Organizer/EventContext/EventContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaTicketAlt, FaUser } from 'react-icons/fa';

const AdminOrganizersDetails = () => {
    const { email } = useParams();
    const { bookings, getAllBookingOfOrganizer } = useEvent();
    const [organizer, setOrganizer] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // console.log(email);


        const fetchUserDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:8001/api/user/${email}`);
                setOrganizer(res.data.result);
            } catch (err) {
                console.error("Error fetching user details", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            try {
                const response = await getAllBookingOfOrganizer(email);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };



        fetchData();
        fetchUserDetails();
    }, []);

    if (!organizer) {
        return <p className="text-center text-red-500 mt-10">User not found.</p>;
    }

    if (loading) {
        return <div className="text-center py-10 text-blue-600 text-lg">Loading bookings...</div>;
    }

    // if (bookings.length === 0) {
    //     return <div className="text-center py-10 text-gray-500">No bookings found.</div>;
    // }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* User Info */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="text-4xl text-blue-500">
                        <FaUser />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">{organizer.name}</h2>
                        <p className="text-sm text-gray-600">{organizer.email}</p>
                        <p className="text-sm text-gray-500 capitalize">Role: {organizer.role}</p>
                    </div>
                </div>
            </div>
            {/* Booking Info */}
            <div >
                <h2 className="text-3xl font-semibold mb-6 text-center text-red-500 bg-gray-200 m-8 rounded-lg py-2">Your Show Bookings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-auto">
                    {bookings.map((booking, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-xl font-bold text-indigo-600">{booking.event_title}</div>
                                <FaTicketAlt className="text-red-500 text-xl" />
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                <strong>Booked by:</strong> {booking.booked_by} ({booking.user_email})
                            </div>
                            <div className="text-sm mb-1">
                                <strong>Seat:</strong> #{booking.seat_number} ({booking.seat_category})
                            </div>
                            <div className="text-sm mb-1">
                                <strong>Price:</strong> ₹{booking.price}
                            </div>
                            <div className="text-sm mb-1">
                                <strong>Show Date:</strong> {booking.show_date}
                            </div>
                            <div className="text-sm mb-1">
                                <strong>Time:</strong> {booking.start_time} - {booking.end_time}
                            </div>
                            <div className="mt-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.payment_status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                >
                                    {booking.payment_status.toUpperCase()}
                                </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">Booked on: {new Date(booking.booking_time).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );

}
export default AdminOrganizersDetails;