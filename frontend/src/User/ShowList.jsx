import { useEffect } from "react";
import { useUser } from '../User/UserContext/UserContext';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ShowList = () => {
  const {
    userShows,
    selectedUserEvent,
    setSelectedUserEvent,
    fetchShowsofAnEventByCity,
    selectUserShow,
  } = useUser();

  const navigate = useNavigate();
  const city = localStorage.getItem("city");

  useEffect(() => {
    if (!selectedUserEvent) {
      const savedEvent = localStorage.getItem("selectedUserEvent");
      if (savedEvent) {
        setSelectedUserEvent(JSON.parse(savedEvent));
      }
    }
  }, []);

  useEffect(() => {
    if (selectedUserEvent) {
      fetchShowsofAnEventByCity(selectedUserEvent.event_id, city);
    }
  }, [selectedUserEvent]);

  useEffect(() => {
    if (selectedUserEvent) {
      localStorage.setItem("selectedUserEvent", JSON.stringify(selectedUserEvent));
    }
  }, [selectedUserEvent]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#0a1128] dark:to-[#001f54] text-[#1B1C1E] dark:text-white font-[DM Sans] p-6">

      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Available Shows</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userShows.map((userShow) => (
          <motion.div
            key={userShow.show_id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }}
            className="rounded-xl overflow-hidden shadow-xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 flex flex-col justify-between transition-all"
          >
            <div className="p-4 flex flex-col gap-2">
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {userShow.venue_name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Date:</strong> {userShow.show_date}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Time:</strong> {userShow.start_time} – {userShow.end_time}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Seats:</strong> {userShow.total_seats}
              </p>
            </div>

            <div className="p-4">
              <button
                onClick={() => {
                  selectUserShow(userShow);
                  navigate(`/user/ticket-booking/${userShow.show_id}`);
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#001f54] to-[#1282a2] text-white rounded-lg hover:scale-105 transition"
              >
                Book Tickets
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShowList;
