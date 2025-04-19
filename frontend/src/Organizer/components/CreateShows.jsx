import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "../EventContext/EventContext"; 

const CreateShows = () => {
    const { createShow } = useEvent();
    const { eventId } = useParams(); 

    const [formData, setFormData] = useState({
        venue_id: "",
        start_time: "",
        end_time: "",
        show_date: "",
        plan_name: "", // e.g., 'theatre'
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            event_id: eventId,
        };

        try {
            const response = await createShow(payload);
            setMessage("Show created successfully!");
            console.log(response.data);
            setFormData({
                venue_id: "",
                start_time: "",
                end_time: "",
                show_date: "",
                plan_name: "",
            });
        } catch (error) {
            setMessage("Failed to create show.");
            console.error(error);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Create New Show</h2>

            {message && <p className="text-center text-green-600 mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Venue ID</label>
                    <input
                        type="number"
                        name="venue_id"
                        value={formData.venue_id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Show Date</label>
                    <input
                        type="date"
                        name="show_date"
                        value={formData.show_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Start Time</label>
                    <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">End Time</label>
                    <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Seating Category</label>
                    <select
                        name="plan_name"
                        value={formData.plan_name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="theatre">Theatre</option>
                        <option value="stadium">Stadium</option>
                        <option value="conference">Conference</option>
                        <option value="open_air">Open Air</option>
                        <option value="cinema">Cinema</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
                >
                    Create Show
                </button>
            </form>
        </div>
    );
};

export default CreateShows;
