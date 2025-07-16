import React, { useState, useEffect } from "react";
import { useEvent } from "../EventContext/EventContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const EventList = () => {
  const id = Cookies.get("id");
  const {
    events,
    loading,
    error,
    fetchEvents,
    selectEvent
  } = useEvent();

  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents(id);
  }, []);

  const handleResetFilters = () => {
    setCategory("");
    setCity("");
  };

  const filteredEvents = events.filter((event) => {
    return (
      (category ? event.category === category : true)
    );
  });

  return (
    <div className="p-6 my-10 max-w-6xl mx-auto bg-[#F1EFEC] rounded-xl shadow border border-[#D4C9BE]">
      <h2 className="text-3xl font-bold text-[#123458] mb-6 text-center">Event List</h2>

      {/* Filter UI */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select
          className="p-2 border border-gray-300 rounded"
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
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Reset Filters
        </button>
      </div>

      {/* Event Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#D4C9BE] text-[#030303]">
              <th className="border border-[#D4C9BE] px-4 py-2">Event Name</th>
              <th className="border border-[#D4C9BE] px-4 py-2">Category</th>
              <th className="border border-[#D4C9BE] px-4 py-2">Created At</th>
              <th className="border border-[#D4C9BE] px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-[#123458]">
                  Loading events...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <tr key={event._id || index} className="text-center even:bg-white odd:bg-[#f9f6f3]">
                  <td className="border border-[#D4C9BE] px-4 py-2">{event.title}</td>
                  <td className="border border-[#D4C9BE] px-4 py-2">{event.category}</td>
                  <td className="border border-[#D4C9BE] px-4 py-2">{event.created_at}</td>
                  <td className="border border-[#D4C9BE] px-4 py-2">
                    <button
                      onClick={() => {
                        selectEvent(event);
                        navigate("/organizer/events/event-details");
                      }}
                      className="bg-[#123458] text-white px-5 py-1 rounded hover:bg-[#0f2e4a] transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-600">
                  No events available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-right mt-8">
        <button
          onClick={() => navigate("/organizer/events/create-event")}
          className="bg-[#123458] text-white px-8 py-2 rounded-lg hover:bg-[#0f2e4a] transition"
        >
          Create Event
        </button>
      </div>
    </div>
  );
};

export default EventList;
