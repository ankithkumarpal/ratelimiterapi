const DEFAULT_EXPIRES = 10;
const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        // expires: (process.env.WINDOW_SIZE ? process.env.WINDOW_SIZE / 1000 : DEFAULT_EXPIRES)
    }
});

const SlidingWindow = mongoose.model('SlidingWindow', RequestSchema);
module.exports = SlidingWindow;