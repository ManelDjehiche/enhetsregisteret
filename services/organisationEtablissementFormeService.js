const axios = require('axios');
const { sequelize, Sequelize } = require("../db/sequelize");
const OrganisationEtablissementForme = require('../models/organisation_etablissement_forme')(sequelize, Sequelize);
const logsService = require('./logsService');

const fetchAndSyncOrganisationEtablissementFormes = async (cronJobId) => {
    try {
      const response = await axios.get('https://data.brreg.no/enhetsregisteret/api/organisasjonsformer/underenheter');
      const organisationEtablissementFormes = response.data; // Assuming the response is an array
  
      let newRows = 0;
      let updatedRows = 0;
  
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
        } catch (err) {
          console.error(`Error upserting organisation etablissement forme with code ${organisationEtablissementForme.kode}:`, err);
          await logsService.logUpdateHistory(cronJobId, 'organisation_etablissement_forme', 0, 0, true, err.message);
        }
      }
  
      // Log success history after processing all organisationEtablissementFormes
      if (newRows > 0 || updatedRows > 0) {
        await logsService.logUpdateHistory(cronJobId, 'organisation_etablissement_forme', newRows, updatedRows, 'update');
      }
  
    } catch (error) {
      console.error('Error syncing organisation etablissement forme data:', error);
      await logsService.logUpdateHistory(cronJobId, 'organisation_etablissement_forme', 0, 0, true, error.message);
    }
  };
  
  

module.exports = {
  fetchAndSyncOrganisationEtablissementFormes,
};
