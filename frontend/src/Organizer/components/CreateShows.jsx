import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "../EventContext/EventContext";

const CreateShows = () => {
    const { createShow } = useEvent();
    const { eventId } = useParams();

    const [formData, setFormData] = useState({
        venue_name: "",
        start_time: "",
        end_time: "",
        show_date: "",
        plan_name: "",
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
                venue_name: "",
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
        <div className="max-w-xl mx-auto mt-10 p-8 bg-[#F1EFEC] rounded-2xl shadow-lg border border-[#D4C9BE]">
            <h2 className="text-2xl font-bold text-center text-[#123458] mb-6">
                Create New Show
            </h2>

            {message && (
                <p className="text-center text-green-700 font-medium mb-4">{message}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                    <label className="block text-[#030303] font-semibold mb-1">
                        Show City
                    </label>
                    <select
                        name="venue_name"
                        value={formData.venue_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-[#D4C9BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458]"
                        required
                    >
                        <option value="">Select City</option>
                        <option value="Indore">Indore</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="New York">New York</option>
                        <option value="Benguluru">Benguluru</option>
                        <option value="Delhi">Delhi</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[#030303] font-semibold mb-1">
                        Show Date
                    </label>
                    <input
                        type="date"
                        name="show_date"
                        value={formData.show_date}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-[#D4C9BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458]"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[#030303] font-semibold mb-1">
                            Start Time
                        </label>
                        <input
                            type="time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-[#D4C9BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[#030303] font-semibold mb-1">
                            End Time
                        </label>
                        <input
                            type="time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-[#D4C9BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458]"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[#030303] font-semibold mb-1">
                        Seating Category
                    </label>
                    <select
                        name="plan_name"
                        value={formData.plan_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-[#D4C9BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458]"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="theatre">Theatre</option>
                        <option value="stadium">Stadium</option>
                        <option value="open_air">Open Air</option>
                        <option value="cinema">Cinema</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#123458] text-white py-2 rounded-lg font-semibold hover:bg-[#0f2e4a] transition-colors"
                >
                    Create Show
                </button>
            </form>
        </div>
    );
};

export default CreateShows;
