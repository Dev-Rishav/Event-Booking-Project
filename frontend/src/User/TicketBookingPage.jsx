import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../User/UserContext/UserContext';
import Cookies from 'js-cookie';

const TicketBookingPage = () => {
  const userEmail = Cookies.get("id");
  const { show_id } = useParams();
  const { 
    seats, 
    selectedSeats, 
    setSelectedSeats, 
    fetchSeats, 
    createBookingAndRedirect, 
    selectedUserShow, 
    setSelectedUserShow 
  } = useUser();
  
  const [venueType, setVenueType] = useState('theatre');
  const [loading, setLoading] = useState(true);

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

  const handleSelectSeat = (seatNumber) => {
    setSelectedSeats(prev => 
      prev.includes(seatNumber) 
        ? prev.filter(s => s !== seatNumber) 
        : [...prev, seatNumber]
    );
  };

  const calculateTotalAmount = () => {
    return selectedSeats.reduce((total, seatNo) => {
      const seat = seats.find(s => s.seat_number === seatNo);
      return total + (seat?.price || 0);
    }, 0);
  };

  const handlePayNow = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
    createBookingAndRedirect({
      userEmail,
      showId: show_id,
      selectedSeats: selectedSeats.map(seatNo => ({
        seat_number: seatNo,
        seat_id: seats.find(s => s.seat_number === seatNo)?.seat_id,
        price: seats.find(s => s.seat_number === seatNo)?.price
      })),
      totalAmount: calculateTotalAmount(),
    });
  };

  const getSeatColor = (category, status, isSelected) => {
    if (status === 'booked') return 'bg-red-400 text-white';
    if (isSelected) return 'bg-green-600 text-white';
    
    switch((category || '').toLowerCase()) {
      case 'vip': return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'premium': return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'standard': return 'bg-yellow-500 hover:bg-yellow-600 text-gray-900';
      case 'economy': return 'bg-gray-600 hover:bg-gray-700 text-white';
      default: return 'bg-gray-300 hover:bg-gray-400 text-gray-800';
    }
  };

  const groupSeatsBySection = () => {
    const sections = {};
    
    seats.forEach(seat => {
      const sectionName = seat.seat_section || 'General';
      const rowName = seat.seat_row || '1';
      
      if (!sections[sectionName]) {
        sections[sectionName] = {};
      }
      
      if (!sections[sectionName][rowName]) {
        sections[sectionName][rowName] = [];
      }
      
      sections[sectionName][rowName].push(seat);
    });
    
    return sections;
  };

  const renderTheatreLayout = () => {
    const sections = groupSeatsBySection();
    
    return (
      <div className="theatre-layout">
        <div className="stage-area bg-red-700 h-16 mb-8 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">STAGE</span>
        </div>
        
        {Object.entries(sections).map(([sectionName, rows]) => (
          <div key={sectionName} className="mb-8">
            {/* <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              {sectionName} Section
            </h3> */}
            
            <div className="flex flex-col items-center">
              {Object.entries(rows).map(([rowName, rowSeats]) => (
                <div key={rowName} className="flex mb-2 items-center">
                  <span className="w-8 text-sm font-medium text-gray-600 mx-2">
                   
                  </span>
                  <div className="flex flex-wrap">
                    {rowSeats.map(seat => {
                      const isSelected = selectedSeats.includes(seat.seat_number);
                      const isBooked = seat.status === 'booked';
                      
                      return (
                        <button
                          key={seat.seat_id}
                          onClick={() => !isBooked && handleSelectSeat(seat.seat_number)}
                          className={`
                            w-12 h-12 m-1 rounded-lg shadow-md border-2 border-gray-200 
                            flex flex-col items-center justify-center cursor-pointer 
                            transition-all duration-200 font-medium
                            ${getSeatColor(seat.seat_category, seat.status, isSelected)}
                            ${isBooked ? 'cursor-not-allowed' : 'hover:shadow-lg'}
                            ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                          `}
                          disabled={isBooked}
                        >
                          <span className="text-xs">{seat.seat_number}</span>
                          <span className="text-[10px] mt-1">${seat.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStadiumLayout = () => {
    const sections = groupSeatsBySection();
    
    return (
      <div className="stadium-layout">
        <div className="field-area bg-green-700 h-32 mb-8 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">FIELD</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(sections).map(([sectionName, rows]) => (
            <div key={sectionName} className="bg-gray-50 p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-3 text-gray-800">
                {sectionName} Stand
              </h3>
              
              <div className="grid grid-cols-5 gap-2">
                {Object.values(rows).flat().map(seat => {
                  const isSelected = selectedSeats.includes(seat.seat_number);
                  const isBooked = seat.status === 'booked';
                  
                  return (
                    <button
                      key={seat.seat_id}
                      onClick={() => !isBooked && handleSelectSeat(seat.seat_number)}
                      className={`
                        p-2 rounded-lg shadow-sm border flex flex-col items-center justify-center
                        cursor-pointer transition-all duration-200
                        ${getSeatColor(seat.seat_category, seat.status, isSelected)}
                        ${isBooked ? 'cursor-not-allowed' : 'hover:shadow-md'}
                        ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500' : ''}
                      `}
                      disabled={isBooked}
                    >
                      <span className="text-sm font-medium">{seat.seat_number}</span>
                      <span className="text-xs mt-1">${seat.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderConferenceLayout = () => {
    const sections = groupSeatsBySection();
    
    return (
      <div className="conference-layout">
        <div className="stage-area bg-blue-700 h-20 mb-8 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">STAGE</span>
        </div>
        
        {Object.entries(sections).map(([sectionName, rows]) => (
          <div key={sectionName} className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              {sectionName} Section
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(rows).map(([rowName, rowSeats]) => (
                <div key={rowName} className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-medium text-gray-700 mb-2">Row {rowName}</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {rowSeats.map(seat => {
                      const isSelected = selectedSeats.includes(seat.seat_number);
                      const isBooked = seat.status === 'booked';
                      
                      return (
                        <button
                          key={seat.seat_id}
                          onClick={() => !isBooked && handleSelectSeat(seat.seat_number)}
                          className={`
                            p-2 rounded-md border flex flex-col items-center justify-center
                            cursor-pointer transition-all duration-200
                            ${getSeatColor(seat.seat_category, seat.status, isSelected)}
                            ${isBooked ? 'cursor-not-allowed' : 'hover:shadow-sm'}
                            ${isSelected ? 'ring-1 ring-offset-1 ring-blue-500' : ''}
                          `}
                          disabled={isBooked}
                        >
                          <span className="text-xs font-medium">{seat.seat_number}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

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
        {['VIP', 'Premium', 'Standard', 'Economy', 'Selected', 'Booked'].map((label) => (
          <div key={label} className="flex items-center px-3 py-1 bg-white rounded-full shadow-xs border">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              label === 'Selected' ? 'bg-green-600' :
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
          <h3 className="text-xl font-bold mb-4 text-gray-800">Your Selection</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {selectedSeats.map(seatNo => {
              const seat = seats.find(s => s.seat_number === seatNo);
              return (
                <div key={seatNo} className="bg-gray-50 p-3 rounded-lg border flex justify-between items-center">
                  <div>
                    <span className="font-medium">Seat {seatNo}</span>
                    <span className="text-sm text-gray-600 ml-2 capitalize">({seat?.seat_category || 'Standard'})</span>
                  </div>
                  <span className="font-bold">${seat?.price?.toFixed(2) || '0.00'}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold text-blue-600">
              ${calculateTotalAmount().toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {selectedSeats.length > 0 && (
        <div className="text-center">
          <button
            onClick={handlePayNow}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
            text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all 
            duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:ring-offset-2"
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketBookingPage;

// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useUser } from '../User/UserContext/UserContext';
// import Cookies from 'js-cookie';


// const TicketBookingPage = () => {
//   const userEmail = Cookies.get("id");
//   const { show_id } = useParams();
//   const navigate = useNavigate();
//   const { seats, selectedSeats, setSelectedSeats, fetchSeats  , createBookingAndRedirect  , selectedUserShow  , setSelectedUserShow , selectUserShow} = useUser();
  

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
//     }
//   }, [selectedUserShow]);


//   // Get user information and seat info from context
 
//   const [showPayPal, setShowPayPal] = useState(false);

//   useEffect(() => {
//     fetchSeats(show_id);  // Fetch available seats when the page loads
//   }, [show_id , fetchSeats]);

//   const handleSelectSeat = (seat) => {
//     if (selectedSeats.includes(seat)) {
//       setSelectedSeats(selectedSeats.filter(s => s !== seat)); // Deselect
//     } else {
//       setSelectedSeats([...selectedSeats, seat]); // Select
//     }
//   };

//   const calculateTotalAmount = () => {
//     return selectedSeats.reduce((total, seatNo) => {
//       const seat = seats.find(s => s.seat_number === seatNo);
//       return total + (seat ? seat.price : 0);
//     }, 0);
//   };

//   const handlePayNow = () => {
//     if (selectedSeats.length === 0) {
//       alert('Please select at least one seat.');
//       return;
//     }

//     const totalAmount = calculateTotalAmount();
    
//     createBookingAndRedirect({
//       userEmail,
//       showId: show_id,
//       selectedSeats: selectedSeats.map(seatNo => ({
//         seat_number: seatNo,
//         seat_id: seats.find(s => s.seat_number === seatNo).seat_id,
//         price: seats.find(s => s.seat_number === seatNo).price
//       })),
//       totalAmount,
//     });
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto my-12">
//       <h1 className="text-3xl font-bold mb-6 text-center">🎟️ Book Your Ticket</h1>

//       {/* Seat Layout */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-8">
//         {seats.map(seat => {
//           const isSelected = selectedSeats.includes(seat.seat_number);
//           const isBooked = seat.status === 'booked';

//           return (
//             <div
//               key={seat.seat_number}
//               onClick={() => !isBooked && handleSelectSeat(seat.seat_number)}
//               className={`
//                 p-3 rounded-xl shadow-md border text-center cursor-pointer transition-all duration-200
//                 ${isBooked ? 'bg-red-300 text-white cursor-not-allowed' :
//                   isSelected ? 'bg-green-500 text-white' :
//                   'bg-gray-100 hover:bg-blue-100'}
//               `}
//             >
//               <div className="font-bold text-lg">{seat.seat_number}</div>
//               <div className="text-sm text-gray-700">{seat.seat_category}</div>
//               <div className="text-sm text-gray-600">${seat.price}</div>
//               <div className={`text-xs mt-1 ${isBooked ? 'text-red-800' : 'text-green-800'}`}>
//                 {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Pay Now Button */}
//       {selectedSeats.length > 0 && !showPayPal && (
//         <div className="text-center">
//           <button
//             onClick={handlePayNow}
//             className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-lg"
//           >
//             Pay Now
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TicketBookingPage;
