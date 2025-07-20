import { useState } from "react";
import { useEvent } from "../EventContext/EventContext";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

const CreateEvent = () => {
  const { createEvent, error } = useEvent();
  const emailId = Cookies.get("id");
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
      Object.entries(eventData).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (image) formData.append("image", image);

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
      console.log(error);
      setMessage("Failed to create Event.");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto my-10 md:my-20 p-4 md:p-8 bg-white/80 rounded-2xl shadow-xl border border-white/30 backdrop-blur-md"
    >
      {message && (
        <p className={`text-center font-semibold mb-4 ${
          message.includes("success") ? "text-green-600" : "text-red-500"
        }`}>
          {message}
        </p>
      )}

      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Create Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={eventData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-gray-800 placeholder-gray-400"
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={eventData.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-gray-800 placeholder-gray-400"
        />

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Event Category</label>
          <select
            name="category"
            value={eventData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-gray-800"
            required
          >
            <option value="">Select Category</option>
            <option value="Movie">Movie</option>
            <option value="Sports">Sports</option>
            <option value="Concerts">Concert</option>
            <option value="Stand Up">Stand Up</option>
            <option value="Technical">Technical</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label className="block font-semibold mb-1 text-gray-700">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={eventData.start_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-gray-800"
            />
          </div>
          <div className="w-full">
            <label className="block font-semibold mb-1 text-gray-700">End Date</label>
            <input
              type="date"
              name="end_date"
              value={eventData.end_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Event Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#f40752] file:to-[#f9ab8f] file:text-white hover:file:shadow-md transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:from-[#f9ab8f] hover:to-[#f40752] transform hover:scale-[1.02]"
        >
          Create Event
        </button>
      </form>
    </motion.div>
  );
};

export default CreateEvent;