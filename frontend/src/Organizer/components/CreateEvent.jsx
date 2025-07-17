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
      Object.entries(eventData).forEach(([key, value]) => formData.append(key, value));
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
      className="max-w-xl mx-auto my-26 p-6 sm:p-8 bg-white/80 dark:bg-[#0f172a]/60 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-md"
    >
      {message && (
        <p className="text-center text-green-600 dark:text-green-400 font-semibold mb-4">
          {message}
        </p>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Create Event</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={eventData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#172554] text-gray-800 dark:text-gray-200"
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={eventData.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#172554] text-gray-800 dark:text-gray-200"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={eventData.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#172554] text-gray-800 dark:text-gray-200"
        />

        <div className="flex gap-4">
          <input
            type="date"
            name="start_date"
            value={eventData.start_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#172554] text-gray-800 dark:text-gray-200"
          />
          <input
            type="date"
            name="end_date"
            value={eventData.end_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#172554] text-gray-800 dark:text-gray-200"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-300 dark:file:bg-gray-700 file:text-black dark:file:text-white hover:file:bg-gray-400 dark:hover:file:bg-gray-600"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md"
        >
          Create Event
        </button>
      </form>
    </motion.div>
  );
};

export default CreateEvent;
