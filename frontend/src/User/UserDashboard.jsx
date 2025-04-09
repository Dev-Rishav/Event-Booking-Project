import React from 'react';
import EventCards from './EventsByCategory';
import EventCityCards from './EventsByCity';

const UserDashboard = () => {
    return (
        <div>
            welcome to UserDashboard page
            <EventCards />
            {/* <EventCityCards /> */}
        </div>
    )
}

export default UserDashboard;