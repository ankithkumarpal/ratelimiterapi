const DEFAULT_EXPIRES = 10;
const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 10
    }
});

const SlidingWindow = mongoose.model('SlidingWindow', RequestSchema);
module.exports = SlidingWindow;