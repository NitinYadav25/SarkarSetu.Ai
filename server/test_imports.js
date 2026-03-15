try {
  console.log('Testing App Core...');
  const express = require('express');
  console.log('Express OK');
  
  console.log('Testing Models...');
  const Scheme = require('./models/Scheme');
  console.log('Scheme Model OK');
  
  console.log('Testing Scraper Service...');
  const scraper = require('./services/scraperService');
  console.log('Scraper Service OK');
  
  console.log('Testing Cron Jobs...');
  const cron = require('./cron/cronJobs');
  console.log('Cron Jobs OK');
  
  console.log('ALL NEW COMPONENTS LOADED SUCCESSFULLY.');
} catch (err) {
  console.error('CRASH DETECTED DURING IMPORT:');
  console.error(err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
}
