require('dotenv').config(); // Load environment variables
const express = require('express'); // Import express
const cronJobService = require('./services/cronJobService'); // Import cron job service

const app = express();
const port = process.env.SERVER_PORT || 7070;

app.listen(port, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1); // Exit process with error
  } else {
    console.log(`App listening at http://localhost:${port}`);
    
    // Ensure daily cron job is initialized after server starts
    try {
      cronJobService.dailyCronJob();
      console.log('Daily cron job initialized successfully.');
    } catch (cronErr) {
      console.error('Failed to initialize daily cron job:', cronErr);
    }
  }
});
