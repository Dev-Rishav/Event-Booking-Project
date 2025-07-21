import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../User/UserContext/UserContext";
import Cookies from "js-cookie";
import axios from "axios";
import { motion } from "framer-motion";

const TicketBookingPage = () => {
  const userId = Cookies.get("id");
  const { show_id } = useParams();

  const {
    seats,
    selectedSeats,
    setSelectedSeats,
    fetchSeats,
    createBookingAndRedirect,
    selectedUserShow,
    setSelectedUserShow,
  } = useUser();

  const [venueType, setVenueType] = useState("theatre");
  const [loading, setLoading] = useState(true);
  const [holdTimer, setHoldTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isHolding, setIsHolding] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    if (!selectedUserShow) {
      const savedEvent = localStorage.getItem("selectedUserShow");
      if (savedEvent) setSelectedUserShow(JSON.parse(savedEvent));
    }
  }, []);

  useEffect(() => {
    if (selectedUserShow) {
      localStorage.setItem(
        "selectedUserShow",
        JSON.stringify(selectedUserShow)
      );
      if (selectedUserShow.seating_plan === "stadium") setVenueType("stadium");
      else if (selectedUserShow.seating_plan === "oper_air")
        setVenueType("oper_air");
      else if (selectedUserShow.seating_plan === "cinema")
        setVenueType("cinema");
      else if (selectedUserShow.seating_plan === "theatre")
        setVenueType("theatre");
      else setVenueType("theatre");
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

  useEffect(() => {
    if (holdTimer && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) clearHold();
  }, [timeLeft, holdTimer]);

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  const handleSelectSeat = (seatNumber) => {
    if (isHolding) {
      alert("Complete or cancel your current booking first.");
      return;
    }
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const holdSeats = async () => {
    if (!selectedSeats.length) return alert("Please select at least one seat.");
    try {
      setIsHolding(true);
      await axios.post("http://localhost:8001/api/booking/hold", {
        show_id,
        seats: selectedSeats,
        userId,
      });
      setHoldTimer(true);
      setTimeLeft(300);
    } catch (err) {
      setBookingError(err.response?.data?.message || "Failed to hold seats");
    } finally {
      setIsHolding(false);
    }
  };

  const clearHold = async () => {
    try {
      await axios.post("http://localhost:8001/api/booking/cancel/hold", {
        show_id,
        seats: selectedSeats,
        userId,
      });
      setHoldTimer(null);
      setTimeLeft(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayNow = () => {
    if (!holdTimer) return alert("Hold your seats first.");
    createBookingAndRedirect({
      userId,
      showId: show_id,
      selectedSeats: selectedSeats.map((seatNo) => {
        const seat = seats.find((s) => s.seat_number === seatNo);
        return {
          seat_number: seatNo,
          seat_id: seat?.seat_id,
          price: seat?.price,
        };
      }),
      totalAmount: calculateTotalAmount(),
    });
    clearHold();
    setSelectedSeats([]);
  };

  const calculateTotalAmount = () =>
    selectedSeats.reduce((total, seatNo) => {
      const seat = seats.find((s) => s.seat_number === seatNo);
      return total + (seat?.price || 0);
    }, 0);

  const getSeatColor = (category, status, isSelected) => {
    if (status === "booked") return "bg-gray-300 text-gray-600 cursor-not-allowed";
    if (isSelected)
      return holdTimer ? "bg-indigo-600 text-white" : "bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white";
    const colors = {
      vip: "bg-purple-600 hover:bg-purple-700 text-white",
      premium: "bg-blue-600 hover:bg-blue-700 text-white",
      standard: "bg-yellow-500 hover:bg-yellow-600 text-gray-900",
      economy: "bg-gray-600 hover:bg-gray-700 text-white",
    };
    return (
      colors[(category || "").toLowerCase()] ||
      "bg-gray-300 hover:bg-gray-400 text-gray-800"
    );
  };

  const renderTheatreLayout = () => (
    <div>
      <div className="stage-area bg-gradient-to-r from-[#f40752] to-[#f9ab8f] h-16 mb-8 rounded-lg flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-xl">STAGE</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.seat_number);
          return (
            <motion.button
              key={seat.seat_id}
              onClick={() =>
                seat.status !== "booked" && handleSelectSeat(seat.seat_number)
              }
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg text-xs font-medium border border-gray-200 p-1 flex flex-col justify-between items-center ${getSeatColor(
                seat.seat_category,
                seat.status,
                isSelected
              )} ${
                seat.status === "booked"
                  ? "cursor-not-allowed"
                  : "hover:shadow-md"
              } ${
                isSelected
                  ? "ring-2 ring-offset-2 ring-pink-500"
                  : ""
              }`}
              disabled={seat.status === "booked" || isHolding}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: seat.status === "booked" ? 1 : 1.05 }}
            >
              <div className="font-bold">{seat.seat_number}</div>
              <div className="text-[10px] leading-tight text-center">
                <div>${seat.price}</div>
                <div>{seat.seat_category}</div>
                <div className={`text-[8px] font-semibold ${
                  seat.status === "booked" ? "text-red-100" : "text-white"
                }`}>
                  {seat.status}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  const renderStadiumLayout = () => {
    const seatsBySection = {};

    seats.forEach((seat) => {
      const sectionName = seat.section || "General";
      if (!seatsBySection[sectionName]) seatsBySection[sectionName] = {};
      const row = seat.row;
      if (!seatsBySection[sectionName][row])
        seatsBySection[sectionName][row] = [];
      seatsBySection[sectionName][row].push(seat);
    });

    return (
      <div className="space-y-10">
        {Object.entries(seatsBySection).map(([sectionName, rows]) => (
          <div key={sectionName}>
            <h3 className="text-center text-xl font-bold mb-4 text-gray-800">
              {sectionName}
            </h3>
            {Object.entries(rows)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([rowLabel, rowSeats]) => (
                <div key={rowLabel} className="mb-2 flex items-center gap-2">
                  <span className="w-6 font-bold text-gray-700">{rowLabel}</span>
                  <div className="grid grid-cols-12 gap-2 flex-grow">
                    {rowSeats
                      .sort((a, b) =>
                        a.seat_number.localeCompare(b.seat_number)
                      )
                      .map((seat) => {
                        const isSelected = selectedSeats.includes(
                          seat.seat_number
                        );
                        return (
                          <motion.button
                            key={seat.seat_id}
                            onClick={() =>
                              seat.status !== "booked" &&
                              handleSelectSeat(seat.seat_number)
                            }
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg text-[8px] sm:text-xs font-medium border border-gray-200 p-1 flex flex-col justify-between items-center ${getSeatColor(
                              seat.seat_category,
                              seat.status,
                              isSelected
                            )} ${
                              seat.status === "booked"
                                ? "cursor-not-allowed"
                                : "hover:shadow-md"
                            } ${
                              isSelected
                                ? "ring-2 ring-offset-2 ring-pink-500"
                                : ""
                            }`}
                            disabled={seat.status === "booked" || isHolding}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{
                              scale: seat.status === "booked" ? 1 : 1.05,
                            }}
                          >
                            <div className="font-bold">{seat.seat_number}</div>
                            <div className="text-[8px] leading-tight text-center">
                              <div>${seat.price}</div>
                              <div>{seat.seat_category}</div>
                              <div className={`text-[7px] font-semibold ${
                                seat.status === "booked" ? "text-red-100" : "text-white"
                              }`}>
                                {seat.status}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  };

  const renderOpenAirLayout = () => {
    const seatsBySection = {};

    seats.forEach((seat) => {
      const sectionName = seat.section || "General";
      if (!seatsBySection[sectionName]) seatsBySection[sectionName] = {};
      const row = seat.row;
      if (!seatsBySection[sectionName][row])
        seatsBySection[sectionName][row] = [];
      seatsBySection[sectionName][row].push(seat);
    });

    return (
      <div className="space-y-10">
        {Object.entries(seatsBySection).map(([sectionName, rows]) => (
          <div key={sectionName}>
            <h3 className="text-center text-xl font-bold mb-4 text-gray-800">
              {sectionName}
            </h3>
            {Object.entries(rows)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([rowLabel, rowSeats]) => (
                <div key={rowLabel} className="mb-2 flex items-center gap-2">
                  <span className="w-6 font-bold text-gray-700">{rowLabel}</span>
                  <div className="grid grid-cols-10 gap-2 flex-grow">
                    {rowSeats
                      .sort((a, b) =>
                        a.seat_number.localeCompare(b.seat_number)
                      )
                      .map((seat) => {
                        const isSelected = selectedSeats.includes(
                          seat.seat_number
                        );
                        return (
                          <motion.button
                            key={seat.seat_id}
                            onClick={() =>
                              seat.status !== "booked" &&
                              handleSelectSeat(seat.seat_number)
                            }
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg text-[8px] sm:text-xs font-medium border border-gray-200 p-1 flex flex-col justify-between items-center ${getSeatColor(
                              seat.seat_category,
                              seat.status,
                              isSelected
                            )} ${
                              seat.status === "booked"
                                ? "cursor-not-allowed"
                                : "hover:shadow-md"
                            } ${
                              isSelected
                                ? "ring-2 ring-offset-2 ring-pink-500"
                                : ""
                            }`}
                            disabled={seat.status === "booked" || isHolding}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{
                              scale: seat.status === "booked" ? 1 : 1.05,
                            }}
                          >
                            <div className="font-bold">{seat.seat_number}</div>
                            <div className="text-[8px] leading-tight text-center">
                              <div>${seat.price}</div>
                              <div>{seat.seat_category}</div>
                              <div className={`text-[7px] font-semibold ${
                                seat.status === "booked" ? "text-red-100" : "text-white"
                              }`}>
                                {seat.status}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  };

  const renderCinemaLayout = () => {
    const seatsBySection = {};

    seats.forEach((seat) => {
      const sectionName = seat.section || "General";
      if (!seatsBySection[sectionName]) seatsBySection[sectionName] = {};
      const row = seat.row;
      if (!seatsBySection[sectionName][row])
        seatsBySection[sectionName][row] = [];
      seatsBySection[sectionName][row].push(seat);
    });

    return (
      <div>
        <div className="screen-area bg-gradient-to-r from-[#f40752] to-[#f9ab8f] h-14 mb-6 rounded-lg text-white flex items-center justify-center shadow-lg">
          <span className="font-semibold text-lg">SCREEN</span>
        </div>
        <div className="space-y-8">
          {Object.entries(seatsBySection).map(([sectionName, rows]) => (
            <div key={sectionName}>
              <h3 className="text-center text-xl font-bold mb-4 text-gray-800">
                {sectionName}
              </h3>
              {Object.entries(rows)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([rowLabel, rowSeats]) => (
                  <div key={rowLabel} className="mb-2 flex items-center gap-2">
                    <span className="w-6 font-bold text-gray-700">{rowLabel}</span>
                    <div className="grid grid-cols-10 gap-2 flex-grow">
                      {rowSeats
                        .sort((a, b) =>
                          a.seat_number.localeCompare(b.seat_number)
                        )
                        .map((seat) => {
                          const isSelected = selectedSeats.includes(
                            seat.seat_number
                          );
                          return (
                            <motion.button
                              key={seat.seat_id}
                              onClick={() =>
                                seat.status !== "booked" &&
                                handleSelectSeat(seat.seat_number)
                              }
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg text-[8px] sm:text-xs font-medium border border-gray-200 p-1 flex flex-col justify-between items-center ${getSeatColor(
                                seat.seat_category,
                                seat.status,
                                isSelected
                              )} ${
                                seat.status === "booked"
                                  ? "cursor-not-allowed"
                                  : "hover:shadow-md"
                              } ${
                                isSelected
                                  ? "ring-2 ring-offset-2 ring-pink-500"
                                  : ""
                              }`}
                              disabled={seat.status === "booked" || isHolding}
                              whileTap={{ scale: 0.9 }}
                              whileHover={{
                                scale: seat.status === "booked" ? 1 : 1.05,
                              }}
                            >
                              <div className="font-bold">
                                {seat.seat_number}
                              </div>
                              <div className="text-[8px] leading-tight text-center">
                                <div>${seat.price}</div>
                                <div>{seat.seat_category}</div>
                                <div className={`text-[7px] font-semibold ${
                                  seat.status === "booked" ? "text-red-100" : "text-white"
                                }`}>
                                  {seat.status}
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSeatLayout = () => {
    if (loading)
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seat map...</p>
        </div>
      );
    if (!seats.length)
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">No seats available for this event</p>
        </div>
      );

    switch (venueType) {
      case "stadium":
        return renderStadiumLayout();
      case "oper_air":
        return renderOpenAirLayout();
      case "cinema":
        return renderCinemaLayout();
      case "theatre":
      default:
        return renderTheatreLayout();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] rounded-xl p-6 mb-8 text-white shadow-lg"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          🎟️ Book Your Tickets
        </h1>
        {selectedUserShow && (
          <p className="text-center mt-2 opacity-90">
            {selectedUserShow.venue_name} • {selectedUserShow.show_date}
          </p>
        )}
      </motion.div>

      <div className="text-center mb-6">
        <span className="inline-block bg-white rounded-full px-4 py-2 text-sm font-semibold capitalize shadow-sm border border-gray-200">
          {venueType} seating
        </span>
      </div>

      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {[
          "VIP",
          "Premium",
          "Standard",
          "Economy",
          "Selected",
          "Held",
          "Booked",
        ].map((label) => (
          <div
            key={label}
            className="flex items-center px-3 py-1 bg-white rounded-full shadow-xs border border-gray-200"
          >
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                label === "Selected"
                  ? "bg-gradient-to-r from-[#f40752] to-[#f9ab8f]"
                  : label === "Held"
                  ? "bg-indigo-600"
                  : label === "Booked"
                  ? "bg-gray-300"
                  : label === "VIP"
                  ? "bg-purple-600"
                  : label === "Premium"
                  ? "bg-blue-600"
                  : label === "Standard"
                  ? "bg-yellow-500"
                  : "bg-gray-600"
              }`}
            ></div>
            <span className="text-xs sm:text-sm text-gray-700">{label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8 border border-gray-100">
        {renderSeatLayout()}
      </div>

      {selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8 border border-gray-100"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">Your Tickets</h3>
          <div className="flex overflow-x-auto pb-4 gap-4">
            {selectedSeats.map((seatNo) => {
              const seat = seats.find((s) => s.seat_number === seatNo);
              return (
                <div
                  key={seatNo}
                  className="flex-shrink-0 w-48 h-32 bg-gradient-to-br from-gray-50 to-white border rounded-lg p-4 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500">Seat</p>
                      <p className="font-bold text-lg text-gray-800">{seatNo}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-700">
                      {seat?.seat_category || "Standard"}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-bold text-pink-600">
                        ${seat?.price?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {seat?.status || "selected"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <span className="text-xl font-bold text-pink-600">
              ${calculateTotalAmount().toFixed(2)}
            </span>
          </div>
        </motion.div>
      )}

      {selectedSeats.length > 0 && (
        <div className="text-center space-x-4">
          {!holdTimer ? (
            <motion.button
              onClick={holdSeats}
              disabled={isHolding}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] hover:shadow-lg text-white px-8 py-3 rounded-full text-lg font-bold shadow-md transition-all"
            >
              {isHolding ? "Processing..." : "Hold Seats (5 mins)"}
            </motion.button>
          ) : (
            <>
              <motion.button
                onClick={handlePayNow}
                disabled={isHolding}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] hover:shadow-lg text-white px-8 py-3 rounded-full text-lg font-bold shadow-md transition-all"
              >
                {isHolding ? "Processing..." : "Confirm & Pay Now"}
              </motion.button>
              <motion.button
                onClick={clearHold}
                disabled={isHolding}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full text-lg font-bold shadow-md transition-all"
              >
                Cancel Hold
              </motion.button>
            </>
          )}
        </div>
      )}

      {bookingError && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {bookingError}
        </div>
      )}

      {holdTimer && (
        <div className="mt-4 text-center text-gray-700">
          <p>Your seats are held for: <span className="font-bold">{formatTime(timeLeft)}</span></p>
          <p className="text-sm text-gray-500">Complete your booking before time runs out</p>
        </div>
      )}
    </motion.div>
  );
};

export default TicketBookingPage;