
const RateLimitEntry = require("../models/tokenBucket");

const tokenBucketMiddleware = async (req, res, next) => {
    try {
        const maxTokens = parseInt(process.env.MAX_TOKENS);
        const refillRate = parseFloat(process.env.REFILL_RATE); // Refill rate in tokens per second

        // Find or create rate limit entry for the current user or IP address
        let entry = await RateLimitEntry.findOne({ key: req.ip });

        if (!entry) {
            entry = await RateLimitEntry.create({
                key: req.ip,
                tokens: maxTokens,
                lastRefillTime: Date.now(),
            });
        }

        // Calculate tokens available based on refill rate and time passed since last refill
        const lastRefillTime = entry.lastRefillTime instanceof Date ? entry.lastRefillTime.getTime() : Date.parse(entry.lastRefillTime);
        const now = Date.now();
        const timePassed = now - lastRefillTime;
        
       
        if (timePassed >= 10000) {
            const tokensToAdd = Math.floor(timePassed / 10000) * refillRate * maxTokens;
            entry.tokens = Math.min(entry.tokens + tokensToAdd, maxTokens);
            entry.lastRefillTime = now; // Update last refill time
        }
        
        // Check if there are enough tokens to allow the request
        if (entry.tokens >= 1) {
            entry.tokens -= 1; 
            await entry.save(); 
            next(); 
        } else {
            res.status(200).json({ message : 'Rate limit exceeded' , timetowait :  process.env.WINDOW_SIZE , error : true});
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = tokenBucketMiddleware;
