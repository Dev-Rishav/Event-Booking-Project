import react, { useContext, createContext, useEffect, useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
}

const UserProvider = ({ children }) => {

    const userId = Cookies.get("id");
    const [city, setCity] = useState("");
    const [userEvents, setUserEvents] = useState([]);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [userShows, setUserShows] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedUserEvent, setSelectedUserEvent] = useState(null);

    const selectUserEvent = (event) => {
        setSelectedUserEvent(event);
    };


    //fetchseats have to define here -


    const URL = "http://localhost:8001/api/event";



    // const fetchEvents = async ({ city = "", category = "", date = "" }) => {
    //     try {
    //       const response = await axios.get(`${URL}/search`, {
    //         params: { city, category, date },
    //       });
    //       setUserEvents(response.data.result);
    //     } catch (error) {
    //       console.error("Error fetching events:", error);
    //       setUserEvents([]);
    //     }
    //   };

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

    const bookSeats = async (show_id) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8001/api/show/booking/confirm', {
                show_id,
                seats: selectedSeats,
                userId
            });
            setSeats(response.data.result);
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

    return (
        <UserContext.Provider
            value={{
                error,
                loading,
                userEvents,
                userShows,
                city,
                seats,
                selectedSeats,
                setUserEvents,
                setCity,
                setSelectedSeats,
                bookSeats,
                fetchSeats,
                selectedUserEvent,
                fetchEventsByCityAndDate,
                fetchEvents,
                selectUserEvent,
                setSelectedUserEvent,
                fetchEventsByCategoryAndCityUser,
                fetchEventsByCityUser,
                fetchShowsofAnEvent
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
