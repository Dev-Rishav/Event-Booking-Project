import React, { useEffect } from 'react';
import { useUser } from './UserContext/UserContext';
import { Loader } from 'lucide-react'; 
import Cookies from 'js-cookie';

const LikedEvents = () => {
    const userId = Cookies.get("id");
    const {
        userEvents,
        fetchLikedEvents,
        loading,
        error,
    } = useUser();

    useEffect(() => {
        fetchLikedEvents(userId); 
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                Your Liked Events
            </h2>

            {loading && (
                <div className="flex justify-center items-center py-20">
                    <Loader className="animate-spin h-8 w-8 text-red-500" />
                </div>
            )}


            {!loading && userEvents.length === 0 && (
                <p className="text-gray-600 text-center">You haven't liked any events yet.</p>
            )}

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {userEvents.map((event) => (
                    <div
                        key={event.event_id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                    >
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 space-y-2">
                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                {event.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-3">
                                {event.description}
                            </p>
                            <p className="text-sm text-gray-500">
                                Category: <span className="font-medium text-gray-700">{event.category}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Date: <span className="font-medium text-gray-700">{new Date(event.event_date).toLocaleDateString()}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Likes: <span className="font-medium text-gray-700">{event.likes_count}</span>
                            </p>
                            <span className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${event.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {event.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LikedEvents;
