const axios = require('axios');
const { sequelize, Sequelize } = require("../db/sequelize");
const Etablissement = require('../models/etablissement')(sequelize, Sequelize);
const logsService = require('./logsService');
const representantService = require('./representantService');

const fetchAndSyncEtablissements = async (cronJobId) => {
    var newRows = 0;
    var updatedRows = 0;
    try {
      await logsService.logUpdateHistory(cronJobId, 'etablissement', 'start', newRows, updatedRows);
      console.log('\n ================= fetch Etablissements')
      let page = 100;
      let size = 100;
      let hasMoreData = true;
  
      while (hasMoreData) {
        try {
          const response = await axios.get(`https://data.brreg.no/enhetsregisteret/api/underenheter?page=${page}&size=${size}`);
          const etablissements = response?.data?._embedded.underenheter || [];
          const totalElements = response?.data?.page?.totalElements || 0;

          if (etablissements.length == 0) {
            hasMoreData = false;
          } else {
            if ((page + 1) * size > totalElements) {
              size = totalElements - page * size;
            }
  
            for (const etablissement of etablissements) {
                const [updatedEtablissement, created] = await Etablissement.upsert({
                    numero_organisation: etablissement.organisasjonsnummer,
                    nom: etablissement.navn,
                    code_forme_juridique: etablissement.organisasjonsform?.kode || null,
                    description_forme_juridique: etablissement.organisasjonsform?.beskrivelse || null,
                    lien_forme_juridique: etablissement.organisasjonsform?._links?.self?.href || null,
                    site_web: etablissement.epostadresse || etablissement.website || null,
            
                    // Simplified address fields with consistent naming
                    adresse_commune: etablissement.beliggenhetsadresse?.adresse.map(item => item).join(';') || null,
                    code_pays: etablissement.beliggenhetsadresse?.landkode || null,
                    code_postal: etablissement.beliggenhetsadresse?.postnummer || null,
                    ville: etablissement.beliggenhetsadresse?.poststed || null,
                    commune: etablissement.beliggenhetsadresse?.kommune || null,
                    numero_commune: etablissement.beliggenhetsadresse?.kommunenummer || null,
            
                    date_inscription: etablissement.registreringsdatoEnhetsregisteret || null,
                    secteur_activite_code: etablissement.naeringskode1?.kode || null,
                    secteur_activite_description: etablissement.naeringskode1?.beskrivelse || null,
                    email: etablissement.epostadresse || null,
                    telephone_mobile: etablissement.mobil || null,
                    date_creation: etablissement.oppstartsdato || null,
                    lien_etablissement: etablissement._links?.self?.href || null,
                    lien_organisation_parente: etablissement._links?.overordnetEnhet?.href || null,  // Parent link
                    parent_organisation: etablissement.overordnetEnhet || null
                });
            
                if (created) {
                    newRows++;
                } else {
                    updatedRows++;
                }
        
            }
            
    
            // Log the results
            await logsService.logUpdateHistory(cronJobId, 'etablissement', 'running ...', newRows, updatedRows);
            page++;
        
  
            if (!response.data._links.next) {
              hasMoreData = false;
            }
          }
        } catch (err) {
          hasMoreData = false;
          console.error(`Error fetching data for page ${page}:`, err);
          await logsService.logUpdateHistory(cronJobId, 'etablissement', 'failed', newRows, updatedRows, true, err.message);
        }
      }
      await logsService.logUpdateHistory(cronJobId, 'etablissement', 'done', newRows, updatedRows);
      return;
    } catch (error) {
      console.error('Error syncing etablissement data:', error);
      await logsService.logUpdateHistory(cronJobId, 'etablissement', 'failed', newRows, updatedRows, true, error.message);
      return;
    }
  };
  

module.exports = {
  fetchAndSyncEtablissements,
};
