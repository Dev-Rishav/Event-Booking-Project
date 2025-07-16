import React, { useEffect, useState } from "react";
import { useEvent } from "../EventContext/EventContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      <div className="bg-[#F1EFEC] p-6 rounded-xl shadow border border-[#D4C9BE] mb-8">
        <h2 className="text-3xl font-bold text-[#123458] mb-4">
          {selectedEvent.title}
        </h2>
        <div className="space-y-2 text-[#030303]">
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
            className="bg-[#D4C9BE] text-[#030303] px-4 py-2 rounded-lg hover:bg-[#c2b6ab] transition"
          >
            Back
          </button>
          <button
            onClick={() =>
              navigate(`/organizer/events/create-show/${selectedEvent.event_id}`)
            }
            className="bg-[#123458] text-white px-4 py-2 rounded-lg hover:bg-[#0f2e4a] transition"
          >
            Create New Show
          </button>
        </div>
      </div>

      <div className="bg-[#F1EFEC] rounded-xl shadow p-6 border border-[#D4C9BE] mb-10">
        <h2 className="text-2xl font-bold text-[#123458] mb-4">Show List</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#D4C9BE] text-[#030303]">
              <th className="p-3 border border-[#D4C9BE]">City</th>
              <th className="p-3 border border-[#D4C9BE]">Total Seats</th>
              <th className="p-3 border border-[#D4C9BE]">Date</th>
              <th className="p-3 border border-[#D4C9BE]">Starts At</th>
              <th className="p-3 border border-[#D4C9BE]">Ends At</th>
            </tr>
          </thead>
          <tbody>
            {shows.length > 0 ? (
              shows.map((show, index) => (
                <tr key={show._id || index} className="text-center">
                  <td className="p-3 border border-[#D4C9BE]">{show.venue_name}</td>
                  <td className="p-3 border border-[#D4C9BE]">{show.total_seats}</td>
                  <td className="p-3 border border-[#D4C9BE]">{show.show_date}</td>
                  <td className="p-3 border border-[#D4C9BE]">{show.start_time}</td>
                  <td className="p-3 border border-[#D4C9BE]">{show.end_time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-600">
                  No shows created.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-[#F1EFEC] rounded-xl shadow p-6 border border-[#D4C9BE]">
        <h3 className="text-xl font-bold text-[#123458] mb-4">All Reviews</h3>
        {loading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r, index) => (
              <li
                key={index}
                className="border border-[#D4C9BE] rounded-lg py-3 px-4 bg-white hover:bg-[#f7f4f0] transition"
              >
                <p className="text-[#030303] mb-1">{r.review_text}</p>
                <p className="text-sm text-gray-600">
                  — {r.user_id},{" "}
                  <span className="ml-1 text-xs text-gray-500">
                    {new Date(r.review_date).toLocaleString()}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
