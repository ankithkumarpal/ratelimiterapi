
const SlidingWindow = require("../models/swModel");

// Rate limiting middleware
const allowRequest = async (req, res, next) => {
    const now = Date.now();
    const cutoffTime = new Date(now -  process.env.WINDOW_SIZE);

    try {
        const count = await SlidingWindow.countDocuments({ timestamp: { $gte: cutoffTime } });
        
        const newRequest = new SlidingWindow({
            timestamp: now , 
            expires: process.env.WINDOW_SIZE / 1000
        })

        await newRequest.save();

        if (count < process.env.LIMIT) {
            next();
        } else {
            res.status(200).json({ message : 'Rate limit exceeded' , timetowait :  process.env.WINDOW_SIZE , error : true});
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = allowRequest;