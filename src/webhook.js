/**
 * Webhook endpoint for NowPayments IPN notifications.
 * When a payment is confirmed, this endpoint assigns the corresponding premium role to the user.
 * 
 * IMPORTANT: In a production environment, add proper request verification (e.g., signature validation)
 * and use persistent storage instead of an in-memory mapping.
 */
const express = require('express');
const bodyParser = require('body-parser');
const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

// Import our in-memory order mapping.
const orderMapping = require('./orderMapping');

const app = express();
app.use(bodyParser.json());

// Create a Discord client with the necessary Guild and Member intents for role assignment.
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.login(process.env.DISCORD_BOT_TOKEN);

const GUILD_ID = process.env.GUILD_ID;

// Define your role mapping for each premium tier. Replace these with your actual Discord role IDs.
const tierRoleMapping = {
  pearl: '1335686254993477663',       // Replace with your actual Role ID for Pearl.
  sapphire: '1335835802999197716',   // Replace with your actual Role ID for Sapphire.
  diamond: '1335835830836789341'      // Replace with your actual Role ID for Diamond.
};

app.post('/nowpayments/ipn', async (req, res) => {
  console.log('Received IPN:', req.body);
  
  // Extract the payment data from the webhook (adjust the field names as needed).
  const { order_id, payment_status } = req.body;
  
  // Only process notifications if the payment status is "confirmed".
  if (order_id && payment_status === 'confirmed') {
    const mapping = orderMapping[order_id];
    if (mapping) {
      try {
        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) {
          console.error('Guild not found!');
          return res.status(500).send('Guild not found');
        }
        // Fetch the member from Discord.
        const member = await guild.members.fetch(mapping.userId);
        const roleId = tierRoleMapping[mapping.tier];
        if (roleId) {
          await member.roles.add(roleId);
          console.log(`Assigned ${mapping.tier} role to user ${mapping.userId}`);
          // Optionally, send a DM notifying the user that their premium role has been activated.
        } else {
          console.error(`No role mapping found for tier: ${mapping.tier}`);
        }
      } catch (error) {
        console.error('Error during role assignment:', error);
      }
    } else {
      console.log(`No mapping found for order ID: ${order_id}`);
    }
  }
  
  // Always respond with a 200 to acknowledge receipt.
  res.status(200).send('OK');
});

// Start the webhook server.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});