import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "../EventContext/EventContext"; // Assuming CreateShow is here
// import axios from "axios";

const CreateShows = () => {
    const { createShow } = useEvent();
    const { eventId } = useParams(); // if route is /events/:eventId/create-show
    // const [venues, setVenues] = useState("");
    const [formData, setFormData] = useState({
        venue_id: "",
        start_time: "",
        end_time: "",
        total_seats: "",
        show_date: "",
        vip_ticket_price:"",
        regular_ticket_price:"",
    });

    const [message, setMessage] = useState("");

    // useEffect(() => {
    //     // Fetch venue list
    //     const fetchVenue = async () => {
    //         try {
    //             const response = await axios.get(`/api/event/venue/${venue_id}`);
    //             setVenues(response.data);
    //         } catch (error) {
    //             console.error("Error fetching venues", error);
    //         }
    //     };
    //     fetchVenue();
    // }, []);

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
            console.log(response.data.result);
            setFormData({
                venue_id: "",
                start_time: "",
                end_time: "",
                total_seats: "",
                show_date: "",
                vip_ticket_price: "",
                regular_ticket_price: "",
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
                    <label className="block font-semibold">Venue</label>
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
                    <label className="block font-semibold">Total Seats</label>
                    <input
                        type="number"
                        name="total_seats"
                        value={formData.total_seats}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        min={1}
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">VIP Seats Price</label>
                    <input
                        type="number"
                        name="vip_ticket_price"
                        value={formData.vip_ticket_price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Regular Seats Price</label>
                    <input
                        type="number"
                        name="regular_ticket_price"
                        value={formData.regular_ticket_price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
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
