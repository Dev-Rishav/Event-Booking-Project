import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../User/UserContext/UserContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

const TicketBookingPage = () => {
  const userId = Cookies.get("id"); 
  const { show_id } = useParams();
  const { 
    seats, 
    selectedSeats, 
    setSelectedSeats, 
    selectedUserEvent,
    city,
    fetchSeats, 
    createBookingAndRedirect,
    selectedUserShow, 
    setSelectedUserShow,
    downloadTicket
  } = useUser();
  
  const [venueType, setVenueType] = useState('theatre');
  const [loading, setLoading] = useState(true);
  const [holdTimer, setHoldTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isHolding, setIsHolding] = useState(false);
  const [bookingError, setBookingError] = useState(null);

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
      if (selectedUserShow.event_category === 'Sports') {
        setVenueType('stadium');
      } else if (selectedUserShow.event_category === 'Conference') {
        setVenueType('conference');
      } else {
        setVenueType('theatre');
      }
    }
  }, [selectedUserShow]);

  useEffect(() => {
    const loadSeats = async () => {
      setLoading(true);
      await fetchSeats(show_id);
      setLoading(false);
    };
    loadSeats();
  }, [show_id]);

  // Timer effect for seat holds
  useEffect(() => {
    if (holdTimer && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      clearHold();
    }
  }, [timeLeft, holdTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectSeat = async (seatNumber) => {
    if (isHolding) {
      alert('Please complete or cancel your current booking before selecting new seats');
      return;
    }
    
    setSelectedSeats(prev => 
      prev.includes(seatNumber) 
        ? prev.filter(s => s !== seatNumber) 
        : [...prev, seatNumber]
    );
  };

  const holdSeats = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

    try {
      setIsHolding(true);
      setBookingError(null);
      
      const response = await axios.post('http://localhost:8001/api/booking/hold', {
        show_id,
        seats: selectedSeats,
        userId
      });

      // Start the hold timer
      setHoldTimer(true);
      setTimeLeft(300); // 5 minutes
      
      alert('Seats held for 5 minutes. Please complete your booking.');
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to hold seats');
      console.error('Hold seats error:', err);
    } finally {
      setIsHolding(false);
    }
  };

  const clearHold = async () => {
    try {
      await axios.post('http://localhost:8001/api/booking/cancel/hold', {
       show_id, 
       seats: selectedSeats, 
       userId 
      });
      setHoldTimer(null);
      setTimeLeft(300);
    } catch (err) {
      console.error('Error clearing hold:', err);
    }
  };

  const handlePayNow = async () => {
    if (!holdTimer) {
      alert('Please hold your seats first before payment');
      return;
    }
    try {
      setIsHolding(true);
      setBookingError(null);

      if (selectedSeats.length === 0) {
        alert('Please select at least one seat.');
        return;
      }
      createBookingAndRedirect({
        userId,
        showId: show_id,
        selectedSeats: selectedSeats.map(seatNo => ({
          seat_number: seatNo,
          seat_id: seats.find(s => s.seat_number === seatNo)?.seat_id,
          price: seats.find(s => s.seat_number === seatNo)?.price
        })),
        totalAmount: calculateTotalAmount(),
      });
      
      clearHold();
      setSelectedSeats([]);

      // const bookingDetails = {
      //   // userName: user.name,
      //   userEmail: userId,
      //   eventTitle: selectedUserEvent.title,
      //   // venue: city,
      //   showTime: selectedUserShow.start_time,
      //   showDate: selectedUserShow.show_date,
      //   seatNumbers: selectedSeats, // like ['A1', 'A2']
      //   ticketId: uuidv4(), // use ticketId from backend
      //   bookingTime: new Date().toLocaleString()
      // }
      
      // downloadTicket(bookingDetails);
      
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsHolding(false);
    }
  };

  const calculateTotalAmount = () => {
    return selectedSeats.reduce((total, seatNo) => {
      const seat = seats.find(s => s.seat_number === seatNo);
      return total + (seat?.price || 0);
    }, 0);
  };

  const getSeatColor = (category, status, isSelected) => {
    if (status === 'booked') return 'bg-red-400 text-white';
    if (isSelected) {
      if (holdTimer) return 'bg-indigo-600 text-white';
      return 'bg-green-600 text-white';
    }
    
    switch((category || '').toLowerCase()) {
      case 'vip': return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'premium': return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'standard': return 'bg-yellow-500 hover:bg-yellow-600 text-gray-900';
      case 'economy': return 'bg-gray-600 hover:bg-gray-700 text-white';
      default: return 'bg-gray-300 hover:bg-gray-400 text-gray-800';
    }
  };

  const renderTheatreLayout = () => {
    return (
      <div className="theatre-layout">
        <div className="stage-area bg-red-700 h-16 mb-8 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">STAGE</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {seats.map(seat => {
            const isSelected = selectedSeats.includes(seat.seat_number);
            const isBooked = seat.status === 'booked';
            
            return (
              <button
                key={seat.seat_id}
                onClick={() => !isBooked && handleSelectSeat(seat.seat_number)}
                className={`
                  w-12 h-12 rounded-lg shadow-md border-2 border-gray-200 
                  flex flex-col items-center justify-center cursor-pointer 
                  transition-all duration-200 font-medium
                  ${getSeatColor(seat.seat_category, seat.status, isSelected)}
                  ${isBooked ? 'cursor-not-allowed' : 'hover:shadow-lg'}
                  ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                `}
                disabled={isBooked || isHolding}
              >
                <span className="text-xs">{seat.seat_number}</span>
                <span className="text-[10px] mt-1">${seat.price}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ... (keep your existing renderStadiumLayout and renderConferenceLayout functions)

  const renderSeatLayout = () => {
    if (loading) return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Loading seat map...</p>
      </div>
    );
    
    if (!seats.length) return (
      <div className="text-center py-12">
        <p className="text-gray-600">No seats available for this event</p>
      </div>
    );

    switch(venueType) {
      case 'stadium': return renderStadiumLayout();
      case 'conference': return renderConferenceLayout();
      default: return renderTheatreLayout();
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto my-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        🎟️ Book Your Tickets
      </h1>
      
      <div className="text-center mb-6">
        <span className="inline-block bg-gray-100 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 capitalize shadow-sm">
          {venueType} seating
        </span>
      </div>

      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {['VIP', 'Premium', 'Standard', 'Economy', 'Selected', 'Held', 'Booked'].map((label) => (
          <div key={label} className="flex items-center px-3 py-1 bg-white rounded-full shadow-xs border">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              label === 'Selected' ? 'bg-green-600' :
              label === 'Held' ? 'bg-indigo-600' :
              label === 'Booked' ? 'bg-red-400' :
              label === 'VIP' ? 'bg-purple-600' :
              label === 'Premium' ? 'bg-blue-600' :
              label === 'Standard' ? 'bg-yellow-500' : 'bg-gray-600'
            }`}></div>
            <span className="text-xs sm:text-sm">{label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        {renderSeatLayout()}
      </div>

      {selectedSeats.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Your Tickets</h3>
          
          <div className="flex overflow-x-auto pb-4 gap-4">
            {selectedSeats.map(seatNo => {
              const seat = seats.find(s => s.seat_number === seatNo);
              return (
                <div key={seatNo} className="flex-shrink-0 w-48 h-32 bg-gradient-to-br from-blue-50 to-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500">Seat</p>
                      <p className="font-bold text-lg">{seatNo}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      seat?.seat_category === 'VIP' ? 'bg-purple-100 text-purple-800' :
                      seat?.seat_category === 'Premium' ? 'bg-blue-100 text-blue-800' :
                      seat?.seat_category === 'Standard' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {seat?.seat_category || 'Standard'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-bold text-blue-600">${seat?.price?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold text-blue-600">
              ${calculateTotalAmount().toFixed(2)}
            </span>
          </div>

          {holdTimer && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex justify-between items-center">
                <span className="text-indigo-700 font-medium">Seats held for:</span>
                <span className="text-indigo-900 font-bold">{formatTime(timeLeft)}</span>
              </div>
              <p className="text-xs text-indigo-600 mt-1">
                Complete your booking before time runs out
              </p>
            </div>
          )}

          {bookingError && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-red-700">{bookingError}</p>
            </div>
          )}
        </div>
      )}

      {selectedSeats.length > 0 && (
        <div className="text-center space-x-4">
          {!holdTimer ? (
            <button
              onClick={holdSeats}
              disabled={isHolding}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 
              text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all 
              duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 
              focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isHolding ? 'Processing...' : 'Hold Seats (5 mins)'}
            </button>
          ) : (
            <>
              <button
                onClick={handlePayNow}
                disabled={isHolding}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all 
                duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isHolding ? 'Processing...' : 'Confirm & Pay Now'}
              </button>
              <button
                onClick={clearHold}
                disabled={isHolding}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 
                text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all 
                duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 
                focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Cancel Hold
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketBookingPage;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useUser } from '../User/UserContext/UserContext';
// import Cookies from 'js-cookie';

// const TicketBookingPage = () => {
//   const userEmail = Cookies.get("id");
//   const { show_id } = useParams();
//   const { 
//     seats, 
//     selectedSeats, 
//     setSelectedSeats, 
//     fetchSeats, 
//     createBookingAndRedirect, 
//     selectedUserShow, 
//     setSelectedUserShow 
//   } = useUser();
  
//   const [venueType, setVenueType] = useState('theatre');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!selectedUserShow) {
//       const savedEvent = localStorage.getItem("selectedUserShow");
//       if (savedEvent) {
//         setSelectedUserShow(JSON.parse(savedEvent));
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (selectedUserShow) {
//       localStorage.setItem("selectedUserShow", JSON.stringify(selectedUserShow));
//       if (selectedUserShow.event_category === 'Sports') {
//         setVenueType('stadium');
//       } else if (selectedUserShow.event_category === 'Conference') {
//         setVenueType('conference');
//       } else {
//         setVenueType('theatre');
//       }
//     }
//   }, [selectedUserShow]);

//   useEffect(() => {
//     const loadSeats = async () => {
//       setLoading(true);
//       await fetchSeats(show_id);
//       setLoading(false);
//     };
//     loadSeats();
//   }, [show_id]);

//   const handleSelectSeat = (seatNumber) => {
//     setSelectedSeats(prev => 
//       prev.includes(seatNumber) 
//         ? prev.filter(s => s !== seatNumber) 
//         : [...prev, seatNumber]
//     );
//   };

//   const calculateTotalAmount = () => {
//     return selectedSeats.reduce((total, seatNo) => {
//       const seat = seats.find(s => s.seat_number === seatNo);
//       return total + (seat?.price || 0);
//     }, 0);
//   };

//   const handlePayNow = () => {
//     if (selectedSeats.length === 0) {
//       alert('Please select at least one seat.');
//       return;
//     }
//     createBookingAndRedirect({
//       userEmail,
//       showId: show_id,
//       selectedSeats: selectedSeats.map(seatNo => ({
//         seat_number: seatNo,
//         seat_id: seats.find(s => s.seat_number === seatNo)?.seat_id,
//         price: seats.find(s => s.seat_number === seatNo)?.price
//       })),
//       totalAmount: calculateTotalAmount(),
//     });
//   };

//   const getSeatColor = (category, status, isSelected) => {
//     if (status === 'booked') return 'bg-red-400 text-white';
//     if (isSelected) return 'bg-green-600 text-white';
    
//     switch((category || '').toLowerCase()) {
//       case 'vip': return 'bg-purple-600 hover:bg-purple-700 text-white';
//       case 'premium': return 'bg-blue-600 hover:bg-blue-700 text-white';
//       case 'standard': return 'bg-yellow-500 hover:bg-yellow-600 text-gray-900';
//       case 'economy': return 'bg-gray-600 hover:bg-gray-700 text-white';
//       default: return 'bg-gray-300 hover:bg-gray-400 text-gray-800';
//     }
//   };

//   const renderTheatreLayout = () => {
//     return (
//       <div className="theatre-layout">
//         <div className="stage-area bg-red-700 h-16 mb-8 rounded-lg flex items-center justify-center shadow-lg">
//           <span className="text-white font-bold text-xl">STAGE</span>
//         </div>
        
//         <div className="flex flex-wrap justify-center gap-2">
//           {seats.map(seat => {
//             const isSelected = selectedSeats.includes(seat.seat_number);
//             const isBooked = seat.status === 'booked';
            
//             return (
//               <button
//                 key={seat.seat_id}
//                 onClick={() => !isBooked && handleSelectSeat(seat.seat_number)}
//                 className={`
//                   w-12 h-12 rounded-lg shadow-md border-2 border-gray-200 
//                   flex flex-col items-center justify-center cursor-pointer 
//                   transition-all duration-200 font-medium
//                   ${getSeatColor(seat.seat_category, seat.status, isSelected)}
//                   ${isBooked ? 'cursor-not-allowed' : 'hover:shadow-lg'}
//                   ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
//                 `}
//                 disabled={isBooked}
//               >
//                 <span className="text-xs">{seat.seat_number}</span>
//                 <span className="text-[10px] mt-1">${seat.price}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   const renderStadiumLayout = () => {
//     return (
//       <div className="stadium-layout">
//         <div className="field-area bg-green-700 h-32 mb-8 rounded-lg flex items-center justify-center shadow-lg">
//           <span className="text-white font-bold text-xl">FIELD</span>
//         </div>
        
//         <div className="grid grid-cols-5 gap-4">
//           {seats.map(seat => {
//             const isSelected = selectedSeats.includes(seat.seat_number);
//             const isBooked = seat.status === 'booked';
            
//             return (
//               <button
//                 key={seat.seat_id}
//                 onClick={() => !isBooked && handleSelectSeat(seat.seat_number)}
//                 className={`
//                   p-3 rounded-lg shadow-sm border flex flex-col items-center justify-center
//                   cursor-pointer transition-all duration-200
//                   ${getSeatColor(seat.seat_category, seat.status, isSelected)}
//                   ${isBooked ? 'cursor-not-allowed' : 'hover:shadow-md'}
//                   ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500' : ''}
//                 `}
//                 disabled={isBooked}
//               >
//                 <span className="text-sm font-medium">{seat.seat_number}</span>
//                 <span className="text-xs mt-1">${seat.price}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   const renderConferenceLayout = () => {
//     return (
//       <div className="conference-layout">
//         <div className="stage-area bg-blue-700 h-20 mb-8 rounded-lg flex items-center justify-center shadow-lg">
//           <span className="text-white font-bold text-xl">STAGE</span>
//         </div>
        
//         <div className="grid grid-cols-5 gap-4">
//           {seats.map(seat => {
//             const isSelected = selectedSeats.includes(seat.seat_number);
//             const isBooked = seat.status === 'booked';
            
//             return (
//               <button
//                 key={seat.seat_id}
//                 onClick={() => !isBooked && handleSelectSeat(seat.seat_number)}
//                 className={`
//                   p-3 rounded-md border flex flex-col items-center justify-center
//                   cursor-pointer transition-all duration-200
//                   ${getSeatColor(seat.seat_category, seat.status, isSelected)}
//                   ${isBooked ? 'cursor-not-allowed' : 'hover:shadow-sm'}
//                   ${isSelected ? 'ring-1 ring-offset-1 ring-blue-500' : ''}
//                 `}
//                 disabled={isBooked}
//               >
//                 <span className="text-xs font-medium">{seat.seat_number}</span>
//                 <span className="text-xs mt-1">${seat.price}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   const renderSeatLayout = () => {
//     if (loading) return (
//       <div className="text-center py-12">
//         <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//         <p className="mt-2 text-gray-600">Loading seat map...</p>
//       </div>
//     );
    
//     if (!seats.length) return (
//       <div className="text-center py-12">
//         <p className="text-gray-600">No seats available for this event</p>
//       </div>
//     );

//     switch(venueType) {
//       case 'stadium': return renderStadiumLayout();
//       case 'conference': return renderConferenceLayout();
//       default: return renderTheatreLayout();
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto my-8">
//       <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
//         🎟️ Book Your Tickets
//       </h1>
      
//       <div className="text-center mb-6">
//         <span className="inline-block bg-gray-100 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 capitalize shadow-sm">
//           {venueType} seating
//         </span>
//       </div>

//       <div className="flex justify-center gap-3 mb-8 flex-wrap">
//         {['VIP', 'Premium', 'Standard', 'Economy', 'Selected', 'Booked'].map((label) => (
//           <div key={label} className="flex items-center px-3 py-1 bg-white rounded-full shadow-xs border">
//             <div className={`w-3 h-3 rounded-full mr-2 ${
//               label === 'Selected' ? 'bg-green-600' :
//               label === 'Booked' ? 'bg-red-400' :
//               label === 'VIP' ? 'bg-purple-600' :
//               label === 'Premium' ? 'bg-blue-600' :
//               label === 'Standard' ? 'bg-yellow-500' : 'bg-gray-600'
//             }`}></div>
//             <span className="text-xs sm:text-sm">{label}</span>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
//         {renderSeatLayout()}
//       </div>

//       {selectedSeats.length > 0 && (
//         <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
//           <h3 className="text-xl font-bold mb-4 text-gray-800">Your Tickets</h3>
          
//           {/* Horizontal ticket box layout */}
//           <div className="flex overflow-x-auto pb-4 gap-4">
//             {selectedSeats.map(seatNo => {
//               const seat = seats.find(s => s.seat_number === seatNo);
//               return (
//                 <div key={seatNo} className="flex-shrink-0 w-48 h-32 bg-gradient-to-br from-blue-50 to-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-xs text-gray-500">Seat</p>
//                       <p className="font-bold text-lg">{seatNo}</p>
//                     </div>
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       seat?.seat_category === 'VIP' ? 'bg-purple-100 text-purple-800' :
//                       seat?.seat_category === 'Premium' ? 'bg-blue-100 text-blue-800' :
//                       seat?.seat_category === 'Standard' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-gray-100 text-gray-800'
//                     }`}>
//                       {seat?.seat_category || 'Standard'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-end">
//                     <div>
//                       <p className="text-xs text-gray-500">Price</p>
//                       <p className="font-bold text-blue-600">${seat?.price?.toFixed(2) || '0.00'}</p>
//                     </div>
//                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
//                       <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="flex justify-between items-center pt-4 border-t mt-4">
//             <span className="text-lg font-semibold">Total:</span>
//             <span className="text-xl font-bold text-blue-600">
//               ${calculateTotalAmount().toFixed(2)}
//             </span>
//           </div>
//         </div>
//       )}

//       {selectedSeats.length > 0 && (
//         <div className="text-center">
//           <button
//             onClick={handlePayNow}
//             className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
//             text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all 
//             duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 
//             focus:ring-offset-2"
//           >
//             Proceed to Payment
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TicketBookingPage;

