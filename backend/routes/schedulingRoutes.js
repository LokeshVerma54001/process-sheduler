const express = require("express");
const router = express.Router();


const { sjf, fcfs, rr, priority } = require("../controllers/shedulingController");


// Add your controllers here
router.post("/fcfs", fcfs);
router.post("/sjf", sjf);
router.post('/rr', rr);
router.post('/priority', priority);

module.exports = router;
