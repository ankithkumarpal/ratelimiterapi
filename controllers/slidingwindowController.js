const router = require("express").Router();

router.get('/rate-limiter', (req, res) => {
    res.status(200).json({ message : 'Api hit successfull...' , timetowait :  null , error : false});
});

module.exports = router;

