const axios = require("axios");
const { sequelize, Sequelize } = require("../db/sequelize");
const Representant = require("../models/representant")(sequelize, Sequelize);
const logsService = require("./logsService");

const fetchAndSyncRepresentants = async (cronJobId, entrepriseCode) => {
  var resultRows = await logsService.getLogHistory(cronJobId, "representant");
  var previousNewRows = resultRows.newRows;
  var previousUpdatedRows = resultRows.updatedRows;
  var newRows = 0;
  var updatedRows = 0;
  try {
    // Fetch the data from the API
    const response = await axios.get(
      `https://data.brreg.no/enhetsregisteret/api/enheter/${entrepriseCode}/roller`
    );
    const representants = response?.data?.rollegrupper || []; // Access `data` property first

    // Iterate over the representants and upsert data
    for (const representant of representants) {
        const [updateRepresentant, created] = await Representant.upsert({
            code_type: representant.type.kode,
            description_type: representant.type.beskrivelse,
            lien_type: representant.type._links.self.href,
            numero_organisation: entrepriseCode,
            date_derniere_modification: representant.sistEndret,
            date_naissance: representant.roller[0]?.person?.fodselsdato || null,
            prenom: representant.roller[0]?.person?.navn?.fornavn || null,
            deuxieme_prenom: representant.roller[0]?.person?.navn?.mellomnavn || null,
            nom: representant.roller[0]?.person?.navn?.etternavn || null,
            est_decede: representant.roller[0]?.person?.erDoed || false,
            a_quitte: representant.roller[0]?.fratraadt || false,
            ordre_apparition: representant.roller[0]?.rekkefolge || null,
          });
          
      // Track successful upserts
      if (created) {
        newRows++;
      } else {
        updatedRows++;
      }

      await logsService.logUpdateHistory(
        cronJobId,
        "representant",
        "running ...",
        (previousNewRows + newRows),
        (previousUpdatedRows + updatedRows)
    );
      
    }

    await logsService.logUpdateHistory(
        cronJobId,
        "representant",
        "done",
        (previousNewRows + newRows),
        (previousUpdatedRows + updatedRows)
    );
  } catch (error) {
    // Log the error with the error message
    await logsService.logUpdateHistory(
      cronJobId,
      "representant",
      "failed",
      (previousNewRows + newRows),
      (previousUpdatedRows + updatedRows),
      true,
      `Error syncing representant data for entreprise ${entrepriseCode}:`,
      error.message
    );
    console.error(
      `Error syncing representant data for entreprise ${entrepriseCode}:`,
      error.message
    );
  }
};

module.exports = {
  fetchAndSyncRepresentants,
};
