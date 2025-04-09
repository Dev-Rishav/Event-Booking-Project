import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Cookies from 'js-cookie';

const TicketBookingPage = () => {

   const userId = Cookies.get("userId");
   const { show_id } = useParams();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [timer, setTimer] = useState(null);
  const [orderID, setOrderID] = useState(null);
  const [ticketLink, setTicketLink] = useState(null);

  // Fetch seats on mount
  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const res = await axios.get(`http://localhost:8001/api/show/seats/${show_id}`);
      setSeats(res.data.result);
    } catch (err) {
      console.error("Error fetching seats", err);
    }
  };

  const handleSelectSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const holdSeats = async () => {
    try {
      const res = await axios.post('http://localhost:8001/api/show/booking/hold', {
        show_id,
        seats: selectedSeats,
        userId
      });
      alert(res.data.message);
      startTimer();
    } catch (err) {
      alert(err.response?.data?.message || 'Error holding seats');
    }
  };

  const startTimer = () => {
    let seconds = 300;
    const countdown = setInterval(() => {
      seconds--;
      setTimer(seconds);
      if (seconds <= 0) clearInterval(countdown);
    }, 1000);
  };

  const capturePayment = async (data) => {
    try {
      await axios.post('http://localhost:5000/api/booking/capture-payment', {
        orderId: data.orderID,
      });

      const confirmRes = await axios.post('http://localhost:5000/api/booking/confirm', {
        show_id,
        seats: selectedSeats,
        userId
      });

      alert(confirmRes.data.message);
      setTicketLink(`http://localhost:5000/${confirmRes.data.ticket}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎟️ Book Your Ticket</h1>

      <div className="grid grid-cols-5 gap-3 mb-4">
        {seats.map(seat => (
          <button
            key={seat.seat_number}
            onClick={() => handleSelectSeat(seat.seat_number)}
            className={`p-2 rounded border ${
              selectedSeats.includes(seat.seat_number) ? 'bg-green-400' :
              seat.status === 'booked' ? 'bg-red-400 cursor-not-allowed' :
              'bg-gray-200'
            }`}
            disabled={seat.status === 'booked'}
          >
            {seat.seat_number}
          </button>
        ))}
      </div>

      <button
        className="bg-yellow-500 text-white px-4 py-2 rounded"
        onClick={holdSeats}
        disabled={selectedSeats.length === 0}
      >
        Hold Seats for 5 mins
      </button>

      {timer && (
        <div className="mt-2 text-red-600">
          Time remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
        </div>
      )}

      {timer > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Pay with PayPal</h2>
          <PayPalScriptProvider options={{ 'client-id': 'YOUR_CLIENT_ID' }}>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={async () => {
                const res = await axios.post('http://localhost:5000/api/booking/create-payment', {
                  amount: selectedSeats.length * 10
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

      {ticketLink && (
        <div className="mt-6">
          <h3 className="text-green-600 font-bold">✅ Booking Confirmed!</h3>
          <a href={ticketLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Download Ticket (PDF)
          </a>
        </div>
      )}
    </div>
  );
};

export default TicketBookingPage;
