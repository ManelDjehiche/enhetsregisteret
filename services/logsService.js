const { sequelize, Sequelize } = require("../db/sequelize");
const history_cron_jobs = require("../models/history_cron_jobs")(sequelize, Sequelize);
const history_updates = require("../models/history_updates")(sequelize, Sequelize);

const logJobHistory = async (jobName, status, errorMessage = null) => {
    const now = new Date();
  
    try {
      // Check if a "running ..." job exists for the given job name
      const existingJob = await history_cron_jobs.findOne({
        where: { job_name: jobName, status: 'running ...' }
      });
  
      if (existingJob) {
        // Update the existing job
        await existingJob.update({
          status,
          end_time: now,
          error_message: errorMessage || 'No errors',
        });
        return existingJob.id; // Return the updated job
      }
  
      // Create a new job if no "running ..." job exists
      const newJob = await history_cron_jobs.create({
        job_name: jobName,
        start_time: now,
        end_time: status === 'done' || status === 'failed' ? now : null, // Null for 'running ...'
        status,
        error_message: errorMessage || 'No errors',
      });
  
      return newJob.id; // Return the newly created job
    } catch (error) {
      console.error("Error logging cron job history:", error.message);
    }
  };
  

const logUpdateHistory = async (cronJobId, tableName,status, newRows, updatedRows, has_error, error_message) => {
    try {
      const now = new Date(); // Current timestamp for manual tracking (if needed)
      await history_updates.upsert({
        cron_job_id: cronJobId,
        table_name: tableName,
        new_rows: newRows,
        updated_rows: updatedRows,
        error_occurred: has_error?? false,
        error_message: error_message?? "no error",
        status: status        
      });
      console.log(
        `Update history logged for table: ${tableName}, Cron Job ID: ${cronJobId}, Date: ${now}`
      );
    } catch (error) {
      console.error("Error logging update history:", error.message);
    }
};

const getLogHistory = async (cronJobId, tableName) => {
    try {
        // Fetching the log history entries for a specific table and cronJobId
        const logHistory = await history_updates.findOne({
            where: {
                cron_job_id: cronJobId,
                table_name: tableName
            },
            attributes: ['new_rows', 'updated_rows'] // Fetching only the newRows and updatedRows columns
        });

        if (!logHistory) {
            console.log('No history found for the given table and cronJobId.');
            return {
                newRows: 0,
                updatedRows:0
            };
        }

        // Returning the newRows and updatedRows from the log history
        return  {
            newRows: parseInt(logHistory?.dataValues?.new_rows)?? 0,
            updatedRows: parseInt(logHistory?.dataValues?.updated_rows)?? 0
        };
    } catch (error) {
        console.error('Error retrieving log history:', error.message);
        return null;
    }
};


const logsService = {
    logJobHistory,
    logUpdateHistory,
    getLogHistory
}

module.exports = logsService;