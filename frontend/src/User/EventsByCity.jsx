import { useEffect, useState } from "react";
import { useUser } from '../User/UserContext/UserContext';

const EventCityCards = () => {
    const { userEvents, fetchEventsByCityUser } = useUser();
    const [city, setCity] = useState("All");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

   
    const handleSearch = async () => {
        setLoading(true);
        try {
            await fetchEventsByCityUser(city);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEventsByCityUser();
    }, []);


    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-4">Events</h2>
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Search category..."
                    className="p-2 border rounded-lg w-64"
                />
                <button 
                    onClick={handleSearch} 
                    className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
                >
                    Search
                </button>
            </div>
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userEvents.map((userEvent) => (
                    <div key={userEvent.event_id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src={userEvent.image} alt={userEvent.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-bold">{userEvent.title}</h3>
                            <p className="text-gray-600">{userEvent.description}</p>
                            <p className="text-sm text-gray-500 mt-2">Date: {userEvent.event_date}</p>
                            <p className="text-sm text-gray-500">Likes: {userEvent.likes_count}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventCityCards;
