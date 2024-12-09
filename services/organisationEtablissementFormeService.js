const axios = require('axios');
const { sequelize, Sequelize } = require("../db/sequelize");
const OrganisationEtablissementForme = require('../models/organisation_etablissement_forme')(sequelize, Sequelize);
const logsService = require('./logsService');

const fetchAndSyncOrganisationEtablissementFormes = async (cronJobId) => {
    var newRows = 0;
    var updatedRows = 0;
    try {
      await logsService.logUpdateHistory(cronJobId, 'organisation_etablissement_forme', 'start', newRows, updatedRows);
      console.log('\n ================= fetch OrganisationFormes Etablissment')
      const response = await axios.get('https://data.brreg.no/enhetsregisteret/api/organisasjonsformer/underenheter');
      const organisationEtablissementFormes = response?.data?._embedded?.organisasjonsformer || []; // Assuming the response is an array
  
      for (const organisationEtablissementForme of organisationEtablissementFormes) {
        try {
          const [updatedOrganisationEtablissementForme, created] = await OrganisationEtablissementForme.upsert({
            code_forme: organisationEtablissementForme.kode,
            description: organisationEtablissementForme.beskrivelse,
            lien: organisationEtablissementForme._links.self.href,
          });
  
          // Track successful upserts
          if (created) {
            newRows++;
          } else {
            updatedRows++;
          }

          await logsService.logUpdateHistory(cronJobId, 'organisation_etablissement_forme', 'running ...', newRows, updatedRows);

        } catch (err) {
          console.error(`Error upserting organisation etablissement forme with code ${organisationEtablissementForme.kode}:`, err);
          await logsService.logUpdateHistory(cronJobId, 'organisation_etablissement_forme', 'failed', newRows, updatedRows, true, err.message);
        }
      }
  
      // Log success history after processing all organisationEtablissementFormes
      await logsService.logUpdateHistory(cronJobId, 'organisation_etablissement_forme', 'done', newRows, updatedRows);
      return;
    } catch (error) {
      console.error('Error syncing organisation etablissement forme data:', error);
      await logsService.logUpdateHistory(cronJobId, 'organisation_etablissement_forme', 'failed', newRows, updatedRows, true, error.message);
      return;
    }
  };
  
  

module.exports = {
  fetchAndSyncOrganisationEtablissementFormes,
};
