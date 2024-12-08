const cronJobService = require('./services/cronJobService');

console.log({config})
// Initialize Sequelize


cronJobService.dailyCronJob();