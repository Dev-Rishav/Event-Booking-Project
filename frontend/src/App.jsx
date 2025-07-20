import React from "react";
import LandingPage from "./pages/LandingPage";
import EventProvider from "./Organizer/EventContext/EventContext";
import UserProvider from "./User/UserContext/UserContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <UserProvider>
          <EventProvider>
            <LandingPage />
          </EventProvider>
        </UserProvider>
      </Provider>
    </>
  );
}

export default App;
