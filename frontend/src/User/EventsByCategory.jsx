import { useEffect, useState } from "react";
import { useUser } from "../User/UserContext/UserContext";
import { useNavigate } from "react-router-dom";

const categories = ["All","Sports", "Sports(Cricket)", "Music", "Tech", "Art", "Food"];

const EventCards = () => {
    const { userEvents, selectUserEvent, fetchEventsByCategoryUser } = useUser();
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCategoryChange = async (selectedCategory) => {
        setCategory(selectedCategory);
        setLoading(true);
        try {
            await fetchEventsByCategoryUser(selectedCategory);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEventsByCategoryUser(category);
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-4">Events</h2>
            <div className="flex justify-center space-x-2 mb-4">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            category === cat ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                        }`}
                        onClick={() => handleCategoryChange(cat)}
                    >
                        {cat}
                    </button>
                ))}
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
                            <button
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                                onClick={() => {
                                    selectUserEvent(userEvent)
                                    navigate(`/user/showlist`)
                                }}
                            >
                                View Shows
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventCards;
