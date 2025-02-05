/**
 * testNowPayments.js
 *
 * This script tests the NowPayments integration by fetching the available currencies.
 * It loads environment variables using the dotenv module.
 */

require('dotenv').config(); // Load API key from .env

const NowPaymentsService = require('./src/payments/nowPaymentsService');

// Ensure the API key is set in the environment variables.
if (!process.env.NOWPAYMENTS_API_KEY) {
  console.error('ERROR: NOWPAYMENTS_API_KEY is not set in the .env file.');
  process.exit(1);
}

// Create an instance of the NowPaymentsService
const nowPayments = new NowPaymentsService(process.env.NOWPAYMENTS_API_KEY);

(async () => {
  try {
    // Fetch available currencies using our service module.
    const currencies = await nowPayments.getAvailableCurrencies();
    console.log('Available Currencies:', currencies);
  } catch (error) {
    console.error('Test failed with error:', error);
  }
})();