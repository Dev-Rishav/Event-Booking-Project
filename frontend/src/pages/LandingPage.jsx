// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import Home from '../Home';
// import HeaderUser from '../components/HeaderUser';
// import Signup from './SignUp';
// import Login from './Login';
// import Sidebar from '../Organizer/components/Sidebar';
// import OrganizerHome from '../Organizer/pages/OrganizerHome';
// import Events from '../Organizer/pages/Events';
// import Bookings from '../Organizer/pages/Bookings';
// import FeedbackReviews from '../Organizer/pages/FeedbackReviews';
// import Notifications from '../Organizer/pages/Notifications';
// import Profile from '../Organizer/pages/Profile';
// import Revenue from '../Organizer/pages/Revenue';

// const LandingPage = () => {

//     const token = Cookies.get("token");

//     return (
//         <>
//             <Router>
//             { token ? <Sidebar /> : <HeaderUser /> }
//                 <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/Signup" element={<Signup />} />
//                     <Route path="/Login" element={<Login />} />
//                     <Route path="/OrganizerHome" element={<OrganizerHome />} />
//                     <Route path="/Events" element={<Events />} />
//                     <Route path="/Bookings" element={<Bookings />} />
//                     <Route path="/FeedbackReviews" element={<FeedbackReviews/>} />
//                     <Route path="/Profile" element={<Profile />} />
//                     <Route path="/Revenue" element={<Revenue />} />
//                     <Route path="/Notifications" element={<Notifications />} />
//                 </Routes>
//             </Router>
//         </>
//     )
// }

// export default LandingPage

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Common Components
import Home from '../Home';
import HeaderUser from '../components/HeaderUser';
import Signup from './SignUp';
import Login from './Login';

// Organizer Components
import OrganizerLayout from '../components/OrganizerLayout';
import OrganizerHome from '../Organizer/pages/OrganizerHome';
import Events from '../Organizer/pages/Events';
import Bookings from '../Organizer/pages/Bookings';
import FeedbackReviews from '../Organizer/pages/FeedbackReviews';
import Notifications from '../Organizer/pages/Notifications';
import Profile from '../Organizer/pages/Profile';
import Revenue from '../Organizer/pages/Revenue';
import EventDetails from '../Organizer/components/EventDetails';
import Footer from '../components/Footer';
import CreateEvent from '../Organizer/components/CreateEvent';

// Admin Components
// import AdminSidebar from '../Admin/components/Sidebar';
// import AdminDashboard from '../Admin/pages/AdminDashboard';
// import ManageUsers from '../Admin/pages/ManageUsers';
// import SiteSettings from '../Admin/pages/SiteSettings';

// User Components
import UserLayout from '../components/UserLayout';
import UserDashboard from '../User/UserDashboard';
import UserBookings from '../User/UserBookings';
import UserProfile from '../User/UserProfile';
import LikedEvents from '../User/LikedEvents';
import UserNotifications from '../User/UserNotifications'
import ShowList from '../User/ShowList';
import CreateShows from '../Organizer/components/CreateShows';
import TicketBookingPage from '../User/TicketBookingPage';

// Protected Route Component
const ProtectedRoute = ({ element, role }) => {
    const token = Cookies.get("token");
    const userRole = Cookies.get("role"); // Get user role from cookies

    if (!token) return <Navigate to="/login" replace />;
    if (role && userRole !== role) return <Navigate to="/" replace />;

    return element;
};

const LandingPage = () => {
    const token = Cookies.get("token");
    const role = Cookies.get("role"); // Role: "user", "admin", "organizer"

    return (
        <Router>
            {/* {token ? (role === "organizer" ? <OrganizerLayout /> : <HeaderUser />) : <HeaderUser />} */}
            {/* {!token || role !== "user" ? <HeaderUser /> : null}*/}
            {!token || role !== "organizer" ? <HeaderUser /> : null} 

            <div className="p-4">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />

                    {/* Organizer Routes (All under OrganizerLayout) */}
                    <Route path="/organizer" element={<ProtectedRoute element={<OrganizerLayout />} role="organizer" />}>
                        <Route path="home" element={<OrganizerHome />} />
                        <Route path="events" element={<Events />} />
                        <Route path="bookings" element={<Bookings />} />
                        <Route path="revenue" element={<Revenue />} />
                        <Route path="feedback-reviews" element={<FeedbackReviews />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="events/event-details" element={<EventDetails />} />
                        <Route path="events/create-event" element={<CreateEvent />} />
                        <Route path="events/create-show/:eventId" element={<CreateShows />} />
                    </Route>

                    {/* Admin Routes */}
                    {/* <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} role="admin" />} />
                    <Route path="/admin/manage-users" element={<ProtectedRoute element={<ManageUsers />} role="admin" />} />
                    <Route path="/admin/site-settings" element={<ProtectedRoute element={<SiteSettings />} role="admin" />} /> */}

                    {/* User Routes */}
                    <Route path="/user" element={<ProtectedRoute element={<UserLayout />} role="user" />}>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path='profile' element={<UserProfile />} />
                    <Route path='bookings' element={<UserBookings />} />
                    <Route path='notifications' element={<UserNotifications />} />
                    <Route path='likedevents' element={<LikedEvents />} />
                    <Route path='showlist' element={<ShowList />}  />
                    <Route path='ticket-booking/:show_id' element={<TicketBookingPage />} />
                    </Route>
                    
                </Routes>
            </div>
            <Footer />
        </Router>
    );
};

export default LandingPage;
