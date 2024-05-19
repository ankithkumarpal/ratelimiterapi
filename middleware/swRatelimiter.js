
const SlidingWindow = require("../models/swModel");

// Rate limiting middleware
const allowRequest = async (req, res, next) => {
    const now = Date.now();
    const cutoffTime = now - 10000;

    try {
        const count = await SlidingWindow.countDocuments({ timestamp: { $gte: cutoffTime } });
        const newRequest = new SlidingWindow({
            timestamp: now
        })

        await newRequest.save();

        if (count < 5) {
            next();
        } else {
            res.status(200).json({ message : 'Rate limit exceeded' , timetowait : 10000 , error : true});
        }
    } catch (error) {
        res.status(500).json({ error: error , message : "In catch statement" });
    }
};

module.exports = allowRequest;