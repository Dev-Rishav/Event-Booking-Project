import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

const Revenue = () => {
  const id = Cookies.get("id");
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/api/eventwiseearning/${id}`); // Update with your actual route
        setEarnings(response.data.result);
      } catch (error) {
        console.error("Error fetching earnings:", error);
      }
    };

    fetchEarnings(id);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-red-500 m-8">Event-wise Earnings</h2>

      {earnings.length === 0 ? (
        <p className="text-center text-gray-500">No earnings available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earnings.map((earning) => (
            <div
              key={earning.event_id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {earning.event_title}
              </h3>
              <p className="text-gray-600">
                <span className="font-medium">Total Earnings:</span>{" "}
                ₹{earning.total_earnings.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Revenue;
