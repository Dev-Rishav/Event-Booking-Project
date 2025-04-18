import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../User/UserContext/UserContext';
import Cookies from 'js-cookie';


const TicketBookingPage = () => {
  const userEmail = Cookies.get("id");
  const { show_id } = useParams();
  const navigate = useNavigate();
  const { seats, selectedSeats, setSelectedSeats, fetchSeats  , createBookingAndRedirect  , selectedUserShow  , setSelectedUserShow , selectUserShow} = useUser();
  

  useEffect(() => {
    if (!selectedUserShow) {
      const savedEvent = localStorage.getItem("selectedUserShow");
      if (savedEvent) {
        setSelectedUserShow(JSON.parse(savedEvent));
      }
    }
  }, []);

  useEffect(() => {
    if (selectedUserShow) {
      localStorage.setItem("selectedUserShow", JSON.stringify(selectedUserShow));
    }
  }, [selectedUserShow]);


  // Get user information and seat info from context
 
  const [showPayPal, setShowPayPal] = useState(false);

  useEffect(() => {
    fetchSeats(show_id);  // Fetch available seats when the page loads
  }, [show_id , fetchSeats]);

  const handleSelectSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat)); // Deselect
    } else {
      setSelectedSeats([...selectedSeats, seat]); // Select
    }
  };

  const calculateTotalAmount = () => {
    return selectedSeats.reduce((total, seatNo) => {
      const seat = seats.find(s => s.seat_number === seatNo);
      return total + (seat ? seat.price : 0);
    }, 0);
  };

  const handlePayNow = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

    const totalAmount = calculateTotalAmount();
    
    createBookingAndRedirect({
      userEmail,
      showId: show_id,
      selectedSeats: selectedSeats.map(seatNo => ({
        seat_number: seatNo,
        seat_id: seats.find(s => s.seat_number === seatNo).seat_id,
        price: seats.find(s => s.seat_number === seatNo).price
      })),
      totalAmount,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto my-12">
      <h1 className="text-3xl font-bold mb-6 text-center">🎟️ Book Your Ticket</h1>

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
    </div>
  );
};

export default TicketBookingPage;
