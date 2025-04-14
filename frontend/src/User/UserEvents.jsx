import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext/UserContext';
import { useNavigate } from "react-router-dom";

const UserEvents = () => {

      const navigate = useNavigate();
      
    const {
        userEvents,
        fetchEvents,
        fetchEventsByCategoryAndCityUser,
        fetchEventsByCityAndDate,
        setCity,
        city,
        loading,
        error,
        selectUserEvent,
    } = useUser();

    const [inputCity, setInputCity] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const handleSearch = () => {
        setCity(inputCity);
        fetchEvents(inputCity);
        setSelectedCategory("");
        setSelectedDate("");
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        if (category && city) {
            fetchEventsByCategoryAndCityUser(city, category);
        }
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        if (date && city) {
            fetchEventsByCityAndDate(city, date);
        }
    };




    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Find Events in Your City</h2>

            {/* City Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <input
                    type="text"
                    placeholder="Enter city"
                    value={inputCity}
                    onChange={(e) => setInputCity(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-1/2"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </div>

            {/* Filters */}
            {userEvents.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="border border-gray-300 px-4 py-2 rounded-lg"
                    >
                        <option value="">Filter by Category</option>
                        <option value="Music">Music</option>
                        <option value="Sports">Sports</option>
                        <option value="Tech">Tech</option>
                        <option value="Education">Education</option>
                        {/* Add more categories as needed */}
                    </select>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="border border-gray-300 px-4 py-2 rounded-lg"
                    />
                </div>
            )}

            {/* Event Cards */}
            {loading ? (
                <p className="text-center text-gray-500">Loading events...</p>
            ) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
            ) : userEvents.length === 0 ? (
                <p className="text-center text-gray-500">No events found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
                        >
                            <img
                                src={event.image || "https://via.placeholder.com/400x200"}
                                alt={event.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                                <p className="text-sm text-gray-600 mb-1">📍 {event.city}</p>
                                <p className="text-sm text-gray-600 mb-1">📅 {event.event_date}</p>
                                <p className="text-sm text-gray-600 mb-2">🎯 {event.category}</p>
                                <button
                                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    onClick={() => {
                                      selectUserEvent(event);
                                      navigate("/user/showlist");
                                    }}
                                >
                                    View Shows
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserEvents;
