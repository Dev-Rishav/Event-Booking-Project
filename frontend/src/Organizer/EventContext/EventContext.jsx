import react , { useContext , createContext , useEffect , useState } from "react";
import axios from 'axios';
import { API_ENDPOINTS } from "../../config/api.js";


const EventContext = createContext();

export const useEvent = () => {
    return useContext(EventContext);
}

const EventProvider = ({children}) => {

    const [events , setEvents] = useState([]);
    const [bookings , SetBookings] = useState([]);
    const [shows , setShows] = useState([]);
    const [error , setError] = useState(null);
    const [loading , setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const selectEvent = (event) => {
        setSelectedEvent(event);
    };
    

    const fetchEvents = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.EVENTS.BY_ORGANIZER(id));
            // console.log(response.data.result);
            setEvents(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally{
            setLoading(false);
        }
    }

    

    const fetchShows = async (event_id) => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL}/show/${event_id}`);
            // console.log(response.data.result);
            setShows(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally{
            setLoading(false);
        }
    }

    const getEventbyID = async(id) => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL}/${id}`);
            setEvents(response.data.result);
            // console.log(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally{
            setLoading(false);
        }
    }

    const createEvent = async(event) => {
        try {
            const response = await axios.post(URL, event, {
                headers: { "Content-Type": "multipart/form-data" },
            });
           setEvents((prev) => [...prev , response.data]);
        } catch (error) {
            setError(error.message);
        }
    }

    const createShow = async(showData) => {
        const id = showData.event_id;
        // console.log(id);
        try {
            const response = await axios.post(`${URL}/show/${id}` , showData);
            setShows((prev) => [...prev , response.data.result]);
            return response;
        } catch (error) {
            setError(error.message);
        }
    }

    const getEventsByCategory = async(category,id) => {
        try {
            const response = await axios.get(`${URL}/category/${id}` , category );
            setEvents(response.data);
        } catch (error) {
            setError(error.message);
        }
    }

    const getEventsByCity = async(city , id) => {
        try {
            const response = await axios.get(`${URL}/city/${id}` , city );
            setEvents(response.data);
        } catch (error) {
            setError(error.message);
        }
    }

    const getAllBookingOfOrganizer = async(organizer_id) => {
        try {
            const response = await axios.get(API_ENDPOINTS.BOOKING.ORGANIZER_BOOKINGS(organizer_id));
            SetBookings(response.data.result);
            return response;
        } catch (error) {
            setError(error.message);
        }
    }

    


    return (
        <EventContext.Provider
          value={{
            events,
            shows,
            bookings,
            loading,
            error,
            selectEvent,
            selectedEvent,
            setSelectedEvent,
            fetchEvents,
            fetchShows,
            getEventbyID,
            createEvent,
            createShow,
            getEventsByCategory,
            getEventsByCity,
            getAllBookingOfOrganizer
          }}
        >
          {children}
        </EventContext.Provider>
      );
};

export default EventProvider;