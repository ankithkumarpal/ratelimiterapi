const SlidingWindow = require("../models/swModel");

// Rate limiting middleware
const allowRequest = async (req, res, next) => {
    const now = Date.now();
    const cutoffTime = now - process.env.WINDOW_SIZE;

    try {
        const ipAddress = req.ip;

        // Count documents within the window for the specific IP address
        const count = await SlidingWindow.countDocuments({ 
            ipAddress: ipAddress,
            timestamp: { $gte: cutoffTime } 
        });

        const newRequest = new SlidingWindow({
            ipAddress: ipAddress,
            timestamp: new Date(now)
        });
        await newRequest.save();

        if (count < process.env.Limit) {
            next();
        } else {
            // Rate limit exceeded
            res.status(200).json({ 
                message: 'Rate limit exceeded for Ip' + ipAddress, 
                timetowait: process.env.TIMETOWAIT, 
                error: true 
            });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

module.exports = allowRequest;
