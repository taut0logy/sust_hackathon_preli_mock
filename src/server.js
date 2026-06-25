const app = require('./app');
const config = require('./config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Sort ticket: POST http://localhost:${PORT}/sort-ticket`);
});
