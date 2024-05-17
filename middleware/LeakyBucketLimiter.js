// middlewares/checkTokens.js

const LeakyBucket = require("../models/leakBucket");

const checkTokens = async (req, res, next) => {
    try {
        const ipAddress = req.ip; 

        let bucket = await LeakyBucket.findOne({ ipAddress });

        // If bucket doesn't exist for the IP address, create a new one
        if (!bucket) {
            bucket = await LeakyBucket.create({
                ipAddress,
                tokens: 2, 
                capacity: 5,
                lastLeakTime: Date.now()
            });
        }

        const now = Date.now();
        const timePassed = now - bucket.lastLeakTime;

        // Calculate tokens to add based on the leak rate (e.g., 1 token per 10 seconds)
        const tokensToAdd = Math.floor(timePassed / 10000); // 1 token per 10 seconds

        // Refill tokens if needed, but don't exceed the maximum capacity
        const refillAmount = Math.min(bucket.capacity - bucket.tokens, tokensToAdd);

        // Calculate updated tokens
        const updatedTokens = Math.min(bucket.tokens + refillAmount, bucket.capacity);
       
        // Update the bucket with the calculated refillAmount and current time
        const updatedBucket = await LeakyBucket.findOneAndUpdate(
            { ipAddress },
            { $set: { tokens: updatedTokens, lastLeakTime: now } }, // Update both tokens and lastLeakTime
            { new: true }
        );

        if (updatedBucket.tokens > 0) {
            const updatedTokens = updatedBucket.tokens - 1;
            // Update the bucket with the decremented token count and current time
            await LeakyBucket.findOneAndUpdate(
                { ipAddress },
                { $set: { tokens: updatedTokens, lastLeakTime: now } },
                { new: true }
            );
            next();
        } else {
            res.status(200).json({ message : 'Rate limit exceeded' , timetowait :  process.env.WINDOW_SIZE , error : true});
        }
    } catch (error) {
        res.status(500).json({ message : 'Internal server error' , timetowait :  process.env.WINDOW_SIZE , error : true});
    }
};

module.exports = checkTokens;
