import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_ENDPOINTS } from "../../config/api.js";

const Revenue = () => {
  const id = Cookies.get("id");
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await axios.get(
          API_ENDPOINTS.BOOKING.EVENTWISE_EARNING(id)
        );
        setEarnings(response.data.result);
      } catch (error) {
        console.error("Error fetching earnings:", error);
      }
    };

    fetchEarnings(id);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#123458] mb-10">
        Event-wise Earnings
      </h2>

      {earnings.length === 0 ? (
        <p className="text-center text-gray-500">No earnings available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earnings.map((earning) => (
            <div
              key={earning.event_id}
              className="bg-[#F1EFEC] border border-[#D4C9BE] rounded-xl p-6 shadow hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-[#030303] mb-2">
                {earning.event_title}
              </h3>
              <p className="text-[#123458] text-lg">
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
