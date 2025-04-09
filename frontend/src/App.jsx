import React from "react"
import LandingPage from './pages/LandingPage'
import EventProvider from "./Organizer/EventContext/EventContext"
import UserProvider from "./User/UserContext/UserContext"

function App() {

  return (
    <>
    <UserProvider>
      <EventProvider>
        <LandingPage />
      </EventProvider>
      </UserProvider>
    </>
  )
}

export default App
