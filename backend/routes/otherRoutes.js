import express from 'express';
import multer from 'multer';
import { createEvent, getEventsByOrganizer, getEventsByCategoryAndOrganizer, getEventsByCityAndOrganizer, getEventsById, getTopEventByLikes, createShow, getAllShowsOfAnEvent, getEventsByCity, getEventsByCategory, getVenueById, getAllBookingsOfAnOrganizer, getEventwiseEarningofOrganizer, getAllBookingsOfAUser, getLikedEventsByUser, likeEvent, unlikeEvent, getEventsByDateandCity } from "../controller/eventController.js";
import { fetchSeats , bookSeats } from '../controller/ticketBookingController.js';
import { capturePayment, createPayment } from '../controller/paymentController.js';

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
// router.get('/event/search' , searchEvents);
// router.post('/show/booking/hold' , holdSeats );
router.post('/show/booking/confirm' , bookSeats);

router.post('/booking/create-payment', createPayment);
router.post('/booking/capture-payment', capturePayment);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"), // Save files in 'uploads' folder
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/event", upload.single("image"), createEvent);

export default router;