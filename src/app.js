const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health');
const sortTicketRoutes = require('./routes/sortTicket');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use(healthRoutes);
app.use(sortTicketRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    code: 'NOT_FOUND'
  });
});

app.use(errorHandler);

module.exports = app;
