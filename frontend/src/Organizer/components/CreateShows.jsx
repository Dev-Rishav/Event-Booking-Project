import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "../EventContext/EventContext";
import { motion } from "framer-motion";

const CreateShows = () => {
  const { createShow } = useEvent();
  const { eventId } = useParams();

  const [formData, setFormData] = useState({
    venue_name: "",
    start_time: "",
    end_time: "",
    show_date: "",
    seating_plan: "",
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

    try {
      const response = await createShow({ ...formData, event_id: eventId });
      setMessage("Show created successfully!");
      console.log(response.data);

      setFormData({
        venue_name: "",
        start_time: "",
        end_time: "",
        show_date: "",
        seating_plan: "",
      });
    } catch (error) {
      setMessage("Failed to create show.");
      console.error(error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mt-16 md:mt-24 p-4 md:p-8 bg-white/80 rounded-2xl shadow-xl border border-white/30 backdrop-blur-md"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        Create New Show
      </h2>

      {message && (
        <p className={`text-center font-medium mb-4 ${
          message.includes("success") ? "text-green-600" : "text-red-500"
        }`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Show City</label>
          <select
            name="venue_name"
            value={formData.venue_name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-gray-800"
            required
          >
            <option value="">Select City</option>
            <option value="Indore">Indore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="New York">New York</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Show Date</label>
          <input
            type="date"
            name="show_date"
            value={formData.show_date}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-gray-800"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Start Time</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">End Time</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-gray-800"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-700">Seating Category</label>
          <select
            name="seating_plan"
            value={formData.seating_plan}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f40752]/50 bg-white/90 text-gray-800"
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
          className="w-full bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:from-[#f9ab8f] hover:to-[#f40752] transform hover:scale-[1.02]"
        >
          Create Show
        </button>
      </form>
    </motion.div>
  );
};

export default CreateShows;