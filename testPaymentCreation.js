/**
 * testPaymentCreation.js
 *
 * This script tests the payment creation functionality of our NowPayments integration.
 * It creates a test payment using dummy data. Before running this script, verify that your 
 * .env file includes the NOWPAYMENTS_API_KEY.
 *
 * Note: For real transactions, ensure you adjust the payment data to reflect actual values.
 */

require('dotenv').config(); // Load API key and other env variables

const NowPaymentsService = require('./src/payments/nowPaymentsService');

// Validate that the API key is present in the environment variables.
if (!process.env.NOWPAYMENTS_API_KEY) {
  console.error('ERROR: NOWPAYMENTS_API_KEY is not set in the .env file.');
  process.exit(1);
}

(async () => {
  try {
    // Instantiate the NowPaymentsService using the API key from the .env file.
    const nowPayments = new NowPaymentsService(process.env.NOWPAYMENTS_API_KEY);

    // Define dummy payment data with a higher fiat amount to ensure the crypto conversion meets the minimum.
    const paymentData = {
      order_id: 'test_order_002',    // A unique identifier for this test order.
      price_amount: '100.00',         // Increased amount to exceed the minimum crypto conversion.
      price_currency: 'usd',          // Currency used to determine price.
      pay_currency: 'btc',            // Cryptocurrency that will be used for payment.
      // Optionally, you can also provide the ipn_callback_url if needed:
      // ipn_callback_url: 'http://localhost/ipn'
    };

    // Attempt to create a payment with the dummy data.
    const paymentResponse = await nowPayments.createPayment(paymentData);
    console.log('Payment Creation Response:', paymentResponse);

    // If a payment_id is returned, test fetching the payment status.
    if (paymentResponse && paymentResponse.payment_id) {
      const statusResponse = await nowPayments.getPaymentStatus(paymentResponse.payment_id);
      console.log('Payment Status Response:', statusResponse);
    } else {
      console.log('No payment_id returned; skipping getPaymentStatus test.');
    }
  } catch (error) {
    console.error('Payment creation test failed with error:', error);
  }
})();