'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HistoryCronJob extends Model {
    static associate(models) {
      // Define association here if needed (e.g., with HistoryUpdates)
    }
  }

  HistoryCronJob.init({
    job_name: DataTypes.STRING,
    start_time: DataTypes.TIMESTAMP,
    end_time: DataTypes.TIMESTAMP,
    status: DataTypes.STRING,
    error_message: DataTypes.TEXT,
    created_at: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'HistoryCronJob',
  });

  return HistoryCronJob;
};
