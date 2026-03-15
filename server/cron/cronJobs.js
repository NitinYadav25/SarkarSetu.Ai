const cron = require('node-cron');
const { scrapeJobs, scrapeSchemes, scrapeNotices } = require('../services/scraperService');

const initCronJobs = () => {
  console.log('[Cron] Initializing background scraping schedulers...');

  // 1. Scrape Jobs (Every 6 hours)
  // "0 */6 * * *" means at minute 0 past every 6th hour.
  cron.schedule('0 */6 * * *', async () => {
    console.log('[Cron Executing] Running 6-Hour Scheduled Task: Scrape Jobs');
    await scrapeJobs();
  });

  // 2. Scrape Schemes (Every 1 Day at Midnight)
  // "0 0 * * *" means at minute 0 past hour 0.
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron Executing] Running Daily Scheduled Task: Scrape Schemes');
    await scrapeSchemes();
  });

  // 3. Scrape Notices (Every 3 Days)
  // "0 0 */3 * *" means at minute 0 past hour 0 on every 3rd day-of-month.
  cron.schedule('0 0 */3 * *', async () => {
    console.log('[Cron Executing] Running 3-Day Scheduled Task: Scrape Notices');
    await scrapeNotices();
  });

  console.log('[Cron] All categorized schedulers are active and waiting.');
};

module.exports = initCronJobs;
