import react , { useContext , createContext , useEffect , useState } from "react";
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
} 

const UserProvider = ( {children}) => {

    const [userEvents , setUserEvents] = useState([]);
    const [userShows , setUserShows] = useState([]);
    const [error , setError] = useState(null);
    const [loading , setLoading] = useState(false);
    const [selectedUserEvent, setSelectedUserEvent] = useState(null);

    const selectUserEvent = (event) => {
        setSelectedUserEvent(event);
    };


    const URL = "http://localhost:8001/api/event";

    const fetchEventsByCategoryUser = async(category) => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL}/all/category/${category}`);
            console.log(response.data.result);
            setUserEvents(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally{
            setLoading(false);
        }
    }

    const fetchEventsByCityUser = async(city) => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL}/cities/all/${city}`);
            console.log(response.data.result);
            setUserEvents(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally{
            setLoading(false);
        }
    }

    const fetchShowsofAnEvent = async(id) => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL}/show/${id}`);
            setUserShows(response.data.result);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally{
            setLoading(false);
        }
    }

    return (
        <UserContext.Provider
          value={{
            error,
            loading,
            userEvents,
            userShows,
            selectedUserEvent,
            selectUserEvent,
            setSelectedUserEvent,
            fetchEventsByCategoryUser,
            fetchEventsByCityUser,
            fetchShowsofAnEvent
          }}
        >
          {children}
        </UserContext.Provider>
      );
};

export default UserProvider;
