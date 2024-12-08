const axios = require('axios');
const { sequelize, Sequelize } = require("../db/sequelize");
const OrganisationForme = require('../models/organisation_forme')(sequelize, Sequelize);
const logsService = require('./logsService');

const fetchAndSyncOrganisationFormes = async (cronJobId) => {
  try {
    const response = await axios.get('https://data.brreg.no/enhetsregisteret/api/organisasjonsformer/enheter');
    const organisationFormes = response.data; // Assuming the response is an array

    let newRows = 0;
    let updatedRows = 0;

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
      } catch (err) {
        console.error(`Error upserting organisation forme with code ${organisationForme.kode}:`, err);
        await logsService.logUpdateHistory(cronJobId, 'organisation_forme', 0, 0, true, err.message);
      }
    }

    // Log success history after processing all organisationFormes
    if (newRows > 0 || updatedRows > 0) {
      await logsService.logUpdateHistory(cronJobId, 'organisation_forme', newRows, updatedRows);
    }

  } catch (error) {
    console.error('Error syncing organisation forme data:', error);
    await logsService.logUpdateHistory(cronJobId, 'organisation_forme', 0, 0, true, error.message);
  }
};

module.exports = {
  fetchAndSyncOrganisationFormes,
};
