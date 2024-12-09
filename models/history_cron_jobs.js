'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HistoryCronJob extends Model {
    static associate(models) {
      // Define association here if needed
    }
  }

  HistoryCronJob.init({
    job_name: DataTypes.STRING,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    status: DataTypes.STRING,
    error_message: DataTypes.TEXT,
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default
    },
  }, {
    sequelize,
    timestamps: false, // Explicitly manage timestamps
    modelName: 'history_cron_jobs',
    tableName:'history_cron_jobs'
  });

  return HistoryCronJob;
};
