import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext/UserContext';
import { useNavigate, NavLink } from "react-router-dom";
import { FaFilter, FaSearch, FaCalendarAlt, FaTags, FaStar, FaFire, FaClock, FaTimes } from 'react-icons/fa';
// import Cookies from 'js-cookie';

const UserEvents = () => {
    // const userId = Cookies.get("id");
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

    // Fetch all events when city changes
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
        setCity(inputCity);
        setInputCity("");
    };

    const handleApplyFilters = () => {
        if (selectedCategory) {
            fetchEventsByCategoryAndCityUser(city , selectedCategory);
            setIsFilterApplied(true);
        }
        if(selectedDate)
        {
            fetchEventsByCityAndDate(city , selectedDate);
            setIsFilterApplied(true);
        }
    };

    const clearFilters = () => {
        setSelectedCategory("");
        setSelectedDate("");
        setIsFilterApplied(false);
        // Refetch all events to show original sections
        fetchRecommendedEvents(city);
        fetchOngoingEvents(city);
        fetchUpcomingEvents(city);
    };

    const renderEventCard = (event) => (
        <div
            key={event.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
        >
            <div className="relative">
                <img
                    src={event.image || "https://via.placeholder.com/400x200"}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {event.category}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{event.name}</h3>
                <div className="flex items-center text-gray-600 mb-1">
                    <span className="mr-2">📍</span>
                    <span>{event.venue || event.city}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                    <span className="mr-2">📅</span>
                    <span>{new Date(event.event_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</span>
                </div>
                <div className="mt-auto pt-4 flex justify-between">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex-1 mr-2"
                        onClick={() => {
                            selectUserEvent(event);
                            navigate("/user/showlist");
                        }}
                    >
                        Book Now
                    </button>
                    <button
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex-1"
                        onClick={() => navigate(`/user/reviews/${event.event_id}`)}
                    >
                        Reviews
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="px-4 py-2 max-w-7xl mx-auto">
            {/* Search Section */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-2xl p-6 mb-8 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Amazing Events</h1>
                <p className="text-lg mb-6">Find the best events happening in your city</p>

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
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold shadow-sm"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {city ? (
                <div className="mb-8">
                    {/* Filter Controls */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-700">
                            {isFilterApplied ? 'Filtered Events' : 'Events in ' + city}
                        </h2>
                        <div className="flex items-center space-x-3">
                            {isFilterApplied && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                                >
                                    <FaTimes className="mr-1" />
                                    Clear Filters
                                </button>
                            )}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center text-sm bg-gray-200 text-red-500 px-3 py-1 rounded hover:bg-blue-200"
                            >
                                <FaFilter className="mr-1" />
                                {isFilterApplied ? 'Modify Filters' : 'Filter Events'}
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <FaTags className="mr-2" />
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    <FaCalendarAlt className="mr-2" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleApplyFilters}
                                    disabled={!selectedCategory && !selectedDate}
                                    className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full ${(!selectedCategory && !selectedDate) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Events Display */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">No events match your filters</h3>
                                    <button
                                        onClick={clearFilters}
                                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Default View with Sections
                        <div className="space-y-8">
                            {/* Recommended Events */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <FaStar className="text-yellow-500 mr-2 text-xl" />
                                    <h3 className="text-lg font-semibold text-gray-800">Recommended For You</h3>
                                </div>
                                {recommenededEvents?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {recommenededEvents.map(renderEventCard)}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No recommended events found</p>
                                )}
                            </section>

                            {/* Ongoing Events */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <FaFire className="text-red-500 mr-2 text-xl" />
                                    <h3 className="text-lg font-semibold text-gray-800">Happening Now</h3>
                                </div>
                                {ongoingEvents?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {ongoingEvents.map(renderEventCard)}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No ongoing events found</p>
                                )}
                            </section>

                            {/* Upcoming Events */}
                            <section>
                                <div className="flex items-center mb-4">
                                    <FaClock className="text-blue-500 mr-2 text-xl" />
                                    <h3 className="text-lg font-semibold text-gray-800">Coming Soon</h3>
                                </div>
                                {upcomingEvents?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {upcomingEvents.map(renderEventCard)}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No upcoming events found</p>
                                )}
                            </section>
                        </div>
                    )}
                </div>
            ) : (
                // Empty State - No City Searched
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Find events in your city</h3>
                    <p className="mt-1 text-gray-500">Search for a city to discover events</p>
                </div>
            )}
        </div>
    );
};

export default UserEvents;

