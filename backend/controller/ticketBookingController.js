import Ticket from '../model/ticketBookingModel.js';
import redis from '../database/Redis.js';
import pool from '../database/db.js';


// export const holdSeats = async(req,res) => {
//     const { show_id, seats, userId } = req.body;
//     try {
//       for (const seat of seats) {
//         const redisKey = `hold:${show_id}:${seat}`;
//         const heldBy = await redis.get(redisKey);
//         if (heldBy) return res.status(400).json({ message: `Seat ${seat} is already held.` });
//         await redis.set(redisKey, userId, 'EX', 300);
//       }
//       res.status(200).json({ message: 'Seats held for 5 minutes.' });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
// }

// export const bookSeats = async(req,res) => {
//   const { show_id, seats, userId } = req.body;
// //   const client = await pool.connect();
//   try {
//     // await client.query('BEGIN');
//     for (const seat of seats) {
//       const redisKey = `hold:${show_id}:${seat}`;
//       const heldBy = await redis.get(redisKey);
//       if (heldBy !== userId) throw new Error(`Seat ${seat} not held by you or expired.`);
//       const result = await Ticket.bookSeat(show_id, seat);
//       await redis.del(redisKey);
//     }
//     // await client.query('COMMIT');

//     // const ticketPath = path.join(__dirname, `../tickets/ticket-${Date.now()}.pdf`);
//     // await generateTicketPDF(userId, showId, seats, ticketPath);

//     // res.status(200).json({ message: 'Booking confirmed!', ticket: ticketPath });
//     res.status(200).json({ message: 'Booking confirmed!'});
//   } catch (err) {
//     // await client.query('ROLLBACK');
//     res.status(400).json({ message: err.message });
//   }
// }


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

// async function generateTicketPDF(userId, showId, seats, filePath) {
//     const doc = new PDFDocument();
//     const stream = fs.createWriteStream(filePath);
//     doc.pipe(stream);
//     doc.fontSize(20).text('Event Ticket', { align: 'center' });
//     doc.text(`User: ${userId}\nShow ID: ${showId}\nSeats: ${seats.join(', ')}`, { align: 'left' });
//     const qrText = `User:${userId},Show:${showId},Seats:${seats.join(',')}`;
//     const qrImage = await QRCode.toDataURL(qrText);
//     doc.image(qrImage, { fit: [100, 100], align: 'center' });
//     doc.end();
//     return new Promise(resolve => stream.on('finish', resolve));
//   }
  
//   exports.releaseExpiredSeats = async () => {
//     const keys = await redis.keys('hold:*');
//     for (const key of keys) {
//       const isHeld = await redis.ttl(key);
//       if (isHeld <= 0) {
//         const [_, showId, seat] = key.split(':');
//         await SeatModel.releaseSeat(showId, seat);
//       }
//     }
//   };Once the user pays, finalize the booking in the database using PostgreSQL transaction to avoid concurrency issues.