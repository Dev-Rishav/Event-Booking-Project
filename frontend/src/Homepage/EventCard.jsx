import { FaThumbsUp, FaStar } from "react-icons/fa";

const EventCard = ({ event }) => {
  return (
    <div className="w-64 bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition duration-300">
      <div className="relative">
        <img src={event.image} alt={event.name} className="w-full h-50 object-cover" />
      </div>

      <div className="p-3">
        <h3 className="text-lg font-semibold">{event.name}</h3>
        <p className="text-gray-600 text-sm">{event.category}</p>

        <div className="flex justify-between items-center mt-2">
          {event.likes ? (
            <span className="flex items-center text-green-600 text-sm">
              <FaThumbsUp className="mr-1" /> {event.likes} Likes
            </span>
          ) : (
            <span className="flex items-center text-red-600 text-sm">
              <FaStar className="mr-1" /> {event.rating}/10 {event.votes} Votes
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
