const router = require("express").Router();
const TokenBucket = require("../models/tokenBucket");

router.get('/rate-limiter', (req, res) => {
    res.status(200).json({ message : 'Api hit successfull...' , timetowait :  null , error : false});
});

module.exports = router;