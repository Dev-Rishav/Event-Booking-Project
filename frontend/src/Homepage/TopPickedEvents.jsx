import { useState } from "react";
import EventCard from "./EventCard";
import virat from '../assets/virat.jpeg';

const events = [
  { name: "Tech Expo 2025", category: "Technology/Innovation", image: virat, likes: "120K", promoted: true },
  { name: "Music Festival", category: "Music/Live Concert", image: virat, likes: "200K" },
  { name: "Food Carnival", category: "Food/Festival", image: virat, rating: "9.5", votes: "10K" },
  { name: "Startup Summit", category: "Business/Networking", image: virat, rating: "8.9", votes: "5K" },
  { name: "Sports Championship", category: "Sports/Outdoor", image: virat, likes: "95K" },
  { name: "Art Exhibition", category: "Art/Culture", image: virat, rating: "9.2", votes: "3K" },
];

const itemsPerPage = 4;

const TopPickedEvents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const displayedEvents = events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Top Picked Events</h2>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayedEvents.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-3">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-lg font-semibold">{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TopPickedEvents;
