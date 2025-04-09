import React, { useState , useEffect } from "react";
import { useEvent } from "../EventContext/EventContext";
import Cookies from 'js-cookie';

const EventFilter = () => {
  const id = Cookies.get("id");
  const { getEventsByCategory, getEventsByCity, fetchEvents } = useEvent();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const handleFilter = () => {
    if (category) {
      getEventsByCategory(category , id);
    } else if (city) {
      getEventsByCity(city , id);
    } else {
      fetchEvents(id); // Reset to all events
    }
  };

  // useEffect (() => {
  //       getEventsByCategory(category , id);
  //       getEventsByCity(category , id);
  //   } , []);

  return (
    <div className="flex gap-4 mb-4">
      <select
        className="p-2 border border-gray-300 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Filter by Category</option>
        <option value="Music">Music Festival</option>
        <option value="Sports">Sports</option>
        <option value="Technology">Technology</option>
      </select>

      <select
        className="p-2 border border-gray-300 rounded"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      >
        <option value="">Filter by City</option>
        <option value="New York">New York</option>
        <option value="Los Angeles">Los Angeles</option>
        <option value="Chicago">Chicago</option>
      </select>

      <button
        onClick={handleFilter}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default EventFilter;
