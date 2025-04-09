import { useState , useContext } from "react";
import { useEvent } from '../EventContext/EventContext';

const CreateEvent = () => {
    const { createEvent } = useEvent();

    const [eventData , setEventData] = useState({
        title: "",
        description: "",
        category: "",
        venue_id: "",
        date: "",
        event_date: "",
        organizer_id: "",
        status: "active",
    })

    const [image , setImage] = useState(null);

    const handleChange = (e) => {
        setEventData({...eventData , [e.target.name]:e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };


    const handleSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(eventData).forEach((key) => formData.append(key, eventData[key]));
        if (image) formData.append("image", image);

        try {
            await createEvent(formData);
            alert("Event Created Successfully")
        } catch (error) {
            alert("Error: "+ error.message);
        }
    };


    return (
        <div className="max-w-lg mx-auto my-16 py-4 px-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Create Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full p-2 border rounded" type="text" name="title" placeholder="Title" onChange={handleChange} required />
                <textarea className="w-full p-2 border rounded" name="description" placeholder="Description" onChange={handleChange} required />
                <input className="w-full p-2 border rounded" type="text" name="category" placeholder="Category" onChange={handleChange} required />
                <input className="w-full p-2 border rounded" type="date" name="event_date" placeholder="Date" onChange={handleChange} required />
                <input className="w-full p-2 border rounded" type="email" name="organizer_id" placeholder="Organizer Email" onChange={handleChange} required />
                
                {/* Status Dropdown */}
                <select className="w-full p-2 border rounded" name="status" onChange={handleChange} required>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                </select>

                {/* File Upload */}
                <input className="w-full p-2 border rounded" type="file" onChange={handleFileChange} />

                <button className="w-full bg-green-500 text-white p-2 rounded" type="submit">Create Event</button>
            </form>
        </div>
    );

};

export default CreateEvent;