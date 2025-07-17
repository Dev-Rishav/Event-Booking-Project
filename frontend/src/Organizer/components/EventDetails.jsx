import React, { useEffect, useState } from "react";
import { useEvent } from "../EventContext/EventContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const EventDetails = () => {
  const { selectedEvent, setSelectedEvent, shows, fetchShows } = useEvent();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8001/api/reviews/${selectedEvent.event_id}`
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
    <div className="p-6 my-12 max-w-5xl mx-auto">
      <motion.div
        layout
        className="bg-white/80 dark:bg-[#0f172a]/60 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden backdrop-blur-md"
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
        <div className="p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {selectedEvent.title}
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
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

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Back
            </button>
            <button
              onClick={() =>
                navigate(`/organizer/events/create-show/${selectedEvent.event_id}`)
              }
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Create New Show
            </button>
          </div>
        </div>
      </motion.div>

      {/* Show List */}
      <motion.div
        layout
        className="bg-white/80 dark:bg-[#0f172a]/60 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-10 backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Show List
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <th className="p-3 border">City</th>
              <th className="p-3 border">Total Seats</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Starts At</th>
              <th className="p-3 border">Ends At</th>
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
                    className="text-center even:bg-white dark:even:bg-gray-900 odd:bg-gray-50 dark:odd:bg-gray-800"
                  >
                    <td className="p-3 border">{show.venue_name}</td>
                    <td className="p-3 border">{show.total_seats}</td>
                    <td className="p-3 border">{show.show_date}</td>
                    <td className="p-3 border">{show.start_time}</td>
                    <td className="p-3 border">{show.end_time}</td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr layout>
                  <td colSpan="5" className="text-center p-4 text-gray-600 dark:text-gray-400">
                    No shows created.
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Reviews */}
      <motion.div
        layout
        className="bg-white/80 dark:bg-[#0f172a]/60 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 backdrop-blur-md"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          All Reviews
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence>
              {reviews.map((r, index) => (
                <motion.li
                  layout
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border rounded-lg py-3 px-4 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <p className="text-gray-800 dark:text-gray-100 mb-1">{r.review_text}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    — {r.user_id},{" "}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
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
