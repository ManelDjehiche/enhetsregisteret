const axios = require('axios');
const { sequelize, Sequelize } = require("../db/sequelize");
const Etablissement = require('../models/etablissement')(sequelize, Sequelize);
const logsService = require('./logsService');
const representantService = require('./representantService');

const fetchAndSyncEtablissements = async (cronJobId) => {
    try {
      let page = 0;
      let size = 100;
      let hasMoreData = true;
      let newRows = 0;
      let updatedRows = 0;
  
      while (hasMoreData) {
        try {
          const response = await axios.get(`https://data.brreg.no/enhetsregisteret/api/underenheter?page=${page}&size=${size}`);
          const etablissements = response.data._embedded.underenheter;
          const totalElements = response.data.page.totalElements;
  
          if (etablissements.length === 0) {
            hasMoreData = false;
          } else {
            if ((page + 1) * size > totalElements) {
              size = totalElements - page * size;
            }
  
            for (const etablissement of etablissements) {
                const [updatedEtablissement, created] = await Etablissement.upsert({
                    numero_etablissement: etablissement.organisasjonsnummer,
                    nom: etablissement.navn,
                    code_forme_juridique: etablissement.organisasjonsform.kode,
                    description_forme_juridique: etablissement.organisasjonsform.beskrivelse,
                    lien_forme_juridique: etablissement.organisasjonsform._links.self.href,
                    date_inscription: etablissement.registreringsdatoEnhetsregisteret,
                    secteur_activite_code: etablissement.naeringskode1.kode,
                    secteur_activite_description: etablissement.naeringskode1.beskrivelse,
                    email: etablissement.epostadresse,
                    telephone_mobile: etablissement.mobil,
                    date_debut: etablissement.oppstartsdato,
                    adresse_physique: etablissement.beliggenhetsadresse.adresse.join(' '), // If it's an array of addresses
                    pays_physique: etablissement.beliggenhetsadresse.land,
                    code_pays_physique: etablissement.beliggenhetsadresse.landkode,
                    code_postal_physique: etablissement.beliggenhetsadresse.postnummer,
                    ville_physique: etablissement.beliggenhetsadresse.poststed,
                    commune_physique: etablissement.beliggenhetsadresse.kommune,
                    numero_commune_physique: etablissement.beliggenhetsadresse.kommunenummer,
                    lien_etablissement: etablissement._links.self.href,
                    lien_organisation_parente: etablissement._links.overordnetEnhet.href,
                  });
  
              if (created) {
                newRows++;
              } else {
                updatedRows++;
              }
            }
    
            // Log the results
            await logsService.logUpdateHistory(cronJobId, 'etablissement', newRows, updatedRows);

            newRows = 0;
            updatedRows = 0;
            page++;
        
  
            if (!response.data._links.next) {
              hasMoreData = false;
            }
          }

        } catch (err) {
          console.error(`Error fetching data for page ${page}:`, err);
          await logsService.logUpdateHistory(cronJobId, 'etablissement', 0, 0, true, err.message);
        }
      }
    } catch (error) {
      console.error('Error syncing etablissement data:', error);
      await logsService.logUpdateHistory(cronJobId, 'etablissement', 0, 0, true, error.message);
    }
  };
  

module.exports = {
  fetchAndSyncEtablissements,
};
