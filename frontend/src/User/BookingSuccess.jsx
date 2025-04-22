import React from "react";
import { useUser } from "./UserContext/UserContext";
import { v4 as uuidv4 } from "uuid";

const BookingSuccess = () => {
    const { downloadTicket,
            selectedSeats,
            selectedUserEvent,
            selectedUserShow,
            userId
     } = useUser();

    const bookingDetails = {
        // userName: user.name,
        userEmail: userId,
        // eventTitle: selectedUserEvent.title,
        // // venue: city,
        // showTime: selectedUserShow.start_time,
        // showDate: selectedUserShow.show_date,
        // seatNumbers: selectedSeats, // like ['A1', 'A2']
        ticketId: uuidv4(), // use ticketId from backend
        bookingTime: new Date().toLocaleString()
      }

    return (
        <button
            onClick={() => downloadTicket(bookingDetails)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
            🎟 Download Ticket
        </button>

    )
}

export default BookingSuccess;