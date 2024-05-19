
const SlidingWindow = require("../models/swModel");

// Rate limiting middleware
const allowRequest = async (req, res, next) => {
    const now = Date.now();
    const cutoffTime = now -  process.env.WINDOW_SIZE;

    res.status(200).json({ message : "reached in sliding window request" , timetowait :  process.env.WINDOW_SIZE , error : true});
    // next();
    return ;

    try {
        const count = await SlidingWindow.countDocuments({ timestamp: { $gte: cutoffTime } });
        
        const newRequest = new SlidingWindow({
            timestamp: now
        })

        await newRequest.save();

        if (count < process.env.LIMIT) {
            next();
        } else {
            res.status(200).json({ message : 'Rate limit exceeded' , timetowait :  process.env.WINDOW_SIZE , error : true});
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

module.exports = allowRequest;