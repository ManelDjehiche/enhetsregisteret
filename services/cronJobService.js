// cronJobService.js or fetchEntreprisesCron.js
const cron = require('node-cron');
const entrepriseService = require('./entrepriseService');
const etablissementService = require('./etablissementService');
const formeJuridiqueService = require('./formeJuridiqueService');
const municipaliteService = require('./municipaliteService');
const organisationFormeService = require('./organisationEntrepriseFormeService');
const organisationEtablissementFormeService = require('./organisationEtablissementFormeService');
const logsService = require('./logsService');
 
const dailyCronJob = async () => {
    const now = new Date();
    const jobName =  'cronjob';
    const todayIdentifier = `${jobName}-${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    const cronJobId = await logsService.logJobHistory(todayIdentifier, 'running ...', '', ''); // Log job start
    try {
      // Collect data and perform updates
      console.log('Running Cron job...', cronJobId);
    
        await entrepriseService.fetchAndSyncEntreprises(cronJobId);
        await etablissementService.fetchAndSyncEtablissements(cronJobId);
        await formeJuridiqueService.fetchAndSyncFormesJuridique(cronJobId);
        await municipaliteService.fetchAndSyncMunicipalites(cronJobId);
        await organisationFormeService.fetchAndSyncOrganisationFormes(cronJobId);
        await organisationEtablissementFormeService.fetchAndSyncOrganisationEtablissementFormes(cronJobId);
      
      // Log success with updated table names
      await logsService.logJobHistory(todayIdentifier, 'done');
    } catch (error) {
      await logsService.logJobHistory(todayIdentifier, 'failed', error.message); // Log failure
    }
    // cron.schedule('0 0 * * *', async () => {
    //   });
}

const cronJobService = {
    dailyCronJob
}

module.exports = cronJobService;