import Ticket from '../model/ticketBookingModel.js';
import redisClient from '../database/Redis.js';
import pool from '../database/db.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';


// export const holdSeats = async (req, res) => {
//   const { show_id, seats, userId } = req.body;

//   try {
//     for (const seat of seats) {
//       const redisKey = `hold:${show_id}:${seat}`;
//       const existingHold = await redisClient.get(redisKey);

//       if (existingHold) {
//         return res.status(409).json({ message: `Seat ${seat} is already held.` });
//       }

//       await redisClient.setEx(redisKey, 300, userId);
//     }

//     res.status(200).json({ message: "Seats held successfully for 5 minutes." });
//   } catch (err) {
//     res.status(500).json({ message: "Error holding seats", error: err.message });
//   }
// };

export const cancelSeatHold = async (req, res) => {
  const { showId, seatNumber, userId } = req.body;

  if (!showId || !seatNumber || !userId) {
    return res.status(400).json({ message: "showId, seatNumber, and userId are required." });
  }

  const key = `hold:${showId}:${seatNumber}:${userId}`;

  try {
    const isHeld = await redisClient.exists(key);

    if (!isHeld) {
      return res.status(404).json({ message: "Seat hold not found or already expired." });
    }

    await redisClient.del(key);
    res.status(200).json({ message: "Seat hold cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling seat hold:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const bookSeats = async(req,res) => {
  const { show_id, seats, userId } = req.body;
  try {
    for (const seat of seats) {
      const redisKey = `hold:${show_id}:${seat}`;
      const heldBy  = await redisClient.get(redisKey);
      

      if(heldBy !== userId )
      {
        throw new Error(`Seat ${seat} is not held by you or hold expired.`);
      }
    }
    await pool.query("BEGIN");

    for (const seat of seats) {
      const lockQuery = `
        SELECT * FROM seats 
        WHERE show_id = $1 AND seat_number = $2 
        FOR UPDATE
      `;
      const resl = await pool.query(lockQuery, [show_id, seat]);

      if (resl.rowCount === 0 || resl.rows[0].status !== "available") {
        throw new Error(`Seat ${seat} is already booked or invalid.`);
      }

      const result = await Ticket.bookSeat(show_id, seat);
    }
    await pool.query("COMMIT");

     // Cleanup Redis holds
     for (const seat of seats) {
      const redisKey = `hold:${show_id}:${seat}`;
      await redisClient.del(redisKey);
    }

    return res.status(200).json({ message: 'Booking confirmed!'});
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(400).json({ message: err.message });
  }
}


export const fetchSeats = async(req,res) => {
  try {
    const show_id = req.params.id;
    const result = await Ticket.fetchSeats(show_id);
    if(!result){
      return res.status(401).json({ error: "No tickets available" });
  }
   return res.json({msg : "tickets are" , result });
  }catch (err) {
    res.status(400).json({ message: err.message });
  }
}

  


export const generatePDFTicketFromData = async (req, res) => {
  try {
    const { 
      booking_id,
      event_title,
      show_date,
      start_time,
      end_time,
      username,
      user_email,
      seat_number,
      seat_category,
      price,
      booking_time,
      payment_status
    } = req.body;

    if (!booking_id || !event_title) {
      return res.status(400).json({ error: 'Missing required booking data' });
    }

    // Create PDF
    const doc = new PDFDocument({ size: 'A4', margin: 20 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking_id}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Add styling variables
    const primaryColor = '#4f46e5'; // Indigo
    const secondaryColor = '#ef4444'; // Red

    // Header with ticket icon and title
    doc.fontSize(16)
       .fillColor(primaryColor)
       .text('EVENT TICKET', { align: 'center' });
    
    doc.fontSize(24)
       .fillColor(secondaryColor)
       .text('🎟', { align: 'center' })
       .moveDown(0.5);

    // Event details section
    doc.fontSize(12)
       .fillColor('#000000')
       .text(`Event: ${event_title}`, { paragraphGap: 5 })
       .text(`Date: ${new Date(show_date).toLocaleDateString()}`)
       .text(`Time: ${start_time} - ${end_time}`)
       .moveDown(0.5);

    // User details
    doc.text(`Attendee: ${username}`)
       .text(`Email: ${user_email}`)
       .moveDown(0.5);

    // Ticket details table
    doc.font('Helvetica-Bold')
       .fillColor(primaryColor)
       .text('TICKET DETAILS', { paragraphGap: 3 })
       .font('Helvetica')
       .fillColor('#000000');

    // Create a simple table
    const tableTop = doc.y;
    const col1 = 20;
    const col2 = 100;

    // Table headers
    doc.font('Helvetica-Bold')
       .text('Category', col1, tableTop)
       .text('Details', col2, tableTop)
       .font('Helvetica');

    // Table rows
    let y = tableTop + 20;
    const rowHeight = 20;

    const addRow = (label, value) => {
      doc.text(label, col1, y)
         .text(value, col2, y);
      y += rowHeight;
    };

    addRow('Seat Number:', seat_number);
    addRow('Seat Category:', seat_category);
    addRow('Price:', `₹${price}`);
    addRow('Status:', payment_status.toUpperCase());

    // Footer
    doc.moveDown(1)
       .fontSize(8)
       .fillColor('#666666')
       .text(`Booking ID: ${booking_id}`, { paragraphGap: 2 })
       .text(`Issued on: ${new Date().toLocaleString()}`)
       .moveDown(0.5)
       .fontSize(10)
       .fillColor(primaryColor)
       .text('Thank you for your booking!', { align: 'center' });

    // Add security features
    doc.opacity(0.1)
       .fillColor('#000000')
       .fontSize(60)
       .text('VALID', { align: 'center', rotation: 30 })
       .opacity(1);

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate ticket',
      details: error.message 
    });
  }
};