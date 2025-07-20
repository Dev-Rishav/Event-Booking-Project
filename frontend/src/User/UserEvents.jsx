import React, { useEffect, useState } from "react";
import { useUser } from "./UserContext/UserContext";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaTags,
  FaStar,
  FaFire,
  FaClock,
  FaTimes,
} from "react-icons/fa";

const UserEvents = () => {
  const navigate = useNavigate();
  const {
    userEvents,
    recommenededEvents,
    ongoingEvents,
    upcomingEvents,
    fetchEventsByCityAndDate,
    fetchEventsByCategoryAndCityUser,
    fetchRecommendedEvents,
    fetchOngoingEvents,
    fetchUpcomingEvents,
    setCity,
    city,
    loading,
    error,
    selectUserEvent,
  } = useUser();

  const [inputCity, setInputCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    if (city) {
      fetchRecommendedEvents(city);
      fetchOngoingEvents(city);
      fetchUpcomingEvents(city);
      setIsFilterApplied(false);
      setSelectedCategory("");
      setSelectedDate("");
    }
  }, [city]);

  const handleSearch = () => {
    localStorage.setItem("city", inputCity);
    setCity(inputCity);
    setInputCity("");
  };

  const handleApplyFilters = () => {
    if (selectedCategory) {
      fetchEventsByCategoryAndCityUser(city, selectedCategory);
      setIsFilterApplied(true);
    }
    if (selectedDate) {
      fetchEventsByCityAndDate(city, selectedDate);
      setIsFilterApplied(true);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedDate("");
    setIsFilterApplied(false);
    fetchRecommendedEvents(city);
    fetchOngoingEvents(city);
    fetchUpcomingEvents(city);
  };

  const renderEventCard = (event) => (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="rounded-xl overflow-hidden shadow-lg bg-white border border-gray-100 flex flex-col transition-all hover:shadow-xl"
    >
      <div className="w-full h-52 overflow-hidden relative">
        <img
          src={event.image || "https://via.placeholder.com/400x200"}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
  
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{event.name}</h3>
  
        <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
          <span className="bg-pink-100 text-pink-700 p-1 rounded-full">
            📍
          </span>
          <span>{event.venue || event.city}</span>
        </div>
  
        <div className="text-sm text-gray-600 flex items-center gap-2 mb-3">
          <span className="bg-pink-100 text-pink-700 p-1 rounded-full">
            📅
          </span>
          <span>
            {new Date(event.event_date).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
  
        <div className="flex mt-auto gap-3">
          <button
            onClick={() => {
              selectUserEvent(event);
              navigate("/user/showlist");
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white rounded-lg hover:shadow-md transition font-medium"
          >
            Book Now
          </button>
  
          <button
            onClick={() => navigate(`/user/reviews/${event.event_id}`)}
            className="flex-1 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition font-medium"
          >
            Reviews
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-white text-gray-800 font-[DM Sans] p-4 md:p-8">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] rounded-2xl p-6 mb-8 text-white shadow-lg"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Discover Amazing Events
        </h1>
        <p className="text-lg mb-6 opacity-90">
          Find the best events happening in your city
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter city name"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-white text-pink-600 rounded-lg shadow-lg hover:bg-gray-100 transition font-semibold"
          >
            Search
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="mb-8">
        {/* Filter Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isFilterApplied ? "Filtered Events" : "Events in " + city}
          </h2>
          <div className="flex items-center space-x-3">
            {isFilterApplied && (
              <button
                onClick={clearFilters}
                className="flex items-center text-sm bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <FaTimes className="mr-1" />
                Clear Filters
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white px-4 py-2 rounded-lg hover:shadow-md transition"
            >
              <FaFilter className="mr-1" />
              {isFilterApplied ? "Modify Filters" : "Filter Events"}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-5 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-100 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaTags className="mr-2 text-pink-500" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">All Categories</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Tech">Technology</option>
                <option value="Education">Education</option>
                <option value="Food">Food & Drink</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaCalendarAlt className="mr-2 text-pink-500" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleApplyFilters}
                disabled={!selectedCategory && !selectedDate}
                className={`bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white px-4 py-2 rounded-lg hover:shadow-md transition w-full ${
                  !selectedCategory && !selectedDate
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Events Display */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">Error loading events: {error}</p>
          </div>
        ) : isFilterApplied ? (
          // Filtered Events View
          <div>
            {userEvents?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userEvents.map(renderEventCard)}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No events match your filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-pink-600 hover:text-pink-800 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        ) : (
          // Default View with Sections
          <div className="space-y-10">
            {/* Recommended Events */}
            <section>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] p-2 rounded-lg mr-3">
                  <FaStar className="text-white text-lg" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Recommended For You
                </h3>
              </div>
              {recommenededEvents?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recommenededEvents.map(renderEventCard)}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No recommended events found
                </p>
              )}
            </section>

            {/* Ongoing Events */}
            <section>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] p-2 rounded-lg mr-3">
                  <FaFire className="text-white text-lg" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Happening Now
                </h3>
              </div>
              {ongoingEvents?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {ongoingEvents.map(renderEventCard)}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No ongoing events found
                </p>
              )}
            </section>

            {/* Upcoming Events */}
            <section>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] p-2 rounded-lg mr-3">
                  <FaClock className="text-white text-lg" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Coming Soon
                </h3>
              </div>
              {upcomingEvents?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {upcomingEvents.map(renderEventCard)}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No upcoming events found
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEvents;