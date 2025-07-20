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
    <div className="w-full min-h-[calc(100vh-4rem)] bg-white text-gray-800 font-[DM Sans] p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] rounded-xl p-6 mb-8 text-white shadow-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
          Available Shows
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userShows.map((userShow) => (
          <motion.div
            key={userShow.show_id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }}
            className="rounded-xl overflow-hidden shadow-lg bg-white border border-gray-100 flex flex-col justify-between transition-all hover:shadow-xl"
          >
            <div className="p-5 flex flex-col gap-3">
              <h3 className="text-xl font-bold text-gray-800">
                {userShow.venue_name}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="bg-pink-100 text-pink-700 p-1 rounded-full">
                  📅
                </span>
                <span>{userShow.show_date}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="bg-pink-100 text-pink-700 p-1 rounded-full">
                  ⏰
                </span>
                <span>{userShow.start_time} – {userShow.end_time}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="bg-pink-100 text-pink-700 p-1 rounded-full">
                  🪑
                </span>
                <span>{userShow.total_seats} seats available</span>
              </div>
            </div>

            <div className="p-5">
              <button
                onClick={() => {
                  selectUserShow(userShow);
                  navigate(`/user/ticket-booking/${userShow.show_id}`);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white rounded-lg hover:shadow-md transition font-medium"
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