import React from "react";
import EventList from "../components/EventList";

const Events = () => {
    return (
      <>
        <div>
          <h1 className="text-3xl font-bold mb-4 mt-8">Manage Events</h1>
          <EventList />
        </div>
      </>
      );
};

export default Events;
