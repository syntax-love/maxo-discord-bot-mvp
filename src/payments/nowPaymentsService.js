/**
 * nowPaymentsService.js
 * 
 * This module provides a class that wraps calls to the NowPayments API.
 * It currently supports fetching available currencies, creating a payment,
 * and checking the status of a payment.
 * 
 * Note: In this MVP, webhook integration is omitted; instead, direct API calls
 * are used to simulate a payment-creation flow.
 */

const NowPaymentsApi = require('@nowpaymentsio/nowpayments-api-js');

class NowPaymentsService {
  /**
   * Creates an instance of NowPaymentsService.
   * @param {string} apiKey - API key from NowPayments.
   */
  constructor(apiKey) {
    if (!apiKey) throw new Error('API key is required to initialize NowPaymentsService');
    // Initialize the NowPayments API instance with the provided API key.
    this.api = new NowPaymentsApi({ apiKey });
  }

  /**
   * Retrieve available currencies from NowPayments.
   *
   * This method calls the NowPayments API endpoint to retrieve supported currency tickers.
   * It logs responses for debugging purposes.
   *
   * @returns {Promise<Array>} An array containing available currency identifiers.
   */
  async getAvailableCurrencies() {
    try {
      const response = await this.api.getCurrencies();
      console.log('[NowPaymentsService] Received response:', response);
      return response.currencies;
    } catch (error) {
      console.error('[NowPaymentsService] Error fetching available currencies:', error);
      throw error;
    }
  }

  /**
   * Create a new payment using NowPayments.
   *
   * This method executes the API call to generate a new payment transaction.
   * The `paymentData` parameter should include:
   *  - order_id: A unique identifier for this payment/order.
   *  - price_amount: The amount to be charged (e.g., "10.00").
   *  - price_currency: The currency of the amount (e.g., "usd").
   *  - pay_currency: The cryptocurrency to be used for payment (e.g., "btc", "ltc", "sol").
   *  - ipn_callback_url: (Optional) A URL for instant payment notifications.
   *
   * @param {Object} paymentData - The necessary details for creating a payment.
   * @returns {Promise<Object>} The payment transaction data returned by NowPayments.
   */
  async createPayment(paymentData) {
    try {
      const response = await this.api.createPayment(paymentData);
      console.log('[NowPaymentsService] Payment created successfully:', response);
      return response;
    } catch (error) {
      console.error('[NowPaymentsService] Error creating payment:', error);
      throw error;
    }
  }

  /**
   * Retrieve the status of an existing payment.
   *
   * Using the payment's unique identifier (paymentId), this method queries the NowPayments
   * API for the current status of the payment. Note: NowPayments expects the payment ID to
   * be provided within an object (e.g., { payment_id: 5026880791 }) and as a number.
   *
   * @param {string|number} paymentId - Unique identifier for the payment transaction.
   * @returns {Promise<Object>} Payment status information returned by NowPayments.
   */
  async getPaymentStatus(paymentId) {
    // Convert the paymentId to a number.
    const paymentIdNumber = Number(paymentId);
    if (isNaN(paymentIdNumber)) {
      throw new Error('Provided paymentId cannot be converted to a valid number');
    }
    try {
      // Pass the numeric payment id wrapped in an object as expected by the API.
      const response = await this.api.getPaymentStatus({ payment_id: paymentIdNumber });
      console.log('[NowPaymentsService] Payment status:', response);
      return response;
    } catch (error) {
      console.error('[NowPaymentsService] Error fetching payment status:', error);
      throw error;
    }
  }
}

module.exports = NowPaymentsService;