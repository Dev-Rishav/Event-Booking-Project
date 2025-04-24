import express from 'express';
import multer from 'multer';
import { createEvent, getEventsByOrganizer, getEventsByCategoryAndOrganizer, getEventsByCityAndOrganizer, getEventsById, getTopEventByLikes, createShow, getAllShowsOfAnEvent, getEventsByCity, getEventsByCategory, getVenueById, getAllBookingsOfAnOrganizer, getEventwiseEarningofOrganizer, getAllBookingsOfAUser, getLikedEventsByUser, likeEvent, unlikeEvent, getEventsByDateandCity, getEventsByCityAndInterest, getOngoingEventsByCity , getUpcomingEventsByCity } from "../controller/eventController.js";
import { fetchSeats , bookSeats, cancelSeatHold, generatePDFTicketFromData } from '../controller/ticketBookingController.js';
import { capturePayment, createBooking, holdSeats } from '../controller/paymentController.js';
import { createReview, getEventReviews } from '../controller/ReviewController.js';
import { getAllOrganizers, getAllUsers, getUserbyEmail } from '../controller/AdminController.js';
import { captureOrganizerSubscription, createOrganizerSubscription, createSubscriptionPlan, getAllSubscriptionPlans, getCurrentSubscriptionOfOrganizer, getSubscriptionPlanByID, setStatusActiveOfPlan, setStatusInactiveOfPlan } from '../controller/SubscriptionController.js';

const router = express.Router();

router.get('/event/:id' , getEventsByOrganizer);
router.get('/event/category/:id' , getEventsByCategoryAndOrganizer);
router.get('/event/city/:id' , getEventsByCityAndOrganizer);
router.get('/event/all/events' , getEventsByCity);
router.get('/event/all/category' , getEventsByCategory);
router.get('/event/by-date/all' , getEventsByDateandCity);
router.get(`/event/:id` , getEventsById);
router.post("/event/show/:id" , createShow);
router.get('/event/top' , getTopEventByLikes);
router.get('/event/show/:id' , getAllShowsOfAnEvent);
router.get('/event/venue/:id' , getVenueById);
router.get('/show/seats/:id' , fetchSeats);
router.get('/organizerbookings/:id' , getAllBookingsOfAnOrganizer);
router.get('/userbookings/:id' , getAllBookingsOfAUser);
router.get('/eventwiseearning/:id' , getEventwiseEarningofOrganizer)



router.get('/likedevents/:id' , getLikedEventsByUser);
router.post('/likeevent' , likeEvent);
router.post('/unlikeevent' , unlikeEvent);

router.post('/booking/hold', holdSeats);
router.post('/booking/cancel/hold', cancelSeatHold);
router.post('/show/booking/confirm' , bookSeats);


router.post('/booking/create-payment', createBooking);
router.post('/booking/capture-payment', capturePayment);
router.post('/generate-pdf' , generatePDFTicketFromData )


router.post('/admin/organizer/create-subscription', createOrganizerSubscription);
router.post('/admin/organizer/capture-subscription', captureOrganizerSubscription);
router.get('/admin/organizer/current-plan/:id' , getCurrentSubscriptionOfOrganizer);



router.get('/admin/users' , getAllUsers);
router.get('/admin/organizers' , getAllOrganizers);
router.get('/user/:id' , getUserbyEmail);

router.post('/reviews', createReview);               
router.get('/reviews/:id', getEventReviews);   


router.get('/userinterestevents/:id' , getEventsByCityAndInterest);
router.get('/ongoingevents' , getOngoingEventsByCity);
router.get('/upcomingevents' , getUpcomingEventsByCity);

router.post('/admin/plan', createSubscriptionPlan);
router.get('/admin/get-plans' , getAllSubscriptionPlans);
router.get('/admin/get-plan/:id' , getSubscriptionPlanByID);


router.patch('/admin/inactiveplan/:id' , setStatusInactiveOfPlan);
router.patch('/admin/activeplan/:id' , setStatusActiveOfPlan);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"), // Save files in 'uploads' folder
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/event", upload.single("image"), createEvent);

export default router;