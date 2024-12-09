'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class HistoryUpdate extends Model {
      static associate(models) {
        HistoryUpdate.belongsTo(models.HistoryCronJob, {
          foreignKey: 'cron_job_id',
          as: 'cronJob',
        });
      }
    }
  
    HistoryUpdate.init({
      cron_job_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'HistoryCronJobs',
          key: 'id',
        },
        allowNull: false,
      },
      table_name: DataTypes.STRING,
      status: DataTypes.STRING,
      new_rows: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      updated_rows: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      error_occurred: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,  // To track if an error occurred
      },
      error_message: {
        type: DataTypes.TEXT,  // To store the error details
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'history_tables',
      tableName:'history_tables'
    });
  
    return HistoryUpdate;
  };
  
