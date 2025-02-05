/**
 * This file initializes the Discord bot with three commands:
 * - /currencies: Lists available cryptocurrencies via NowPayments.
 * - /premium: Creates a subscription payment for a selected premium tier.
 * - /checkpayment: Checks the status of an existing payment.
 */
const { 
  Client, 
  GatewayIntentBits, 
  ApplicationCommandOptionType,
  EmbedBuilder,
  AttachmentBuilder
} = require('discord.js');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

// Import the qrcode package to generate QR codes.
const QRCode = require('qrcode');

// Import the NowPayments service module.
const NowPaymentsService = require('./payments/nowPaymentsService');

// Retrieve your Discord bot token and guild ID (for testing command registration).
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID; // For registering guild-specific commands

// Ensure necessary environment variables are set.
if (!DISCORD_BOT_TOKEN) {
  console.error('ERROR: DISCORD_BOT_TOKEN is not set in the .env file.');
  process.exit(1);
}
if (!process.env.NOWPAYMENTS_API_KEY) {
  console.error('ERROR: NOWPAYMENTS_API_KEY is not set in the .env file.');
  process.exit(1);
}

// Create a new Discord client with required intents.
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/**
 * Registers the slash commands in the targeted guild.
 * Updated to include the /premium command with two options: tier and crypto.
 */
async function registerCommands(guild) {
  // Command to query available currencies.
  const currenciesCommand = {
    name: 'currencies',
    description: 'Check available crypto currencies from NowPayments',
  };

  // Command to create a subscription (premium) payment.
  const premiumCommand = {
    name: 'premium',
    description: 'Subscribe to a premium tier for exclusive benefits',
    options: [
      {
        name: 'tier',
        description: 'Select your premium tier',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Pearl', value: 'pearl' },
          { name: 'Sapphire', value: 'sapphire' },
          { name: 'Diamond', value: 'diamond' }
        ]
      },
      {
        name: 'crypto',
        description: 'Select the cryptocurrency for payment',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'BTC', value: 'btc' },
          { name: 'ETH', value: 'eth' },
          { name: 'LTC', value: 'ltc' },
          { name: 'SOL', value: 'sol' }
        ]
      }
    ]
  };

  // Command to check a payment status.
  const checkPaymentCommand = {
    name: 'checkpayment',
    description: 'Check the status of a payment using its Payment ID',
    options: [
      {
        name: 'paymentid',
        description: 'The Payment ID returned from /premium',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  };

  try {
    await guild.commands.create(currenciesCommand);
    await guild.commands.create(premiumCommand);
    await guild.commands.create(checkPaymentCommand);
    console.log(`Registered slash commands in guild: ${guild.name}`);
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
}

// When the client is ready, register commands in the designated guild.
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  let guild;
  if (GUILD_ID) {
    guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
      console.error(`No guild found with the ID: ${GUILD_ID}`);
      return;
    }
  } else {
    // Fallback: use the first guild the bot is in.
    guild = client.guilds.cache.first();
    if (!guild) {
      console.error('Bot is not in any guilds.');
      return;
    }
  }
  // Register our slash commands.
  await registerCommands(guild);
});

// Listen for interaction events from Discord (slash commands).
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // /currencies command remains unchanged.
  if (commandName === 'currencies') {
    const nowPayments = new NowPaymentsService(process.env.NOWPAYMENTS_API_KEY);
    await interaction.deferReply();
    try {
      const currencies = await nowPayments.getAvailableCurrencies();
      const currencyList = Array.isArray(currencies) ? currencies.join(', ') : 'No currencies found';
      await interaction.editReply(`Available Currencies: ${currencyList}`);
    } catch (error) {
      console.error('Error executing /currencies command:', error);
      await interaction.editReply(`Failed to fetch currencies. Error: ${error.message}`);
    }
  }

  // Handle the new /premium command.
  if (commandName === 'premium') {
    const nowPayments = new NowPaymentsService(process.env.NOWPAYMENTS_API_KEY);
    // Note: This reply is just to confirm the DM has been (or will be) sent.
    await interaction.deferReply({ ephemeral: true });
    try {
      // Retrieve selected options from the command.
      const tierSelection = interaction.options.getString('tier');
      const cryptoSelection = interaction.options.getString('crypto');

      // Map tier selections to prices.
      const tierPrices = {
        pearl: '50.00',
        sapphire: '100.00',
        diamond: '200.00'
      };
      const priceAmount = tierPrices[tierSelection];

      // Generate a unique order ID.
      const orderId = `order_${interaction.user.id}_${Date.now()}`;
      
      // Define the payment data with dynamic price_amount.
      const paymentData = {
        order_id: orderId,
        price_amount: priceAmount,
        price_currency: 'usd',
        pay_currency: cryptoSelection
        // Optional: ipn_callback_url: 'http://your-callback-url.com/ipn'
      };

      // Create a payment using NowPayments.
      const paymentResponse = await nowPayments.createPayment(paymentData);

      // (Optional) fetch the latest payment status.
      let statusResponse;
      if (paymentResponse && paymentResponse.payment_id) {
        statusResponse = await nowPayments.getPaymentStatus(paymentResponse.payment_id);
      }

      // Build a payment URI for QR code generation.
      let paymentURI = '';
      if (cryptoSelection === 'btc') {
        paymentURI = `bitcoin:${paymentResponse.pay_address}?amount=${paymentResponse.pay_amount}`;
      } else if (cryptoSelection === 'eth') {
        paymentURI = `ethereum:${paymentResponse.pay_address}?value=${paymentResponse.pay_amount}`;
      } else if (cryptoSelection === 'ltc') {
        paymentURI = `litecoin:${paymentResponse.pay_address}?amount=${paymentResponse.pay_amount}`;
      } else if (cryptoSelection === 'sol') {
        paymentURI = `${paymentResponse.pay_address}?amount=${paymentResponse.pay_amount}`;
      } else {
        paymentURI = paymentResponse.pay_address;
      }

      // Generate the QR code as a data URL.
      const qrDataURL = await QRCode.toDataURL(paymentURI);
      const base64Data = qrDataURL.split(',')[1];
      const qrBuffer = Buffer.from(base64Data, 'base64');
      const qrAttachment = new AttachmentBuilder(qrBuffer, { name: 'qr.png' });

      // Build the payment embed.
      const embed = new EmbedBuilder()
        .setTitle('Complete Your Subscription Payment')
        .setColor(0x00AE86)
        .setDescription(`You are subscribing to the **${tierSelection.toUpperCase()}** tier.\nSend exactly **${paymentResponse.pay_amount} ${paymentResponse.pay_currency.toUpperCase()}** to the wallet address below.`)
        .addFields(
          { name: 'Wallet Address', value: paymentResponse.pay_address, inline: false },
          { 
            name: 'Payment Info (Copy & Paste)', 
            value: `\`\`\`
Wallet: ${paymentResponse.pay_address}
Amount: ${paymentResponse.pay_amount} ${paymentResponse.pay_currency.toUpperCase()}
\`\`\``, 
            inline: false 
          },
          { name: 'Next Steps', value: 'After sending, use the `/checkpayment` command to verify your payment status.', inline: false }
        )
        .setImage('attachment://qr.png')
        .setTimestamp();

      // Send the payment embed with QR code as a DM.
      try {
        await interaction.user.send({ embeds: [embed], files: [qrAttachment] });
        await interaction.editReply('I have sent your premium payment details via DM. Please check your direct messages.');
      } catch (dmError) {
        console.error('DM Error:', dmError);
        await interaction.editReply('I was unable to DM you. Please check your DM settings and try again.');
      }
      

      // Import our order mapping.
      const orderMapping = require('./orderMapping');
      // Save the mapping (this can be persisted in a database in production).
      orderMapping[paymentResponse.order_id] = {
        userId: interaction.user.id,
        tier: tierSelection // e.g., "pearl", "sapphire", or "diamond"
      };
    } catch (error) {
      console.error('Error executing /premium command:', error);
      await interaction.editReply(`Failed to create premium payment. Error: ${error.message}`);
    }
  }

  // /checkpayment command remains unchanged.
  if (commandName === 'checkpayment') {
    const nowPayments = new NowPaymentsService(process.env.NOWPAYMENTS_API_KEY);
    await interaction.deferReply({ ephemeral: true });
    try {
      const paymentId = interaction.options.getString('paymentid');
      const statusResponse = await nowPayments.getPaymentStatus(paymentId);
      const embed = new EmbedBuilder()
        .setTitle('Payment Status')
        .setColor(0x00AE86)
        .addFields(
          { name: 'Payment ID', value: paymentId.toString(), inline: true },
          { name: 'Status', value: statusResponse.payment_status, inline: true }
        )
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error executing /checkpayment command:', error);
      await interaction.editReply(`Failed to check payment status. Error: ${error.message}`);
    }
  }
});

// Log into Discord using your bot token.
client.login(DISCORD_BOT_TOKEN);

const express = require('express');
const app = express();

// Use Render's PORT or default to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});