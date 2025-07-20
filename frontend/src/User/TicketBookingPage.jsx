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
      setTimeLeft(300);
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
    if (status === "booked") return "bg-red-400 text-white";
    if (isSelected)
      return holdTimer ? "bg-indigo-600 text-white" : "bg-green-600 text-white";
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
      <div className="stage-area bg-red-700 h-16 mb-8 rounded-lg flex items-center justify-center shadow-lg">
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
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl text-[10px] sm:text-xs font-medium border-2 p-1 flex flex-col justify-between items-center ${getSeatColor(
                seat.seat_category,
                seat.status,
                selectedSeats.includes(seat.seat_number)
              )} ${
                seat.status === "booked"
                  ? "cursor-not-allowed"
                  : "hover:shadow-md"
              } ${
                selectedSeats.includes(seat.seat_number)
                  ? "ring-2 ring-offset-2 ring-blue-500"
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
                <div
                  className={`font-semibold ${
                    seat.status === "booked" ? "text-red-200" : "text-white"
                  }`}
                >
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
            <h3 className="text-center text-xl font-bold mb-4">
              {sectionName}
            </h3>
            {Object.entries(rows)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([rowLabel, rowSeats]) => (
                <div key={rowLabel} className="mb-2 flex items-center gap-2">
                  <span className="w-6 font-bold">{rowLabel}</span>
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
                            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl text-[10px] sm:text-xs font-medium border-2 p-1 flex flex-col justify-between items-center ${getSeatColor(
                              seat.seat_category,
                              seat.status,
                              selectedSeats.includes(seat.seat_number)
                            )} ${
                              seat.status === "booked"
                                ? "cursor-not-allowed"
                                : "hover:shadow-md"
                            } ${
                              selectedSeats.includes(seat.seat_number)
                                ? "ring-2 ring-offset-2 ring-blue-500"
                                : ""
                            }`}
                            disabled={seat.status === "booked" || isHolding}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{
                              scale: seat.status === "booked" ? 1 : 1.05,
                            }}
                          >
                            <div className="font-bold">{seat.seat_number}</div>
                            <div className="text-[10px] leading-tight text-center">
                              <div>${seat.price}</div>
                              <div>{seat.seat_category}</div>
                              <div
                                className={`font-semibold ${
                                  seat.status === "booked"
                                    ? "text-red-200"
                                    : "text-white"
                                }`}
                              >
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
            <h3 className="text-center text-xl font-bold mb-4">
              {sectionName}
            </h3>
            {Object.entries(rows)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([rowLabel, rowSeats]) => (
                <div key={rowLabel} className="mb-2 flex items-center gap-2">
                  <span className="w-6 font-bold">{rowLabel}</span>
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
                            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl text-[10px] sm:text-xs font-medium border-2 p-1 flex flex-col justify-between items-center ${getSeatColor(
                              seat.seat_category,
                              seat.status,
                              selectedSeats.includes(seat.seat_number)
                            )} ${
                              seat.status === "booked"
                                ? "cursor-not-allowed"
                                : "hover:shadow-md"
                            } ${
                              selectedSeats.includes(seat.seat_number)
                                ? "ring-2 ring-offset-2 ring-blue-500"
                                : ""
                            }`}
                            disabled={seat.status === "booked" || isHolding}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{
                              scale: seat.status === "booked" ? 1 : 1.05,
                            }}
                          >
                            <div className="font-bold">{seat.seat_number}</div>
                            <div className="text-[10px] leading-tight text-center">
                              <div>${seat.price}</div>
                              <div>{seat.seat_category}</div>
                              <div
                                className={`font-semibold ${
                                  seat.status === "booked"
                                    ? "text-red-200"
                                    : "text-white"
                                }`}
                              >
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
        <div className="screen-area bg-black h-14 mb-6 rounded-lg text-white flex items-center justify-center shadow-lg">
          <span className="font-semibold text-lg">SCREEN</span>
        </div>
        <div className="space-y-8">
          {Object.entries(seatsBySection).map(([sectionName, rows]) => (
            <div key={sectionName}>
              <h3 className="text-center text-xl font-bold mb-4">
                {sectionName}
              </h3>
              {Object.entries(rows)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([rowLabel, rowSeats]) => (
                  <div key={rowLabel} className="mb-2 flex items-center gap-2">
                    <span className="w-6 font-bold">{rowLabel}</span>
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
                              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl text-[10px] sm:text-xs font-medium border-2 p-1 flex flex-col justify-between items-center ${getSeatColor(
                                seat.seat_category,
                                seat.status,
                                selectedSeats.includes(seat.seat_number)
                              )} ${
                                seat.status === "booked"
                                  ? "cursor-not-allowed"
                                  : "hover:shadow-md"
                              } ${
                                selectedSeats.includes(seat.seat_number)
                                  ? "ring-2 ring-offset-2 ring-blue-500"
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
                              <div className="text-[10px] leading-tight text-center">
                                <div>${seat.price}</div>
                                <div>{seat.seat_category}</div>
                                <div
                                  className={`font-semibold ${
                                    seat.status === "booked"
                                      ? "text-red-200"
                                      : "text-white"
                                  }`}
                                >
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
      return <div className="text-center py-12">Loading seat map...</div>;
    if (!seats.length)
      return (
        <div className="text-center py-12">
          No seats available for this event
        </div>
      );

    switch (venueType) {
      case "stadium":
        return renderStadiumLayout();
      case "open_air":
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
      className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-7xl mx-auto my-8"
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        🎟️ Book Your Tickets
      </h1>

      <div className="text-center mb-6">
        <span className="inline-block bg-white dark:bg-gray-800 rounded-full px-4 py-2 text-sm font-semibold capitalize shadow-sm">
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
            className="flex items-center px-3 py-1 bg-white dark:bg-gray-800 rounded-full shadow-xs border"
          >
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                label === "Selected"
                  ? "bg-green-600"
                  : label === "Held"
                  ? "bg-indigo-600"
                  : label === "Booked"
                  ? "bg-red-400"
                  : label === "VIP"
                  ? "bg-purple-600"
                  : label === "Premium"
                  ? "bg-blue-600"
                  : label === "Standard"
                  ? "bg-yellow-500"
                  : "bg-gray-600"
              }`}
            ></div>
            <span className="text-xs sm:text-sm">{label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 sm:p-6 mb-8">
        {renderSeatLayout()}
      </div>

      {selectedSeats.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 sm:p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Your Tickets</h3>
          <div className="flex overflow-x-auto pb-4 gap-4">
            {selectedSeats.map((seatNo) => {
              const seat = seats.find((s) => s.seat_number === seatNo);
              return (
                <div
                  key={seatNo}
                  className="flex-shrink-0 w-48 h-32 bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 border rounded-lg p-4 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs">Seat</p>
                      <p className="font-bold text-lg">{seatNo}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                      {seat?.seat_category || "Standard"}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs">Price</p>
                      <p className="font-bold text-blue-600">
                        ${seat?.price?.toFixed(2) || "0.00"}
                      </p>
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
        </div>
      )}

      {selectedSeats.length > 0 && (
        <div className="text-center space-x-4">
          {!holdTimer ? (
            <button
              onClick={holdSeats}
              disabled={isHolding}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-200"
            >
              {isHolding ? "Processing..." : "Hold Seats (5 mins)"}
            </button>
          ) : (
            <>
              <button
                onClick={handlePayNow}
                disabled={isHolding}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-200"
              >
                {isHolding ? "Processing..." : "Confirm & Pay Now"}
              </button>
              <button
                onClick={clearHold}
                disabled={isHolding}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-200"
              >
                Cancel Hold
              </button>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default TicketBookingPage;
