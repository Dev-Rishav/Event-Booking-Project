import { useState } from "react";
import MovieCard from "./MovieCard";
import virat from '../assets/virat.jpeg';

// Static JSON object containing movie data
const moviesData = [
  {
    id: 1,
    name: "L2: Empuraan",
    category: "Action/Crime/Thriller",
    image: virat,
    likes: "444.4K",
    rating: 9.3,
    votes: "325.9K",
  },
  {
    id: 2,
    name: "Sikandar",
    category: "Action/Drama",
    image: virat,
    likes: "332.3K",
    rating: 8.9,
    votes: "250.4K",
  },
  {
    id: 3,
    name: "Chhaava",
    category: "Action/Drama/Historical",
    image: virat,
    likes: "325.9K",
    rating: 9.3,
    votes: "325.9K",
  },
  {
    id: 4,
    name: "The Diplomat",
    category: "Action/Thriller",
    image: virat,
    likes: "16.6K",
    rating: 8.8,
    votes: "16.6K",
  },
  {
    id: 5,
    name: "All The Best Pandya",
    category: "Comedy/Drama",
    image: virat,
    likes: "2.9K",
    rating: 9.1,
    votes: "2.9K",
  },
];

// Pagination settings
const itemsPerPage = 4;

const RecommendedMovies = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(moviesData.length / itemsPerPage);

  // Get movies for the current page
  const displayedMovies = moviesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recommended Movies</h2>
        <a href="#" className="text-red-500 text-sm font-semibold">
          See All ›
        </a>
      </div>

      {/* Responsive Movie Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
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
        <span className="text-lg font-semibold">
          {currentPage} / {totalPages}
        </span>
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

export default RecommendedMovies;
