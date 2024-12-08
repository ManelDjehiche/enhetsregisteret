const axios = require('axios');
const { sequelize, Sequelize } = require("../db/sequelize");
const FormeJuridique = require('../models/forme_juridique')(sequelize, Sequelize );
const logsService = require('./logsService');

const fetchAndSyncFormesJuridique = async (cronJobId) => {
    try {
      const response = await axios.get('https://data.brreg.no/enhetsregisteret/api/organisasjonsformer');
      const formesJuridique = response.data;
  
      let newRows = 0;
      let updatedRows = 0;
  
      for (const formeJuridique of formesJuridique) {
        try {
          const [updatedFormeJuridique, created] = await FormeJuridique.upsert({
            code_forme_juridique: formeJuridique.code_forme_juridique,
            description: formeJuridique.description,
            lien: formeJuridique.lien,
          });
  
          // Track successful upserts
          if (created) {
            newRows++;
          } else {
            updatedRows++;
          }
        } catch (err) {
          console.error(`Error upserting forme juridique with code ${formeJuridique.code_forme_juridique}:`, err);
          await logsService.logUpdateHistory(cronJobId, 'forme_juridique', 0, 0, true, err.message);
        }
      }
  
      // Log success history after processing all formesJuridiques
      if (newRows > 0 || updatedRows > 0) {
        await logsService.logUpdateHistory(cronJobId, 'forme_juridique', newRows, updatedRows, 'update');
      }
  
    } catch (error) {
      console.error('Error syncing forme juridique data:', error);
      await logsService.logUpdateHistory(cronJobId, 'forme_juridique', 0, 0, true, error.message);
    }
};  
  
module.exports = {
  fetchAndSyncFormesJuridique,
};
