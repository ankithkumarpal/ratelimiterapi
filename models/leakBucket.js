// models/leakBucket.js

const mongoose = require('mongoose');

const leakyBucketSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true,
        unique: true
    },
    tokens: {
        type: Number,
        required: true,
        default: 5
    },
    capacity: {
        type: Number,
        required: true,
        default: 5
    },
    lastLeakTime: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const LeakyBucket = mongoose.model('LeakyBucket', leakyBucketSchema);

module.exports = LeakyBucket;
