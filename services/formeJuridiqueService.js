const axios = require('axios');
const { sequelize, Sequelize } = require("../db/sequelize");
const FormeJuridique = require('../models/forme_juridique')(sequelize, Sequelize );
const logsService = require('./logsService');

const fetchAndSyncFormesJuridique = async (cronJobId) => {
    var newRows = 0;
    var updatedRows = 0;
    try {
      await logsService.logUpdateHistory(cronJobId, 'forme_juridique','start', newRows, updatedRows);
      console.log('\n ================= fetch FormesJuridique')
      const response = await axios.get('https://data.brreg.no/enhetsregisteret/api/organisasjonsformer');
      const formesJuridique = response?.data?._embedded?.organisasjonsformer || [];
  
      for (const formeJuridique of formesJuridique) {
        try {
          const [updatedFormeJuridique, created] = await FormeJuridique.upsert({
            code_forme_juridique: formeJuridique.kode,
            description: formeJuridique.beskrivelse,
            lien: formeJuridique._links?.self?.href || NULL,
          });
  
          // Track successful upserts
          if (created) {
            newRows++;
          } else {
            updatedRows++;
          }
          await logsService.logUpdateHistory(cronJobId, 'forme_juridique','running ...', newRows, updatedRows);

        } catch (err) {
          console.error(`Error upserting forme juridique with code ${formeJuridique.code_forme_juridique}:`, err);
          await logsService.logUpdateHistory(cronJobId, 'forme_juridique','failed', newRows, updatedRows, true, err.message);
        }
      }
  
      // Log success history after processing all formesJuridiques
      await logsService.logUpdateHistory(cronJobId, 'forme_juridique', 'done', newRows, updatedRows);
      return;
    } catch (error) {
      console.error('Error syncing forme juridique data:', error);
      await logsService.logUpdateHistory(cronJobId, 'forme_juridique', 'failed', newRows, updatedRows, true, error.message);
      return;
    }
};  
  
module.exports = {
  fetchAndSyncFormesJuridique,
};
