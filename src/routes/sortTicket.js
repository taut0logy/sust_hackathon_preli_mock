const express = require('express');
const router = express.Router();
const { classifyTicket } = require('../controllers/ticketController');

router.post('/sort-ticket', classifyTicket);

module.exports = router;
