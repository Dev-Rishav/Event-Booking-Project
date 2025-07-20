import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

const UserEventReviews = () => {
  const { event_id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8001/api/reviews/${event_id}`);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!reviewText.trim()) return;
    try {
      const userEmail = Cookies.get("id");
      await axios.post(`http://localhost:8001/api/reviews`, {
        user_id: userEmail,
        event_id,
        review_text: reviewText,
      });
      setReviewText("");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [event_id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] rounded-xl p-6 mb-8 text-white shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center">Event Reviews</h2>
      </motion.div>

      {/* Review Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Write a Review</h3>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience with this event..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          rows={4}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] hover:shadow-md text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Submit Review
          </button>
        </div>
      </motion.div>

      {/* All Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">All Reviews</h3>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No reviews yet.</p>
            <p className="text-gray-600">Be the first to share your experience!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition"
              >
                <div className="flex items-start mb-2">
                  <div className="bg-pink-100 text-pink-700 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800">{r.review_text}</p>
                    <div className="flex items-center mt-2">
                      <p className="text-xs text-gray-500">User {r.user_id}</p>
                      <span className="mx-2 text-gray-300">•</span>
                      <p className="text-xs text-gray-500">
                        {new Date(r.review_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default UserEventReviews;