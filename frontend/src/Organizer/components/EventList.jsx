import React, { useState, useEffect } from "react";
import { useEvent } from "../EventContext/EventContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

const EventList = () => {
  const id = Cookies.get("id");
  const { events, loading, error, fetchEvents, selectEvent } = useEvent();

  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents(id);
  }, []);

  const handleResetFilters = () => {
    setCategory("");
  };

  const filteredEvents = events.filter((event) =>
    category ? event.category === category : true
  );

  return (
    <div className="p-4 md:p-6 my-10 mt-16 max-w-6xl mx-auto rounded-xl shadow-xl border bg-white/80 border-white/30 backdrop-blur-md">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        All Events
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
        <select
          className="p-2 border border-gray-300 rounded-lg bg-white/90 focus:ring-2 focus:ring-[#f40752]/50 text-gray-800 w-full sm:w-auto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Filter by Category</option>
          <option value="Music">Music Festival</option>
          <option value="Sports">Sports</option>
          <option value="Technology">Technology</option>
          <option value="Theatre">Theatre</option>
        </select>

        <button
          onClick={handleResetFilters}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white hover:shadow-lg transition-all w-full sm:w-auto"
        >
          Reset Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white">
              <th className="border px-2 py-2 sm:px-4 sm:py-3 text-sm sm:text-base">Event Name</th>
              <th className="border px-2 py-2 sm:px-4 sm:py-3 text-sm sm:text-base">Category</th>
              <th className="border px-2 py-2 sm:px-4 sm:py-3 text-sm sm:text-base">Created At</th>
              <th className="border px-2 py-2 sm:px-4 sm:py-3 text-sm sm:text-base">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-600">
                  Loading events...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => (
                    <motion.tr
                      key={event._id || index}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ type: "spring", stiffness: 70, damping: 20 }}
                      className="text-center even:bg-white odd:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border px-2 py-2 sm:px-4 sm:py-3 text-sm sm:text-base">{event.title}</td>
                      <td className="border px-2 py-2 sm:px-4 sm:py-3 text-sm sm:text-base">{event.category}</td>
                      <td className="border px-2 py-2 sm:px-4 sm:py-3 text-sm sm:text-base">
                        {new Date(event.created_at).toLocaleDateString()}
                      </td>
                      <td className="border px-2 py-2 sm:px-4 sm:py-3 text-sm sm:text-base">
                        <button
                          onClick={() => {
                            selectEvent(event);
                            navigate("/organizer/events/event-details");
                          }}
                          className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white px-3 sm:px-5 py-1 rounded-lg hover:shadow-md transition-all"
                        >
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <td colSpan="4" className="text-center py-6 text-gray-600">
                      No events available
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-center sm:text-right mt-8">
        <button
          onClick={() => navigate("/organizer/events/create-event")}
          className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white px-6 sm:px-8 py-2 rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          Create Event
        </button>
      </div>
    </div>
  );
};

export default EventList;