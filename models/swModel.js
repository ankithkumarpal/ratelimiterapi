const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date
    }
});

const SlidingWindow = mongoose.model('SlidingWindow', RequestSchema);
module.exports = SlidingWindow;