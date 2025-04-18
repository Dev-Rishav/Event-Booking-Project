import { useEffect, useState } from "react";
import { useUser } from '../User/UserContext/UserContext';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ShowList = () => {
  const { userShows, selectedUserEvent, setSelectedUserEvent, fetchShowsofAnEvent  , selectUserShow , selectedUserShow } = useUser();
  const navigate = useNavigate();

  // Load selectedEvent from localStorage if it's null
  useEffect(() => {
    if (!selectedUserEvent) {
      const savedEvent = localStorage.getItem("selectedUserEvent");
      if (savedEvent) {
        setSelectedUserEvent(JSON.parse(savedEvent));
      }
    }
  }, []);

  useEffect(() => {
    if (selectedUserEvent) {
      fetchShowsofAnEvent(selectedUserEvent.event_id); // Fetch shows dynamically for the selected event
    }
  }, [selectedUserEvent]);

  // Store selectedEvent in localStorage whenever it changes
  useEffect(() => {
    if (selectedUserEvent) {
      localStorage.setItem("selectedUserEvent", JSON.stringify(selectedUserEvent));
    }
  }, [selectedUserEvent]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 mt-12 mx-8">Available Shows</h2>
      <div className="space-y-4 mt-12">
        {userShows.map(userShow => (
          <div key={userShow.show_id} className="p-4 shadow-md rounded bg-white flex justify-between items-center">
            <div>
              <p><strong>Venue:</strong> {userShow.venue_name}</p>
              <p><strong>Date:</strong> {userShow.show_date}</p>
              <p><strong>Time:</strong> {userShow.start_time} - {userShow.end_time}</p>
              <p><strong>Seats:</strong> {userShow.total_seats}</p>
            </div>
            <button
             className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => { 
                selectUserShow(userShow);
                navigate(`/user/ticket-booking/${userShow.show_id}`);
                // console.log(selectedUserShow);
              }}
            >
              Book Tickets
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowList;
