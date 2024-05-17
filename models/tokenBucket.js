const mongoose = require('mongoose');

const rateLimitEntrySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true // Ensure uniqueness of the key (e.g., user ID or IP address)
    },
    tokens: {
        type: Number,
        required: true,
        min: 0 // Tokens cannot be negative
    },
    lastRefillTime: {
        type: Date,
        required: true
    }
});
const TokenBucket = mongoose.model('TokenBucket', rateLimitEntrySchema);
module.exports = TokenBucket;