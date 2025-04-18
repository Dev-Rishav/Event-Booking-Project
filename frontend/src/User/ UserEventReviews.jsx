import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Event Reviews</h2>

      {/* Review Form */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          rows={4}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Submit Review
          </button>
        </div>
      </div>

      {/* All Reviews */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">All Reviews</h3>
        {loading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <p className="text-gray-800 mb-2">{r.review_text}</p>
                <p className="text-xs text-gray-500">
                  — User {r.user_id} ·  <p className="text-xs text-gray-500 mx-4">{new Date(r.review_date).toLocaleString()}</p>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserEventReviews;
