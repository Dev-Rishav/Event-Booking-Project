import React, { useEffect } from "react";
import { useEvent } from "../EventContext/EventContext";
import EventFilter from "./EventFilter";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const EventList = () => {
  const id = Cookies.get("id");
  const { events, loading, error, fetchEvents , selectEvent } = useEvent();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents(id);
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Event List</h2>

      {/* Filter Component */}
      <EventFilter />

      {/* Events Table */}
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Event Name</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event, index) => (
              <tr key={event._id || index} className="text-center">
                <td className="border border-gray-300 p-2">{event.title}</td>
                <td className="border border-gray-300 p-2">{event.category}</td>
                <td className="border border-gray-300 p-2">{event.created_at}</td>
                <td className="border border-gray-300 p-2">
                <button onClick={() => {
                     selectEvent(event);
                     navigate("/organizer/events/event-details");
                     }}
                     className="bg-green-500 text-white px-6 py-1 rounded hover:bg-green-700">
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No events available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => {
                     navigate("/organizer/events/create-event");
                     }}
                     className="bg-blue-500 my-8 ml-100 text-white px-10 py-2 rounded hover:bg-green-700">
                    Create Event
                  </button>

    </div>
  );
};

export default EventList;

