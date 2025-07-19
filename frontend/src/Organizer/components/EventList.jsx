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
    <div className="p-6 my-10 mt-16 max-w-6xl mx-auto rounded-xl shadow-md border bg-white/80 dark:bg-[#0f172a]/60 border-gray-200 dark:border-gray-700 backdrop-blur-md">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
       All Event
      </h2>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select
          className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
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
          className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition"
        >
          Reset Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <th className="border px-4 py-2">Event Name</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Created At</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-700 dark:text-gray-300">
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
                      className="text-center even:bg-white dark:even:bg-gray-900 odd:bg-gray-50 dark:odd:bg-gray-800"
                    >
                      <td className="border px-4 py-2">{event.title}</td>
                      <td className="border px-4 py-2">{event.category}</td>
                      <td className="border px-4 py-2">{event.created_at}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => {
                            selectEvent(event);
                            navigate("/organizer/events/event-details");
                          }}
                          className="bg-blue-600 text-white px-5 py-1 rounded hover:bg-blue-700 transition"
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
                    <td colSpan="4" className="text-center py-6 text-gray-600 dark:text-gray-400">
                      No events available
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-right mt-8">
        <button
          onClick={() => navigate("/organizer/events/create-event")}
          className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Create Event
        </button>
      </div>
    </div>
  );
};

export default EventList;

