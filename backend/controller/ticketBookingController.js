import Ticket from '../model/ticketBookingModel.js';
import redisClient from '../database/Redis.js';
import pool from '../database/db.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';


export const holdSeats = async (req, res) => {
  const { show_id, seats, userId } = req.body;

  try {
    for (const seat of seats) {
      const redisKey = `hold:${show_id}:${seat}`;
      const existingHold = await redisClient.get(redisKey);

      if (existingHold) {
        return res.status(409).json({ message: `Seat ${seat} is already held.` });
      }

      await redisClient.setEx(redisKey, 300, userId);
    }

    res.status(200).json({ message: "Seats held successfully for 5 minutes." });
  } catch (err) {
    res.status(500).json({ message: "Error holding seats", error: err.message });
  }
};

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

  


export const generateTicketPDF = async (req, res) => {
  const { bookingDetails } = req.body;

  if (!bookingDetails) {
    return res.status(400).json({ message: "Booking details are required." });
  }

  const {
    // userName,
    userEmail,
    // eventTitle,
    // venue,
    // showTime,
    // showDate,
    // seatNumbers,
    ticketId,
    // bookingTime
  } = bookingDetails;

  try {
    const doc = new PDFDocument();

    const pdfPath = path.resolve(`./tickets/ticket-${ticketId}.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // PDF content
    doc.fontSize(20).text("🎟 Event Ticket", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Ticket ID: ${ticketId}`);
    // doc.text(`Name: ${userName}`);
    doc.text(`Email: ${userEmail}`);
    // doc.text(`Event: ${eventTitle}`);
    // doc.text(`Venue: ${venue}`);
    // doc.text(`Date: ${showDate}`);
    // doc.text(`Time: ${showTime}`);
    // doc.text(`Seats: ${seatNumbers.join(', ')}`);
    // doc.text(`Booking Time: ${bookingTime}`);

    doc.moveDown();
    doc.text("Please bring a valid ID along with this ticket.", { align: "center" });

    doc.end();

    writeStream.on('finish', () => {
      res.download(pdfPath, `ticket-${ticketId}.pdf`, (err) => {
        if (err) {
          console.error("Error sending PDF:", err);
          res.status(500).json({ message: "Error generating ticket." });
        } else {
          // Optional: Clean up PDF file after sending
          fs.unlink(pdfPath, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting PDF:", unlinkErr);
          });
        }
      });
    });

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
