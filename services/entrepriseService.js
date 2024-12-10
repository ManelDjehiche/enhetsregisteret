const axios = require('axios'); // You can use axios or another HTTP client
const { sequelize, Sequelize } = require("../db/sequelize");
const Entreprise = require('../models/entreprise')(sequelize, Sequelize); // Import Sequelize model
const logsService = require('./logsService');
const representantService = require('./representantService');

const fetchAndSyncEntreprises = async (cronJobId) => {
    var newRows = 0;
    var updatedRows = 0;
    try {
      await logsService.logUpdateHistory(cronJobId, 'entreprise', 'start', newRows, updatedRows);
      console.log('\n ================= fetch Entreprises')
      let page = 0;
      let size = 1000;
      let hasMoreData = true;
  
      while (hasMoreData) {
        try {
          const response = await axios.get(`https://data.brreg.no/enhetsregisteret/api/enheter?page=${page}&size=${size}`);
          const entreprises = response?.data?._embedded.enheter || [];
          const totalElements = response?.data?.page?.totalElements || 0;
  
          if (entreprises.length == 0) {
            hasMoreData = false;
          } else {
            if ((page + 1) * size > totalElements) {
              size = totalElements - page * size;
            }
            for (const entreprise of entreprises) {
                const [updatedEntreprise, created] = await Entreprise.upsert({
                  numero_organisation: entreprise.organisasjonsnummer,
                  nom: entreprise.navn,
                  code_forme_juridique: entreprise.organisasjonsform?.kode || null,
                  description_forme_juridique: entreprise.organisasjonsform?.beskrivelse || null,
                  lien_forme_juridique: entreprise.organisasjonsform?._links?.self?.href || null,
                  site_web: entreprise.epostadresse || entreprise.website || null,
                  
                  // Simplified address fields
                  adresse_commune: entreprise.forretningsadresse?.adresse.map(item => item).join(';') || null,
                  code_pays: entreprise.forretningsadresse?.landkode || null,
                  code_postal: entreprise.forretningsadresse?.postnummer || null,
                  ville: entreprise.forretningsadresse?.poststed || null,
                  commune: entreprise.forretningsadresse?.kommune || null,
                  numero_commune: entreprise.forretningsadresse?.kommunenummer || null,
                  
                  date_inscription: entreprise.stiftelsesdato || null,
                  secteur_activite_code: entreprise.naeringskode1?.kode || null,
                  secteur_activite_description: entreprise.naeringskode1?.beskrivelse || null,
                  email: entreprise.epostadresse || null,
                  telephone_mobile: entreprise.mobil || null,
                  date_creation: entreprise.stiftelsesdato || null,
                  code_secteur_institutionnel: entreprise.institusjonellSektorkode?.kode || null,
                  description_secteur_institutionnel: entreprise.institusjonellSektorkode?.beskrivelse || null,
                  enregistre_dans_le_registre_volontaire: entreprise.registrertIFrivillighetsregisteret || false,  // Corrected to match the voluntary register
                  enregistre_dans_le_registre_stiftelsen: entreprise.registrertIStiftelsesregisteret || false,  // Corrected to match the foundation register
                  enregistre_dans_le_registre_partis: entreprise.registrertIPartiregisteret || false,  // Corrected to match the party register
                  enregistre_au_registre_commercial: entreprise.registrertIMvaregisteret || false,  // Corrected to match the commercial register
                  en_cours_de_liquidation: entreprise.liquidert || false,
                  en_cours_de_dissolution: entreprise.dissolutert || false,
                  type_langue: entreprise.maalform || null,
                  activite: entreprise.aktivitet.map(item => item).join(';') || null,
                  date_inscription_registre_volontaire: entreprise.stiftelsesdato || null,
                  lien_entreprise: entreprise._links?.self?.href || null
                });
                
                if (created) {
                  newRows++;
                } else {
                  updatedRows++;
                }
              
                await logsService.logUpdateHistory(cronJobId, 'entreprise', 'running ...', newRows, updatedRows);
                // Sync representants for each entreprise
                await representantService.fetchAndSyncRepresentants(cronJobId, entreprise.organisasjonsnummer);
              }
              
            page++;
  
            if (!response.data._links.next) {
              hasMoreData = false;
            }
          }
        } catch (err) {
          hasMoreData = false;
          console.error(`Error fetching data for page ${page}:`, err);
          await logsService.logUpdateHistory(cronJobId, 'entreprise','failed', newRows, updatedRows, true, err.message);
        }
      }
      await logsService.logUpdateHistory(cronJobId, 'entreprise', 'done', newRows, updatedRows);
      return;
    } catch (error) {
      console.error('Error syncing entreprise data:', error);
      await logsService.logUpdateHistory(cronJobId, 'entreprise', 'failed', newRows, updatedRows, true, error.message);
      return;
    }
  };
  


module.exports = {
  fetchAndSyncEntreprises,
};
