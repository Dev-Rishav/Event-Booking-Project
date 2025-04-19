import react, { useContext, createContext, useEffect, useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";


const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
}

const socket = io("http://localhost:8001");



const UserProvider = ({ children }) => {

    const userId = Cookies.get("id");
    const [city, setCity] = useState("");
    const [userEvents, setUserEvents] = useState([]);
    const [recommenededEvents , setRecommenededEvents] = useState([]);
    const [upcomingEvents , setUpcomingEvents] = useState([]);
    const [ongoingEvents , setOngoingEvents] = useState([]);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [userShows, setUserShows] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [hasNewNotification, setHasNewNotification] = useState(false);


    const [selectedUserEvent, setSelectedUserEvent] = useState(null);
    const [selectedUserShow, setSelectedUserShow] = useState(null);


    const selectUserEvent = (event) => {
        setSelectedUserEvent(event);
    };

    const selectUserShow = (show) => {
        setSelectedUserShow(show);
    };


    //NOTIFICATION 
    useEffect(() => {
        if (userId) {
            socket.emit("register", userId);
        }

        socket.on("ticket-booked", (data) => {
            setNotifications((prev) => [
                ...prev,
                {
                    id: uuidv4(),
                    title: "Ticket Booked",
                    message: data.message,
                    type: "success",
                },
            ]);
            setHasNewNotification(true);
        });

        socket.on("new-event", (data) => {
            setNotifications((prev) => [
                ...prev,
                {
                    id: uuidv4(),
                    title: "New Event",
                    message: data.message,
                    type: "info",
                },
            ]);
        });

        return () => {
            socket.off("ticket-booked");
            socket.off("new-event");
        };
    }, [userId]);

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const clearNotificationBadge = () => {
        setHasNewNotification(false);
    };



    const URL = "http://localhost:8001/api/event";



    const fetchEvents = async (city) => {
        try {
            const response = await axios.get(`${URL}/all/events?city=${city}`);
            setUserEvents(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchLikedEvents = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8001/api/likedevents/${userId}`);
            // console.log(response.data.result);
            setUserEvents(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }


    const fetchEventsByCategoryAndCityUser = async (city, category) => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL}/all/category?city=${city}&category=${category}`);
            // console.log(response.data.result);
            setUserEvents(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchEventsByCityAndDate = async (city, eventDate) => {
        try {
            const response = await axios.get(
                `${URL}/by-date/all?city=${city}&event_date=${eventDate}`
            );
            setUserEvents(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchRecommendedEvents = async(city) => {
        try {
            const response = await axios.get(`http://localhost:8001/api/userinterestevents/${userId}?city=${city}`);
            setRecommenededEvents(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchOngoingEvents = async(city) => {
        try {
            const response = await axios.get(`http://localhost:8001/api/ongoingevents?city=${city}`);
            setOngoingEvents(response.data.result);
            setError(null);
        }  catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchUpcomingEvents = async(city) => {
        try {
            const response = await axios.get(`http://localhost:8001/api/upcomingevents?city=${city}`);
            setUpcomingEvents(response.data.result);
            setError(null);
        }  catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchEventsByCityUser = async (city) => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL}/cities/all/${city}`);
            console.log(response.data.result);
            setUserEvents(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const fetchShowsofAnEvent = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL}/show/${id}`);
            setUserShows(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }


    const fetchSeats = async (show_id) => {
        try {
            const res = await axios.get(`http://localhost:8001/api/show/seats/${show_id}`);
            setSeats(res.data.result);
        } catch (err) {
            console.error("Error fetching seats", err);
        }
    };


    const createBookingAndRedirect = async ({ userEmail, showId, selectedSeats, totalAmount }) => {
        try {
            const response = await axios.post('http://localhost:8001/api/booking/create-payment', {
                userEmail,
                showId,
                selectedSeats,
                totalAmount,
            });

            if (response.data.success) {
                window.location.href = response.data.approvalURL;
            } else {
                throw new Error("Payment initiation failed.");
            }
        } catch (error) {
            console.error("Booking creation failed:", error);
            alert("Failed to initiate payment. Please try again.");
        }
    };


    return (
        <UserContext.Provider
            value={{
                error,
                loading,
                userEvents,
                userShows,
                selectedUserShow,
                selectedUserEvent,
                city,
                seats,
                selectedSeats,
                notifications,
                hasNewNotification,
                recommenededEvents,
                ongoingEvents,
                upcomingEvents,
                clearNotificationBadge,
                removeNotification,
                selectUserShow,
                setSelectedUserShow,
                setUserEvents,
                setCity,
                setSelectedSeats,
                fetchSeats,
                createBookingAndRedirect,
                fetchEventsByCityAndDate,
                fetchEvents,
                fetchLikedEvents,
                selectUserEvent,
                setSelectedUserEvent,
                fetchEventsByCategoryAndCityUser,
                fetchEventsByCityUser,
                fetchShowsofAnEvent,
                fetchRecommendedEvents,
                fetchOngoingEvents,
                fetchUpcomingEvents
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
