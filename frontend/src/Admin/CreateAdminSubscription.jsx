import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { createSubscriptionPlan } from "../redux/slices/adminslice/adminActions";
import { motion } from "framer-motion";

const CreateAdminSubscription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    plan_name: "",
    description: "",
    max_events: "",
    price: "",
    duration_days: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(createSubscriptionPlan(formData));
      toast.success("Plan created successfully!");
      navigate("/admin/subscription");
    } catch (error) {
      console.error("Error creating plan:", error);
      const errorMessage = error.response?.data?.message || "Failed to create plan";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto my-20 p-6 sm:p-8 bg-white/80 dark:bg-[#0f172a]/60 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-md"
    >
      <ToastContainer position="top-center" autoClose={3000} />

      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Create Subscription Plan</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="plan_name"
          placeholder="Plan Name"
          value={formData.plan_name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#172554] text-gray-800 dark:text-gray-200"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#172554] text-gray-800 dark:text-gray-200"
        />

        <input
          type="number"
          name="max_events"
          placeholder="Max Events"
          value={formData.max_events}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#172554] text-gray-800 dark:text-gray-200"
        />

        <input
          type="number"
          name="price"
          placeholder="Price ($)"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#172554] text-gray-800 dark:text-gray-200"
        />

        <input
          type="number"
          name="duration_days"
          placeholder="Duration (Days)"
          value={formData.duration_days}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#172554] text-gray-800 dark:text-gray-200"
        />

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md ${
            isLoading && "opacity-70 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Creating..." : "Create Plan"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateAdminSubscription;
