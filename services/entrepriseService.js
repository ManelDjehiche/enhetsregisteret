const axios = require('axios'); // You can use axios or another HTTP client
const { sequelize, Sequelize } = require("../db/sequelize");
const Entreprise = require('../models/entreprise')(sequelize, Sequelize); // Import Sequelize model
const logsService = require('./logsService');
const representantService = require('./representantService');

const fetchAndSyncEntreprises = async (cronJobId) => {
    try {
      let page = 0;
      let size = 100;
      let hasMoreData = true;
      let newRows = 0;
      let updatedRows = 0;
  
      while (hasMoreData) {
        try {
          const response = await axios.get(`https://data.brreg.no/enhetsregisteret/api/enheter?page=${page}&size=${size}`);
          const entreprises = response.data._embedded.enheter;
          const totalElements = response.data.page.totalElements;
  
          if (entreprises.length === 0) {
            hasMoreData = false;
          } else {
            if ((page + 1) * size > totalElements) {
              size = totalElements - page * size;
            }
  
            for (const entreprise of entreprises) {
              const [updatedEntreprise, created] = await Entreprise.upsert({
                numero_organisation: entreprise.organisasjonsnummer,
                nom: entreprise.navn,
                code_forme_juridique: entreprise.formeJuridiskeenhet?.kode || null,
                description_forme_juridique: entreprise.formeJuridiskeenhet?.beskrivelse || null,
                lien_forme_juridique: entreprise.formeJuridiskeenhet?._links?.self?.href || null,
                site_web: entreprise.website || null,
                adresse_postale: entreprise.forretningsadresse?.adresse || null,
                pays_postal: entreprise.forretningsadresse?.landkode || null,
                code_pays_postal: entreprise.forretningsadresse?.landkode || null, // Assuming the same country code as pays_postal
                code_postal_postal: entreprise.forretningsadresse?.postnummer || null,
                ville_postale: entreprise.forretningsadresse?.poststed || null,
                commune_postale: entreprise.forretningsadresse?.kommune || null,
                numero_commune_postale: entreprise.forretningsadresse?.kommuneNummer || null,
                adresse_physique: entreprise.physicaladdress?.adresse || null,
                pays_physique: entreprise.physicaladdress?.landkode || null,
                code_pays_physique: entreprise.physicaladdress?.landkode || null,
                code_postal_physique: entreprise.physicaladdress?.postnummer || null,
                ville_physique: entreprise.physicaladdress?.poststed || null,
                commune_physique: entreprise.physicaladdress?.kommune || null,
                numero_commune_physique: entreprise.physicaladdress?.kommuneNummer || null,
                date_inscription: entreprise.stiftelsesdato || null,
                enregistre_au_registre_commercial: entreprise.registrertIFrivilligRegister || false,
                secteur_activite_code: entreprise.sektor?.kode || null,
                secteur_activite_description: entreprise.sektor?.beskrivelse || null,
                email: entreprise.email || null,
                telephone_mobile: entreprise.telefonnummer || null,
                date_creation: entreprise.stiftelsesdato || null,
                code_secteur_institutionnel: entreprise.sektorInstitusjonelt?.kode || null,
                description_secteur_institutionnel: entreprise.sektorInstitusjonelt?.beskrivelse || null,
                enregistre_dans_le_registre_volontaire: entreprise.registrertIFrivilligRegister || false,
                enregistre_dans_le_registre_stiftelsen: entreprise.registrertIStiftelseRegister || false,
                enregistre_dans_le_registre_partis: entreprise.registrertIPartierRegister || false,
                en_cours_de_liquidation: entreprise.liquidert || false,
                en_cours_de_dissolution: entreprise.dissolutert || false,
                type_langue: entreprise.språk || null,
                activite: entreprise.aktivitet || null,
                date_inscription_registre_volontaire: entreprise.stiftelsesdato || null,
                lien_entreprise: entreprise._links?.self?.href || null
              });
  
              if (created) {
                newRows++;
              } else {
                updatedRows++;
              }

              // Sync representants for each entreprise
              await representantService.fetchAndSyncRepresentants(cronJobId, entreprise.organisasjonsnummer);
            }

            // Log the results
            await logsService.logUpdateHistory(cronJobId, 'entreprise', newRows, updatedRows);

            newRows = 0;
            updatedRows = 0;
            page++;
  
            if (!response.data._links.next) {
              hasMoreData = false;
            }
          }
        } catch (err) {
          console.error(`Error fetching data for page ${page}:`, err);
          await logsService.logUpdateHistory(cronJobId, 'entreprise', 0, 0, true, err.message);
        }
      }
    } catch (error) {
      console.error('Error syncing entreprise data:', error);
      await logsService.logUpdateHistory(cronJobId, 'entreprise', 0, 0, true, error.message);
    }
  };
  


module.exports = {
  fetchAndSyncEntreprises,
};
