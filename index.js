const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slidingWindowRouter = require('./controllers/slidingwindowController');
const tokenBucketRouter = require('./controllers/tokenBucket')
const slidingWindowLimiter = require('./middleware/swRatelimiter');
const tokenBucketLimiter = require('./middleware/tokenBucketLimiter');
const leakyBucketLimiter = require('./middleware/LeakyBucketLimiter');
const leakyBucketController = require('./controllers/leakyBucketController');

const cors = require('cors');

dotenv.config(); // Load environment variables from .env file


app.use(cors());
// CONNECT TO MONGO
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});


app.use('/sliding-window' ,slidingWindowLimiter , slidingWindowRouter);
app.use('/token-bucket' ,tokenBucketLimiter , tokenBucketRouter);
app.use('/leaky-bucket' ,leakyBucketLimiter , leakyBucketController);


// Start the Express server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
