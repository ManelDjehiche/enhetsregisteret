const axios = require('axios');
const { sequelize, Sequelize } = require("../db/sequelize");
const Municipalite  = require('../models/municipalite')(sequelize, Sequelize);
const logsService = require('./logsService');

const fetchAndSyncMunicipalites = async (cronJobId) => {
    try {
      let currentPage = 0;
      const pageSize = 50;
      let totalPages = 1;  // Initial value
  
      while (currentPage < totalPages) {
        const response = await axios.get(`https://data.brreg.no/enhetsregisteret/api/kommuner?page=${currentPage}&size=${pageSize}`);
        const municipalites = response.data._embedded.kommuner;
  
        let newRows = 0;
        let updatedRows = 0;
  
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
          } catch (err) {
            console.error(`Error upserting municipalite with code ${municipalite.nummer}:`, err);
            await logsService.logUpdateHistory(cronJobId, 'municipalite', 0, 0, true, err.message);
          }
        }
  
        if (newRows > 0 || updatedRows > 0) {
          await logsService.logUpdateHistory(cronJobId, 'municipalite', newRows, updatedRows);
        }
  
        // Check the pagination details and prepare for the next page if available
        totalPages = response.data.page.totalPages;
        currentPage++;
      }
  
    } catch (error) {
      console.error('Error syncing municipalite data:', error);
      await logsService.logUpdateHistory(cronJobId, 'municipalite', 0, 0, true, error.message);
    }
  };
  
module.exports = {
  fetchAndSyncMunicipalites,
};
