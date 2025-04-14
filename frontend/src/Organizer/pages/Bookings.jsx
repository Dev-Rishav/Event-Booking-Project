import React, { useEffect , useState } from 'react';
import { useEvent } from '../EventContext/EventContext';
import { FaTicketAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';

const Bookings = () => {
  const id = Cookies.get("id");
  const { bookings ,  getAllBookingOfOrganizer } = useEvent();
//   console.log("bookings data:", bookings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await getAllBookingOfOrganizer(id);
        //   console.log('Returned bookings:', response.data.result);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-blue-600 text-lg">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return <div className="text-center py-10 text-gray-500">No bookings found.</div>;
  }

  return (
    <div className="p-6">
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
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  booking.payment_status === 'completed'
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
  );
};

export default Bookings;
