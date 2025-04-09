import Booking from "../model/BookingRevenueModel";


export const getAllUserWithBooking = async(req,res) => {
    try {
        const result = await Booking.getAllUserWithBooking();
        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        return res.status(201).json({ msg: "All the events are : " , result});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getBookingDetailsByBookId = async(req,res) => {
    try {
        const result = await Booking.getBookingDetailsByBookId(req.params.id);
        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
        return res.status(201).json({ msg: "All the events are : " , result});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getTotalRevenue = async(req,res) => {
    try {
        const result = await Booking.getTotalRevenue();
        if(!result){
            return res.status(401).json({ error: "No events available" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}