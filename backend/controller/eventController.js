import Event from '../model/eventModel.js';
import pool from '../database/db.js';

export const getEventsByOrganizer = async(req ,res) => {
    try {
        const result = await Event.getEventsByOrganizer(req.params.id);
        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);
        return res.status(201).json({ msg: "All the events are : " , result});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const createEvent = async (req, res) => {
    // console.log(req.body);
    
    try {
        const { title, description, category, event_date, organizer_id, status} = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !description || !category || !event_date || !organizer_id) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const result = await Event.createEvent({title, description, category, event_date, organizer_id, image , status});
        
        console.log(result);
        
        return res.status(201).json({ msg: "Created new event", result });
    } catch (error) {
        console.error("Error creating event:", error); // ✅ Better error logging
        res.status(500).json({ error: "Internal server error" });
    }
}

// export const createShow = async (req, res) => {
//     // console.log(req.body);
    
//     try {
//         const { event_id , venue_id , start_time , end_time , total_seats , show_date} = req.body;
//         // const image = req.file ? `/uploads/${req.file.filename}` : null;

//         // if (!title || !description || !category || !duration || !organizer_id) {
//         //     return res.status(400).json({ error: "All fields are required" });
//         // }

//         const result = await Event.createShowForAnEvent({event_id , venue_id , start_time , end_time , total_seats , show_date});
        
//         // console.log(result);
        
//         return res.status(201).json({ msg: "Created new show : ", result });
//     } catch (error) {
//         console.error("Error creating show:", error); // ✅ Better error logging
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

export const createShow = async (req, res) => {
    // console.log(req.body);
    try {
      const { event_id, venue_id, start_time, end_time, total_seats, show_date , regular_ticket_price , vip_ticket_price } = req.body;
  
      // Step 1: Create the show
      const result = await Event.createShowForAnEvent({
        event_id, venue_id, start_time, end_time, total_seats, show_date,
      });
  
      const show_id = result.show_id; //Get the newly created show ID
    //   console.log(show_id);
      
      const generateStructuredSeats = (show_id, totalSeats) => {
        const seats = [];
        const rows = Math.ceil(totalSeats / 10); // 10 seats per row
        const vipThreshold = Math.floor(totalSeats * 0.2); // Top 20% VIP
      
        let seatCounter = 1;
      
        for (let row = 0; row < rows; row++) {
          const rowLabel = String.fromCharCode(65 + row); // A, B, C...
      
          for (let num = 1; num <= 10 && seatCounter <= totalSeats; num++) {
            const seat_number = `${rowLabel}${num}`; // like A1, A2...
            const isVIP = seatCounter <= vipThreshold;
            const seat_category = isVIP ? "VIP" : "Regular";
            const price = isVIP ? vip_ticket_price : regular_ticket_price;
      
            seats.push({
              seat_number,
              show_id,
              seat_category,
              price,
              status: "available",
            });
      
            seatCounter++;
          }
        }
      
        return seats;
      };

      const generatedSeats = generateStructuredSeats(show_id, total_seats);
      await Event.insertGeneratedSeats(generatedSeats);

      return res.status(201).json({ msg: "Created new show : ", result });
    //   return res.status(201).json({ message: "Show and seats created successfully!", show_id });
    } catch (error) {
      console.error("Error creating show and seats:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  

export const getAllShowsOfAnEvent = async(req ,res) => {
    // console.log(req.body.event_id);
    
    try {
        const result = await Event.getAllShowsOfAnEvent(req.params.id);
        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);
        return res.status(201).json({ msg: "All the shows are : " , result});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getEventsByCategoryAndOrganizer = async(req ,res) => {
    try {
        const result = await Event.getEventsByCategoryAndOrganizer(req.body.category , req.params.id);
        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);
        
        return res.status(201).json({ msg: "All the events of given category are : " , result});
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getEventsByCityAndOrganizer = async(req ,res) => {
    try {
        const result = await Event.getEventsByCityAndOrganizer(req.body.city , req.params.id);
        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);
        
        return res.status(201).json({ msg: "All the events of given city are : " , result});
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getEventsByCity = async(req ,res) => {
    const { city } = req.query;
    try { 
        const result = await Event.getEventsByCity(city);
        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);
        
        return res.status(201).json({ msg: "All the events of given city are : " , result});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getEventsById = async(req ,res) => {
    // console.log(req.params);
    try {
        const result = await Event.getEventsById(req.params.id);
        if(result.length === 0){
            return res.status(401).json({ error: "No events available" });
        }
        console.log(result);
        
        return res.status(200).json({ msg: "All the events of given city are : " , result});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getTopEventByLikes = async(req,res) => {
    // console.log(req.body.city);
    
    try {
        const result = await Event.getTopEventByLikes();
        if(result.length === 0){
            return res.status(401).json({ error: "No events available" });
        }
        console.log(result);
        return res.status(200).json({ msg: "All top 5 the events of given city are : " , result});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getEventsByCategory = async(req ,res) => {
    const { city, category } = req.query;
    try { 
        const result = await Event.getEventsByCategory(city , category);
        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);
        
        return res.status(201).json({ msg: "All the events of given category are : " , result});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getEventsByDateandCity = async(req ,res) => {
    const { city, event_date } = req.query;
    try { 
        const result = await Event.getEventsByDateandCity(city , event_date);
        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        // console.log(result);
        
        return res.status(201).json({ msg: "All the events of given category are : " , result});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getVenueById = async (req, res) => {
    try {
        const venue_id  = req.params.id;

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

export const getAllBookingsOfAnOrganizer = async(req,res) => {
    const organizer_id = req.params.id;
    try {
        const result = await Event.getAllBookingsOfAnOrganizer(organizer_id);
        if(!result){
            return res.status(401).json({ error: "No bookings available" });
        }
        return res.json({msg :"All bookings are : " , result});
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllBookingsOfAUser = async(req,res) => {
    const user_id = req.params.id;
    try {
        const result = await Event.getAllBookingsOfAUser(user_id);
        if(!result){
            return res.status(401).json({ error: "No bookings available" });
        }
        return res.json({msg :"All bookings are : " , result});
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getEventwiseEarningofOrganizer = async(req,res) => {
    const organizer_id = req.params.id;
    try {
        const result = await Event.getEventwiseEarningofOrganizer(organizer_id);
        if(!result){
            return res.status(401).json({ error: "No earnings available" });
        }
        return res.json({msg :"All earnings are : " , result});
    } catch (error) {
        console.error("Error fetching earnings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const likeEvent = async(req,res) => {
    const user_id = req.body.user_id;
    const event_id = req.body.event_id;
    try {
        const result = await Event.likeEvent(user_id , event_id);
        await pool.query(
            `UPDATE events SET likes_count = likes_count + 1 WHERE event_id = $1`,
            [event_id]
        );

        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        return res.json({msg :"All liked events are : " , result});
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const unlikeEvent = async(req,res) => {
    const user_id = req.body.user_id;
    const event_id = req.body.event_id;
    try {
        const result = await Event.unlikeEvent(user_id , event_id);
        await pool.query(`UPDATE events SET likes_count = GREATEST(likes_count - 1, 0) WHERE event_id = $1`, [event_id]);

        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        return res.json({msg :"All liked events are : " , result});
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getLikedEventsByUser = async(req,res) => {
    const user_id = req.params.id;
    try {
        const result = await Event.getLikedEventsByUser(user_id);
        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        return res.json({msg :"All liked events are : " , result});
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// export const searchEvents = async (req, res) => {
//     try {
//       const { city, category, date } = req.query;
  
//       // Base query with correct joins using shows
//       let query = `
//         SELECT 
//           DISTINCT e.event_id, 
//           e.title, 
//           e.description, 
//           e.category, 
//           e.event_date, 
//           e.organizer_id, 
//           e.image, 
//           e.likes_count, 
//           e.status, 
//           e.created_at, 
//           v.name AS venue_name, 
//           v.city
//         FROM events e
//         JOIN shows s ON e.event_id = s.event_id
//         JOIN venues v ON s.venue_id = v.venue_id
//         WHERE 1=1
//       `;
  
//       const params = [];
  
//       // Dynamically add filters
//       if (city) {
//         query += ` AND v.city = $${params.length + 1}`;
//         params.push(city);
//       }
  
//       if (category) {
//         query += ` AND e.category = $${params.length + 1}`;
//         params.push(category);
//       }
  
//       if (date) {
//         query += ` AND e.event_date = $${params.length + 1}`;
//         params.push(date);
//       }
  
//       query += ` ORDER BY e.event_date`;
  
//       const result = await pool.query(query, params);
  
//       if (result.rows.length === 0) {
//         return res.status(404).json({ message: 'No events found matching your criteria' });
//       }
  
//       return res.status(200).json({ result: result.rows });
//     } catch (error) {
//       return res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
//   };
  