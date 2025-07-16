
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Common Components
import Home from '../Home';
import HeaderUser from '../components/HeaderUser';
import Signup from './SignUp';
import Login from './Login';
import Footer from '../components/Footer';

// Organizer Components
import OrganizerLayout from '../components/OrganizerLayout';
import OrganizerHome from '../Organizer/pages/OrganizerHome';
import Events from '../Organizer/pages/Events';
import Bookings from '../Organizer/pages/Bookings';
import Notifications from '../Organizer/pages/Notifications';
import Profile from '../Organizer/pages/Profile';
import Revenue from '../Organizer/pages/Revenue';
import EventDetails from '../Organizer/components/EventDetails';
import CreateEvent from '../Organizer/components/CreateEvent';
import CreateShows from '../Organizer/components/CreateShows';
import Subscription from '../Organizer/pages/Subscription';
import SubscriptionPlan from '../Organizer/pages/SubscriptionPlan';
import PayPalSubscriptionReturn from '../Organizer/pages/PaypalSubscriptionReturn';
import PaypalSubscriptionCancel from '../Organizer/pages/PaypalSubscriptionCancel';

// User Components
import UserLayout from '../components/UserLayout';
import UserDashboard from '../User/UserDashboard';
import UserBookings from '../User/UserBookings';
import UserProfile from '../User/UserProfile';
import UserNotifications from '../User/UserNotifications';
import ShowList from '../User/ShowList';
import TicketBookingPage from '../User/TicketBookingPage';
import PaypalReturn from '../User/PaypalReturn';
import PaypalCancel from '../User/PaypalCancel';


//Admin Components
import AdminLayout from '../components/AdminLayout';
import AdminHome from '../Admin/AdminHome';
import AdminRevenue from '../Admin/AdminRevenue';
import AdminOrganizers from '../Admin/AdminOrganizers';
import AdminUsers from '../Admin/AdminUsers';
import AdminProfile from '../Admin/AdminProfile';
import AdminUsersDetails from '../Admin/AdminUsersDetails';
import AdminOrganizersDetails from '../Admin/AdminOrganizersDetails';
import UserEventReviews from '../User/ UserEventReviews';
import CreateAdminSubscription from '../Admin/CreateAdminSubscription';
import AdminSubscriptionPlans from '../Admin/AdminSubscriptionPlans';


// Protected Route Component
const ProtectedRoute = ({ element, role }) => {
    const token = Cookies.get("token");
    const userRole = Cookies.get("role");

    if (!token) return <Navigate to="/login" replace />;
    if (role && userRole !== role) return <Navigate to="/" replace />;
    return element;
};

const PublicRoute = ({ element }) => {
    const token = Cookies.get("token");
    const userRole = Cookies.get("role");

    if (token) {
        // User is logged in, redirect based on role
        if (userRole === 'organizer') return <Navigate to="/organizer/home" replace />;
        if (userRole === 'user') return <Navigate to="/user/dashboard" replace />;
        if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    }

    return element;
};

// AutoRedirect component
const AutoRedirect = () => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (!token) return <Navigate to="/" replace />;

    if (role === 'organizer') return <Navigate to="/organizer/revenue" replace />;
    if (role === 'user') return <Navigate to="/user/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />; // in case you add admin routes

    return <Navigate to="/" replace />;
};

const LandingPage = () => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    return (
        <div className="flex flex-col min-h-screen">
            <Router>
                {!token ? <HeaderUser /> : null}
                
                <div className="p-4 flex-grow">
                    <Routes>
                        {/* Auto Redirect after login */}
                        <Route path="/redirect" element={<AutoRedirect />} />

                        {/* Public Routes */}
                        <Route path="/" element={<PublicRoute element={<Home />} />} />
                        <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
                        <Route path="/login" element={<PublicRoute element={<Login />} />} />

                        {/* Organizer Routes */}
                        <Route path="/organizer" element={<ProtectedRoute element={<OrganizerLayout />} role="organizer" />}>
                            <Route path="home" element={<OrganizerHome />} />
                            <Route path="events" element={<Events />} />
                            <Route path="bookings" element={<Bookings />} />
                            <Route path="revenue" element={<Revenue />} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="events/event-details" element={<EventDetails />} />
                            <Route path="events/create-event" element={<CreateEvent />} />
                            <Route path="events/create-show/:eventId" element={<CreateShows />} />
                            <Route path='subscription' element={<Subscription />} />
                            <Route path='subscription/:planId' element={<SubscriptionPlan />} />
                            <Route path="paypal-subscription-return" element={<PayPalSubscriptionReturn />} />
                            <Route path='paypal-subscription-cancel' element={<PaypalSubscriptionCancel />} />

                        </Route>

                        {/* User Routes */}
                        <Route path="/user" element={<ProtectedRoute element={<UserLayout />} role="user" />}>
                            <Route path="dashboard" element={<UserDashboard />} />
                            <Route path="profile" element={<UserProfile />} />
                            <Route path="bookings" element={<UserBookings />} />
                            <Route path="notifications" element={<UserNotifications />} />
                            <Route path="showlist" element={<ShowList />} />
                            <Route path="ticket-booking/:show_id" element={<TicketBookingPage />} />
                            <Route path="paypal-return" element={<PaypalReturn />} />
                            <Route path="paypal-cancel" element={<PaypalCancel />} />
                            <Route path='reviews/:event_id' element={<UserEventReviews />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute element={<AdminLayout />} role="admin" />}>
                            <Route path="dashboard" element={<AdminHome />} />
                            <Route path='revenue' element={<AdminRevenue />} />
                            <Route path='profile' element={<AdminProfile />} />
                            <Route path='subscription' element={<AdminSubscriptionPlans />} />
                            <Route path='create-subscription' element={<CreateAdminSubscription />} />
                            <Route path='organizers' element={<AdminOrganizers />} />
                            <Route path='users' element={<AdminUsers />} />
                            <Route path='users/:email' element={<AdminUsersDetails />} />
                            <Route path='organizers/:email' element={<AdminOrganizersDetails />} />
                        </Route>
                    </Routes>
                </div>
                {/* <Footer /> */}
            </Router>
        </div>
    );
};

export default LandingPage;

