const axios = require('axios');
const { sequelize, Sequelize } = require("../db/sequelize");
const Municipalite  = require('../models/municipalite')(sequelize, Sequelize);
const logsService = require('./logsService');

const fetchAndSyncMunicipalites = async (cronJobId) => {
      
    var newRows = 0;
    var updatedRows = 0;
    try {
      await logsService.logUpdateHistory(cronJobId, 'municipalite', 'start', newRows, updatedRows);
      console.log('\n ================= fetch Municipalites')
      let currentPage = 0;
      const pageSize = 50;
      let totalPages = 1;  // Initial value
  
      while (currentPage < totalPages) {
        console.log(" maneeeel")
        const response = await axios.get(`https://data.brreg.no/enhetsregisteret/api/kommuner?page=${currentPage}&size=${pageSize}`);
        const municipalites = response?.data?._embedded.kommuner || [];
  
        for (const municipalite of municipalites) {
          try {
            const [updatedMunicipalite, created] = await Municipalite.upsert({
              code_municipalite: municipalite.nummer,
              nom: municipalite.navn,
            });
  
            if (created) {
              newRows++;
            } else {
              updatedRows++;
            }
            await logsService.logUpdateHistory(cronJobId, 'municipalite', 'running ...', newRows, updatedRows);
          } catch (err) {
            console.error(`Error upserting municipalite with code ${municipalite.nummer}:`, err);
            await logsService.logUpdateHistory(cronJobId, 'municipalite', 'failed', newRows, updatedRows, true, err.message);
          }
        }
    
        // Check the pagination details and prepare for the next page if available
        totalPages = response.data.page.totalPages;
        currentPage++;
      }
      await logsService.logUpdateHistory(cronJobId, 'municipalite', 'done', newRows, updatedRows);
      return;
    } catch (error) {
      console.error('Error syncing municipalite data:', error);
      await logsService.logUpdateHistory(cronJobId, 'municipalite', 'failed', newRows, updatedRows, true, error.message);
      return;
    }
  };
  
module.exports = {
  fetchAndSyncMunicipalites,
};
