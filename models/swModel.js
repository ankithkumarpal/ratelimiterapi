const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        expires: process.env.WINDOW_SIZE / 1000 // TTL index expiration time in seconds
    }
});

const SlidingWindow = mongoose.model('SlidingWindow', RequestSchema);
module.exports = SlidingWindow;