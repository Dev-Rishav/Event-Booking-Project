import { useState } from "react";
import { useEvent } from '../EventContext/EventContext';
import Cookies from 'js-cookie';

const CreateEvent = () => {
    const { createEvent, error } = useEvent();
    const emailId = Cookies.get('id');
    const [message, setMessage] = useState("");
    const [eventData, setEventData] = useState({
        title: "",
        description: "",
        category: "",
        start_date: "",
        end_date: "",
        organizer_id: emailId,
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
            const formData = new FormData();
            formData.append("title", eventData.title);
            formData.append("description", eventData.description);
            formData.append("category", eventData.category);
            formData.append("start_date", eventData.start_date);
            formData.append("end_date", eventData.end_date);
            formData.append("organizer_id", eventData.organizer_id);

            if (image) {
                formData.append("image", image);
            }

            await createEvent(formData);

            setMessage("Event created successfully!");
            setEventData({
                title: "",
                description: "",
                category: "",
                start_date: "",
                end_date: "",
                organizer_id: emailId,
            });
            setImage(null);
        } catch (error) {
            setMessage("Failed to create Event.");
        }
    };

    return (
        <div className="max-w-xl mx-auto my-16 bg-[#F1EFEC] p-8 rounded-2xl shadow-lg border border-[#D4C9BE]">
            {message && (
                <p className="text-center text-green-700 font-semibold mb-4">{message}</p>
            )}

            <h2 className="text-2xl font-bold text-[#123458] mb-6 text-center">
                Create Event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full px-4 py-2 border border-[#D4C9BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458]"
                    type="text"
                    name="title"
                    placeholder="Event Title"
                    value={eventData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    className="w-full px-4 py-2 border border-[#D4C9BE] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#123458]"
                    name="description"
                    placeholder="Event Description"
                    value={eventData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                />
                <input
                    className="w-full px-4 py-2 border border-[#D4C9BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458]"
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={eventData.category}
                    onChange={handleChange}
                    required
                />
                <div className="flex gap-4">
                    <input
                        className="w-full px-4 py-2 border border-[#D4C9BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458]"
                        type="date"
                        name="start_date"
                        value={eventData.start_date}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="w-full px-4 py-2 border border-[#D4C9BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458]"
                        type="date"
                        name="end_date"
                        value={eventData.end_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <input
                    className="w-full px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4C9BE] file:text-[#030303] hover:file:bg-[#c2b6ab]"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button
                    className="w-full bg-[#123458] text-white py-2 rounded-lg font-semibold hover:bg-[#0f2e4a] transition duration-200"
                    type="submit"
                >
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
