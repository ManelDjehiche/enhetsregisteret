const history_cron_jobs = require("../models/history_cron_jobs");
const history_updates = require("../models/history_updates");

const logJobHistory = async (jobName, status, updatedTables, errorMessage = null) => {
    const now = new Date();
    try {
      const cronJob = await history_cron_jobs.create({
        job_name: jobName,
        start_time: now,
        end_time: now,
        status,
        error_message: errorMessage || 'No errors'
      });
      return cronJob.id; // Return the ID of the created log for tracking
    } catch (error) {
      console.error("Error logging cron job history:", error.message);
    }
};  

const logUpdateHistory = async (cronJobId, tableName, newRows, updatedRows, operationType) => {
    try {
      const now = new Date(); // Current timestamp for manual tracking (if needed)
      await history_updates.create({
        cron_job_id: cronJobId,
        table_name: tableName,
        new_rows: newRows,
        updated_rows: updatedRows,
        operation_type: operationType, 
        created_at: now,              
      });
      console.log(
        `Update history logged for table: ${tableName}, Operation: ${operationType}, Cron Job ID: ${cronJobId}, Date: ${now}`
      );
    } catch (error) {
      console.error("Error logging update history:", error.message);
    }
};

const logsService = {
    logJobHistory,
    logUpdateHistory
}

module.exports = logsService;