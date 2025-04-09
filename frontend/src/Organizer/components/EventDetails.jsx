
import React, { useEffect } from "react";
import { useEvent } from "../EventContext/EventContext";
import { useNavigate } from "react-router-dom";

const EventDetails = () => {
  const { selectedEvent, setSelectedEvent, shows, fetchShows } = useEvent();
  const navigate = useNavigate();

  // Load selectedEvent from localStorage if it's null
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
      fetchShows(selectedEvent.event_id); // Fetch shows dynamically for the selected event
    }
  }, [selectedEvent]);

  // Store selectedEvent in localStorage whenever it changes
  useEffect(() => {
    if (selectedEvent) {
      localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));
    }
  }, [selectedEvent]);

  if (!selectedEvent) return <p className="text-center text-red-500">No event selected</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
      <p><strong>Category:</strong> {selectedEvent.category}</p>
      <p><strong>Duration:</strong> {selectedEvent.duration} minutes</p>
      <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
      <p><strong>Description:</strong> {selectedEvent.description}</p>

      <div className="flex gap-4 mt-4">
  <button
    onClick={() => navigate(-1)}
    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
  >
    Back
  </button>

  <button
    onClick={() => navigate(`/organizer/events/create-show/${selectedEvent.event_id}`)}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Create New Show
  </button>
</div>


      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Show List</h2>

        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Venue</th>
              <th className="border border-gray-300 p-2">Total Seats</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Starts at</th>
              <th className="border border-gray-300 p-2">Ends at</th>
            </tr>
          </thead>
          <tbody>
            {shows.length > 0 ? (
              shows.map((show, index) => (
                <tr key={show._id || index} className="text-center">
                  <td className="border border-gray-300 p-2">{show.venue_id}</td>
                  <td className="border border-gray-300 p-2">{show.total_seats}</td>
                  <td className="border border-gray-300 p-2">{show.show_date}</td>
                  <td className="border border-gray-300 p-2">{show.start_time}</td>
                  <td className="border border-gray-300 p-2">{show.end_time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No shows created
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventDetails;
