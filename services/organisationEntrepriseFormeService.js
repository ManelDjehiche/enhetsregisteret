const axios = require('axios');
const { sequelize, Sequelize } = require("../db/sequelize");
const OrganisationForme = require('../models/organisation_forme')(sequelize, Sequelize);
const logsService = require('./logsService');

const fetchAndSyncOrganisationFormes = async (cronJobId) => {
  var newRows = 0;
  var updatedRows = 0;
  try {
    await logsService.logUpdateHistory(cronJobId, 'organisation_forme', 'start', newRows, updatedRows);
    console.log('\n ================= fetch OrganisationFormes')
    const response = await axios.get('https://data.brreg.no/enhetsregisteret/api/organisasjonsformer/enheter');
    const organisationFormes = response?.data?._embedded?.organisasjonsformer || []; // Assuming the response is an array

    for (const organisationForme of organisationFormes) {
      try {
        const [updatedOrganisationForme, created] = await OrganisationForme.upsert({
          code_forme: organisationForme.kode,
          description: organisationForme.beskrivelse,
          lien: organisationForme._links.self.href,
        });

        // Track successful upserts
        if (created) {
          newRows++;
        } else {
          updatedRows++;
        }

        await logsService.logUpdateHistory(cronJobId, 'organisation_forme', 'running ...', newRows, updatedRows);

      } catch (err) {
        console.error(`Error upserting organisation forme with code ${organisationForme.kode}:`, err);
        await logsService.logUpdateHistory(cronJobId, 'organisation_forme', 'failed', newRows, updatedRows, true, err.message);
      }
    }

    // Log success history after processing all organisationFormes
    await logsService.logUpdateHistory(cronJobId, 'organisation_forme', 'done', newRows, updatedRows);
    return;
  } catch (error) {
    console.error('Error syncing organisation forme data:', error);
    await logsService.logUpdateHistory(cronJobId, 'organisation_forme', 'failed', newRows, updatedRows, true, error.message);
    return;
  }
};

module.exports = {
  fetchAndSyncOrganisationFormes,
};
