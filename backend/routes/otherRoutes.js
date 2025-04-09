import express from 'express';
import multer from 'multer';
import { createEvent, getEventsByOrganizer, getEventsByCategoryAndOrganizer, getEventsByCityAndOrganizer, getEventsById, getTopEventByLikes, createShow, getAllShowsOfAnEvent, getEventsByCity, getEventsByCategory, getVenueById } from "../controller/eventController.js";
import { fetchSeats } from '../controller/ticketBookingController.js';

const router = express.Router();

router.get('/event/:id' , getEventsByOrganizer);
router.get('/event/category/:id' , getEventsByCategoryAndOrganizer);
router.get('/event/city/:id' , getEventsByCityAndOrganizer);
router.get('/event/cities/all/:id' , getEventsByCity);
router.get('/event/all/category/:id' , getEventsByCategory);
router.get(`/event/:id` , getEventsById);
router.post("/event/show/:id" , createShow);
router.get('/event/top' , getTopEventByLikes);
router.get('/event/show/:id' , getAllShowsOfAnEvent);
router.get('/event/venue/:id' , getVenueById);
router.get('/show/seats/:id' , fetchSeats);
// router.post('/show/booking/hold' , holdSeats );
// router.post('/show/booking/confirm' , bookSeats);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"), // Save files in 'uploads' folder
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/event", upload.single("image"), createEvent);

export default router;