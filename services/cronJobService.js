// cronJobService.js or fetchEntreprisesCron.js
const cron = require('node-cron');
const entrepriseService = require('./entrepriseService');
const etablissementService = require('./etablissementService');
const formeJuridiqueService = require('./formeJuridiqueService');
const municipaliteService = require('./municipaliteService');
const representantService = require('./representantService');
const personneService = require('./personneService');
const organisationFormeService = require('./organisationEntrepriseFormeService');
const organisationEtablissementFormeService = require('./organisationEtablissementFormeService');
const logsService = require('./logsService');
 
const dailyCronJob = () => {
    cron.schedule('0 0 * * *', async () => {
        const jobName = 'fetch-and-sync-entreprises';
        const cronJobObject = await logsService.logJobHistory(jobName, 'running', '', ''); // Log job start
        try {
          // Collect data and perform updates
          console.log('Running Cron job...');
        
          entrepriseService.fetchAndSyncEntreprises(cronJobObject.id);
          etablissementService.fetchAndSyncEtablissements(cronJobObject.id);
          formeJuridiqueService.fetchAndSyncFormesJuridique(cronJobObject.id);
          municipaliteService.fetchAndSyncMunicipalites(cronJobObject.id);
          organisationFormeService.fetchAndSyncOrganisationFormes(cronJobObject.id);
          organisationEtablissementFormeService.fetchAndSyncOrganisationEtablissementFormes(cronJobObject.id);
          
          // Log success with updated table names
          await logsService.logJobHistory(jobName, 'success', 'entreprises');
        } catch (error) {
          await logsService.logJobHistory(jobName, 'failure', '', error.message); // Log failure
        }
      });
}

const cronJobService = {
    dailyCronJob
}

module.exports = cronJobService;