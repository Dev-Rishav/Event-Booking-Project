import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useUser } from '../User/UserContext/UserContext';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Cookies from 'js-cookie';

const TicketBookingPage = () => {
  const userId = Cookies.get("id");
  const { show_id } = useParams();

  const { seats, bookSeats, selectedSeats, setSelectedSeats, fetchSeats } = useUser();
  const [showPayPal, setShowPayPal] = useState(false);
  const [orderID, setOrderID] = useState(null);

  useEffect(() => {
    fetchSeats(show_id);
  }, []);

  const handleSelectSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handlePayNow = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    setShowPayPal(true);
  };

  const capturePayment = async (data) => {
    try {
      // Capture PayPal Payment
      await axios.post('http://localhost:8001/api/booking/capture-payment', {
        orderId: data.orderID,
      });

      // Save booking
      const confirmRes = await bookSeats(show_id);

      alert(confirmRes.data.message);
      setSelectedSeats([]);
      setShowPayPal(false);
      fetchSeats(); // refresh seat availability
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto my-12">
      <h1 className="text-3xl font-bold mb-6 text-center">🎟️ Book Your Ticket</h1>

      {/* Legend */}
      <div className="flex gap-4 justify-center mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-sm"></div> Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 rounded-sm"></div> Booked
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 border rounded-sm"></div> Available
        </div>
      </div>

      {/* Seat Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-8">
        {seats.map(seat => {
          const isSelected = selectedSeats.includes(seat.seat_number);
          const isBooked = seat.status === 'booked';

          return (
            <div
              key={seat.seat_number}
              onClick={() => !isBooked && handleSelectSeat(seat.seat_number)}
              className={`
                p-3 rounded-xl shadow-md border text-center cursor-pointer transition-all duration-200
                ${isBooked ? 'bg-red-300 text-white cursor-not-allowed' :
                  isSelected ? 'bg-green-500 text-white' :
                  'bg-gray-100 hover:bg-blue-100'}
              `}
            >
              <div className="font-bold text-lg">{seat.seat_number}</div>
              <div className="text-sm text-gray-700">{seat.seat_category}</div>
              <div className="text-sm text-gray-600">${seat.price}</div>
              <div className={`text-xs mt-1 ${isBooked ? 'text-red-800' : 'text-green-800'}`}>
                {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pay Now Button */}
      {selectedSeats.length > 0 && !showPayPal && (
        <div className="text-center">
          <button
            onClick={handlePayNow}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-lg"
          >
            Pay Now
          </button>
        </div>
      )}

      {/* PayPal Payment */}
      {showPayPal && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-4">💳 Complete Your Payment</h2>
          <PayPalScriptProvider options={{ 'client-id': 'YOUR_CLIENT_ID' }}>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={async () => {
                const res = await axios.post('http://localhost:8001/api/booking/create-payment', {
                  amount: selectedSeats.reduce((sum, seatNo) => {
                    const seat = seats.find(s => s.seat_number === seatNo);
                    return sum + (seat ? seat.price : 0);
                  }, 0),
                });
                setOrderID(res.data.id);
                return res.data.id;
              }}
              onApprove={capturePayment}
              onError={(err) => alert('Payment error: ' + err)}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
};

export default TicketBookingPage;


// import React, { useEffect, useState } from 'react';
// import { useParams } from "react-router-dom";
// import axios from 'axios';
// import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
// import Cookies from 'js-cookie';

// const TicketBookingPage = () => {

//    const userId = Cookies.get("userId");
//    const { show_id } = useParams();

//   const [seats, setSeats] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [timer, setTimer] = useState(null);
//   const [orderID, setOrderID] = useState(null);
//   const [ticketLink, setTicketLink] = useState(null);

//   // Fetch seats on mount
//   useEffect(() => {
//     fetchSeats();
//   }, []);

//   const fetchSeats = async () => {
//     try {
//       const res = await axios.get(`http://localhost:8001/api/show/seats/${show_id}`);
//       setSeats(res.data.result);
//     } catch (err) {
//       console.error("Error fetching seats", err);
//     }
//   };

//   const handleSelectSeat = (seat) => {
//     if (selectedSeats.includes(seat)) {
//       setSelectedSeats(selectedSeats.filter(s => s !== seat));
//     } else {
//       setSelectedSeats([...selectedSeats, seat]);
//     }
//   };

//   const holdSeats = async () => {
//     try {
//       const res = await axios.post('http://localhost:8001/api/show/booking/hold', {
//         show_id,
//         seats: selectedSeats,
//         userId
//       });
//       alert(res.data.message);
//       startTimer();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Error holding seats');
//     }
//   };

//   const startTimer = () => {
//     let seconds = 300;
//     const countdown = setInterval(() => {
//       seconds--;
//       setTimer(seconds);
//       if (seconds <= 0) clearInterval(countdown);
//     }, 1000);
//   };

//   const capturePayment = async (data) => {
//     try {
//       await axios.post('http://localhost:5000/api/booking/capture-payment', {
//         orderId: data.orderID,
//       });

//       const confirmRes = await axios.post('http://localhost:5000/api/booking/confirm', {
//         show_id,
//         seats: selectedSeats,
//         userId
//       });

//       alert(confirmRes.data.message);
//       setTicketLink(`http://localhost:5000/${confirmRes.data.ticket}`);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Payment failed');
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">🎟️ Book Your Ticket</h1>

//       <div className="grid grid-cols-5 gap-3 mb-4">
//         {seats.map(seat => (
//           <button
//             key={seat.seat_number}
//             onClick={() => handleSelectSeat(seat.seat_number)}
//             className={`p-2 rounded border ${
//               selectedSeats.includes(seat.seat_number) ? 'bg-green-400' :
//               seat.status === 'booked' ? 'bg-red-400 cursor-not-allowed' :
//               'bg-gray-200'
//             }`}
//             disabled={seat.status === 'booked'}
//           >
//             {seat.seat_number}
//           </button>
//         ))}
//       </div>

//       <button
//         className="bg-yellow-500 text-white px-4 py-2 rounded"
//         onClick={holdSeats}
//         disabled={selectedSeats.length === 0}
//       >
//         Hold Seats for 5 mins
//       </button>

//       {timer && (
//         <div className="mt-2 text-red-600">
//           Time remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
//         </div>
//       )}

//       {timer > 0 && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold mb-2">Pay with PayPal</h2>
//           <PayPalScriptProvider options={{ 'client-id': 'YOUR_CLIENT_ID' }}>
//             <PayPalButtons
//               style={{ layout: 'vertical' }}
//               createOrder={async () => {
//                 const res = await axios.post('http://localhost:5000/api/booking/create-payment', {
//                   amount: selectedSeats.length * 10
//                 });
//                 setOrderID(res.data.id);
//                 return res.data.id;
//               }}
//               onApprove={capturePayment}
//               onError={(err) => alert('Payment error: ' + err)}
//             />
//           </PayPalScriptProvider>
//         </div>
//       )}

//       {ticketLink && (
//         <div className="mt-6">
//           <h3 className="text-green-600 font-bold">✅ Booking Confirmed!</h3>
//           <a href={ticketLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//             Download Ticket (PDF)
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TicketBookingPage;
