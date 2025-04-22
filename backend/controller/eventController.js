import Event from '../model/eventModel.js';
import pool from '../database/db.js';
import { io } from '../index.js';
import redisClient from '../database/Redis.js';


export const getEventsByOrganizer = async (req, res) => {
    try {
        const result = await Event.getEventsByOrganizer(req.params.id);
        if (!result) {
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);
        return res.status(201).json({ msg: "All the events are : ", result });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const createEvent = async (req, res) => {
    // console.log(req.body);
    const { title, description, category, organizer_id, start_date, end_date, venue_id } = req.body;

    try {
        const organizer = await pool.query('SELECT free_events_remaining, current_subscription_id FROM users WHERE email = $1', [organizer_id]);

        if (organizer.free_events_remaining > 0) {
            await pool.query('UPDATE users SET free_events_remaining = free_events_remaining - 1 WHERE email = $1', [organizer_id]);

            const image = req.file ? `/uploads/${req.file.filename}` : null;

            if (!title || !description || !category || !organizer_id || !start_date || !end_date || !venue_id) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const result = await Event.createEvent({ title, description, category, organizer_id, image, start_date, end_date, venue_id });
            io.emit('new-event', {
                message: `A new event ${title} has been created!`,
                event: {
                    title,
                    start_date
                }
            });
            return res.status(201).json({ msg: "Created new event", result });
        }

         // Check if organizer has active subscription
        if (organizer.current_subscription_id) {
            const subscription = await pool.query(
              `SELECT s.*, p.max_events 
               FROM organizer_subscriptions s
               JOIN subscription_plans p ON s.plan_id = p.plan_id
               WHERE s.subscription_id = $1 AND s.end_date > NOW() AND s.payment_status = 'completed'`,
              [organizer.current_subscription_id]
            );

            if (subscription) {
                const eventsCount = await pool.query(
                  'SELECT COUNT(*) FROM events WHERE organizer_email = $1 AND created_at BETWEEN $2 AND $3',
                  [organizer_id, subscription.start_date, subscription.end_date]
                );
                
                if (eventsCount < subscription.max_events) {
                    const image = req.file ? `/uploads/${req.file.filename}` : null;

                    if (!title || !description || !category || !organizer_id || !start_date || !end_date || !venue_id) {
                        return res.status(400).json({ error: "All fields are required" });
                    }
        
                    const result = await Event.createEvent({ title, description, category, organizer_id, image, start_date, end_date, venue_id });
                    io.emit('new-event', {
                        message: `A new event ${title} has been created!`,
                        event: {
                            title,
                            start_date
                        }
                    });
                    return res.status(201).json({ msg: "Created new event", result });
                }
              }
            }
            throw new Error('No available event slots. Please upgrade your subscription.');
    } catch (error) {
        console.error("Error creating event:", error); 
        res.status(500).json({ error: "Internal server error" });
    }
}


export const createShow = async (req, res) => {
    try {
        const {
            event_id,
            venue_id,
            start_time,
            end_time,
            show_date,
            plan_name
        } = req.body;

        const result = await Event.createShowAndSeats({
            event_id,
            venue_id,
            start_time,
            end_time,
            show_date,
            plan_name
        });

        res.status(201).json({
            message: 'Show and seats created successfully',
            show_id: result.show_id,
            total_seats: result.total_seats
        });
    } catch (error) {
        console.error('Error creating show:', error.message);
        res.status(500).json({ error: error.message });
    }
}



export const getAllShowsOfAnEvent = async (req, res) => {
    // console.log(req.body.event_id);

    try {
        const result = await Event.getAllShowsOfAnEvent(req.params.id);
        if (!result) {
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);
        return res.status(201).json({ msg: "All the shows are : ", result });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getEventsByCategoryAndOrganizer = async (req, res) => {
    try {
        const result = await Event.getEventsByCategoryAndOrganizer(req.body.category, req.params.id);
        if (!result) {
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);

        return res.status(201).json({ msg: "All the events of given category are : ", result });
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Internal server error" });
    }
}


export const getEventsByCityAndOrganizer = async (req, res) => {
    try {
        const result = await Event.getEventsByCityAndOrganizer(req.body.city, req.params.id);
        if (!result) {
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);

        return res.status(201).json({ msg: "All the events of given city are : ", result });
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Internal server error" });
    }
}

export const getEventsByCity = async (req, res) => {
    const { city } = req.query;
    try {
        const result = await Event.getEventsByCity(city);
        if (!result) {
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);

        return res.status(201).json({ msg: "All the events of given city are : ", result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getEventsById = async (req, res) => {
    // console.log(req.params);
    try {
        const result = await Event.getEventsById(req.params.id);
        if (result.length === 0) {
            return res.status(401).json({ error: "No events available" });
        }
        console.log(result);

        return res.status(200).json({ msg: "All the events of given city are : ", result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getTopEventByLikes = async (req, res) => {
    // console.log(req.body.city);

    try {
        const result = await Event.getTopEventByLikes();
        if (result.length === 0) {
            return res.status(401).json({ error: "No events available" });
        }
        console.log(result);
        return res.status(200).json({ msg: "All top 5 the events of given city are : ", result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getEventsByCategory = async (req, res) => {
    const { city, category } = req.query;
    try {
        const result = await Event.getEventsByCategory(city, category);
        if (!result) {
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);

        return res.status(201).json({ msg: "All the events of given category are : ", result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getEventsByDateandCity = async (req, res) => {
    const { city, event_date } = req.query;
    try {
        const result = await Event.getEventsByDateandCity(city, event_date);
        if (!result) {
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);

        return res.status(201).json({ msg: "All the events of given category are : ", result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getVenueById = async (req, res) => {
    try {
        const venue_id = req.params.id;

        if (!venue_id) {
            return res.status(400).json({ error: "Venue ID is required" });
        }

        const venue = await Event.getVenueById(venue_id);

        if (!venue) {
            return res.status(404).json({ error: "Venue not found" });
        }

        res.status(200).json(venue);
    } catch (error) {
        console.error("Error fetching venue:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllBookingsOfAnOrganizer = async (req, res) => {
    const organizer_id = req.params.id;
    try {
        const result = await Event.getAllBookingsOfAnOrganizer(organizer_id);
        if (!result) {
            return res.status(401).json({ error: "No bookings available" });
        }
        return res.json({ msg: "All bookings are : ", result });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllBookingsOfAUser = async (req, res) => {
    const user_id = req.params.id;
    try {
        const result = await Event.getAllBookingsOfAUser(user_id);
        if (!result) {
            return res.status(401).json({ error: "No bookings available" });
        }
        return res.json({ msg: "All bookings are : ", result });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getEventwiseEarningofOrganizer = async (req, res) => {
    const organizer_id = req.params.id;
    try {
        const result = await Event.getEventwiseEarningofOrganizer(organizer_id);
        if (!result) {
            return res.status(401).json({ error: "No earnings available" });
        }
        return res.json({ msg: "All earnings are : ", result });
    } catch (error) {
        console.error("Error fetching earnings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const likeEvent = async (req, res) => {
    const user_id = req.body.user_id;
    const event_id = req.body.event_id;
    try {
        const result = await Event.likeEvent(user_id, event_id);
        await pool.query(
            `UPDATE events SET likes_count = likes_count + 1 WHERE event_id = $1`,
            [event_id]
        );

        if (!result) {
            return res.status(401).json({ error: "No events available" });
        }
        return res.json({ msg: "All liked events are : ", result });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const unlikeEvent = async (req, res) => {
    const user_id = req.body.user_id;
    const event_id = req.body.event_id;
    try {
        const result = await Event.unlikeEvent(user_id, event_id);
        await pool.query(`UPDATE events SET likes_count = GREATEST(likes_count - 1, 0) WHERE event_id = $1`, [event_id]);

        if (!result) {
            return res.status(401).json({ error: "No events available" });
        }
        return res.json({ msg: "All liked events are : ", result });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getLikedEventsByUser = async (req, res) => {
    const user_id = req.params.id;
    try {
        // console.log(user_id);
        const result = await Event.getLikedEventsByUser(user_id);
        if (!result) {
            return res.status(401).json({ error: "No liked events available" });
        }
        return res.json({ msg: "All liked events are : ", result });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getEventsByCityAndInterest = async (req, res) => {
    const user_id = req.params.id;
    const city = req.query.city;

    if (!user_id || !city) {
        return res.status(400).json({ error: "User ID and city are required." });
    }

    try {
        const result = await Event.getEventsByCityAndInterest(user_id, city);
        res.status(200).json({ result });
    } catch (err) {
        console.error("Error fetching recommended events:", err);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const getOngoingEventsByCity = async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: "City is required." });
    }

    const redisKey = `ongoingEvents:${city.toLowerCase()}`;

    try {
        const cachedData = await redisClient.get(redisKey);
        if (cachedData) {
            //   console.log("Returning cached events for", city);
            return res.status(200).json({ result: JSON.parse(cachedData) });
        }

        const result = await Event.getOngoingEventsByCity(city);
        await redisClient.setEx(redisKey, 3600, JSON.stringify(result));

        res.status(200).json({ result });
    } catch (err) {
        console.error("Error fetching ongoing events:", err);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const getUpcomingEventsByCity = async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: "City is required." });
    }

    try {
        const result = await Event.getUpcomingEventsByCity(city);
        res.status(200).json({ result });
    } catch (err) {
        console.error("Error fetching ongoing events:", err);
        res.status(500).json({ error: "Internal server error." });
    }
}