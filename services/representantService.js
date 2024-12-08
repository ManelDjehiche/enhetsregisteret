const axios = require('axios');
const { sequelize, Sequelize } = require("../db/sequelize");
const Representant = require('../models/representant')(sequelize, Sequelize);
const logsService = require('./logsService');

const fetchAndSyncRepresentants = async (cronJobId, entrepriseCode) => {
    try {
      const response = await axios.get(`https://data.brreg.no/enhetsregisteret/api/enheter/${entrepriseCode}/roller`);
      const representants = response.data;
  
      for (const representant of representants) {
        await Representant.upsert({
          code_type: representant.type.kode,
          description_type: representant.type.beskrivelse,
          lien_type: representant.type._links.self.href,
          numero_organisation: entrepriseCode,
          date_derniere_modification: representant.sistEndret,
          personne_est_decede: representant.roller[0]?.person.erDoed,  // Assuming the first role's person data
          a_pris_sa_retraite: representant.roller[0]?.fratraadt,        // Assuming the first role's retirement status
          ordre_d_apparition: representant.roller[0]?.rekkefolge       // Assuming the first role's order of appearance
        });
      }
    } catch (error) {
      console.error(`Error syncing representant data for entreprise ${entrepriseCode}:`, error);
    }
};
  
module.exports = {
  fetchAndSyncRepresentants,
};
