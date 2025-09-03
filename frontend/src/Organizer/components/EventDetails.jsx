import React, { useEffect, useState } from "react";
import { useEvent } from "../EventContext/EventContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS } from "../../config/api.js";

const EventDetails = () => {
  const { selectedEvent, setSelectedEvent, shows, fetchShows } = useEvent();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        API_ENDPOINTS.REVIEWS.GET(selectedEvent.event_id)
      );
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedEvent) {
      const savedEvent = localStorage.getItem("selectedEvent");
      if (savedEvent) {
        setSelectedEvent(JSON.parse(savedEvent));
      }
    }
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchShows(selectedEvent.event_id);
      fetchReviews();
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedEvent) {
      localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));
    }
  }, [selectedEvent]);

  if (!selectedEvent)
    return <p className="text-center text-red-500">No event selected</p>;

  return (
    <div className="p-4 md:p-6 my-10 mt-16 max-w-5xl mx-auto">
      {/* Event Card */}
      <motion.div
        layout
        className="bg-white/80 rounded-xl shadow-xl border border-white/30 mb-8 overflow-hidden backdrop-blur-md"
      >
        {/* Event Image */}
        <div className="w-full aspect-video overflow-hidden">
          <img
            src={selectedEvent.image || "https://via.placeholder.com/800x400?text=No+Image"}
            alt={selectedEvent.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Event Info */}
        <div className="p-4 md:p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            {selectedEvent.title}
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-semibold">Category:</span> {selectedEvent.category}
            </p>
            <p>
              <span className="font-semibold">Duration:</span> {selectedEvent.duration} minutes
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(selectedEvent.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {selectedEvent.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Back
            </button>
            <button
              onClick={() =>
                navigate(`/organizer/events/create-show/${selectedEvent.event_id}`)
              }
              className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Create New Show
            </button>
          </div>
        </div>
      </motion.div>

      {/* Show List */}
      <motion.div
        layout
        className="bg-white/80 rounded-xl shadow-xl p-4 md:p-6 border border-white/30 mb-8 backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Show List
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white">
                <th className="p-2 md:p-3 border text-sm md:text-base">City</th>
                <th className="p-2 md:p-3 border text-sm md:text-base">Seats</th>
                <th className="p-2 md:p-3 border text-sm md:text-base">Date</th>
                <th className="p-2 md:p-3 border text-sm md:text-base">Starts</th>
                <th className="p-2 md:p-3 border text-sm md:text-base">Ends</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {shows.length > 0 ? (
                  shows.map((show, index) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ type: "spring", stiffness: 70, damping: 20 }}
                      key={show._id || index}
                      className="text-center even:bg-white odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="p-2 md:p-3 border text-sm md:text-base">{show.venue_name}</td>
                      <td className="p-2 md:p-3 border text-sm md:text-base">{show.total_seats}</td>
                      <td className="p-2 md:p-3 border text-sm md:text-base">
                        {new Date(show.show_date).toLocaleDateString()}
                      </td>
                      <td className="p-2 md:p-3 border text-sm md:text-base">{show.start_time}</td>
                      <td className="p-2 md:p-3 border text-sm md:text-base">{show.end_time}</td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr layout>
                    <td colSpan="5" className="text-center p-4 text-gray-600">
                      No shows created.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Reviews */}
      <motion.div
        layout
        className="bg-white/80 rounded-xl shadow-xl p-4 md:p-6 border border-white/30 backdrop-blur-md"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          All Reviews
        </h3>

        {loading ? (
          <p className="text-gray-600">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {reviews.map((r, index) => (
                <motion.li
                  layout
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border rounded-lg py-3 px-4 bg-white hover:bg-gray-50 transition"
                >
                  <p className="text-gray-800 mb-1">{r.review_text}</p>
                  <p className="text-sm text-gray-600">
                    — {r.user_id},{" "}
                    <span className="ml-1 text-xs text-gray-500">
                      {new Date(r.review_date).toLocaleString()}
                    </span>
                  </p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default EventDetails;