import { useState } from "react";
import { useEvent } from '../EventContext/EventContext';
import Cookies from 'js-cookie';

const CreateEvent = () => {
    const { createEvent  , error } = useEvent();
    const emailId = Cookies.get('id');
    const [message, setMessage] = useState("");
    const [eventData, setEventData] = useState({
        title: "",
        venue_id: "",
        description: "",
        category: "",
        start_date: "",
        end_date: "",
        organizer_id: "",
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createEvent(eventData, image);
            setMessage("Event created successfully!");
            setEventData({
                title: "",
                venue_id: "",
                description: "",
                category: "",
                start_date: "",
                end_date: "",
                organizer_id: "",
            });
            setImage(null);
        } catch (error) {
            setMessage("Failed to create Event.");
        }
    };

    return (
        <div className="max-w-lg mx-auto my-16 py-4 px-8 bg-white rounded-lg shadow-md">

             {message && <p className="text-center text-green-600 mb-4">{message}</p>}

            <h2 className="text-xl font-bold mb-4">Create Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={eventData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    className="w-full p-2 border rounded"
                    name="description"
                    placeholder="Description"
                    value={eventData.description}
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={eventData.category}
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full p-2 border rounded"
                    type="date"
                    name="start_date"
                    value={eventData.start_date}
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full p-2 border rounded"
                    type="date"
                    name="end_date"
                    value={eventData.end_date}
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full p-2 border rounded"
                    type="number"
                    name="venue_id"
                    value={eventData.venue_id}
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full p-2 border rounded"
                    type="email"
                    name="organizer_id"
                    placeholder="Organizer Email"
                    value={eventData.organizer_id}
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full p-2 border rounded"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    type="submit"
                >
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
