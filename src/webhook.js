/**
 * Webhook endpoint for NowPayments IPN notifications.
 * When a payment is confirmed, this endpoint assigns the corresponding premium role to the user.
 * 
 * IMPORTANT: In a production environment, add proper request verification (e.g., signature validation)
 * and use persistent storage instead of an in-memory mapping.
 */
const express = require('express');
const bodyParser = require('body-parser');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();

// Import our in-memory order mapping.
const orderMapping = new Map();

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

// Add payment verification middleware
const verifyPaymentSignature = (req, res, next) => {
  const signature = req.headers['x-nowpayments-sig'];
  const payload = JSON.stringify(req.body);
  const hmac = crypto
    .createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET)
    .update(payload)
    .digest('hex');
    
  if (signature !== hmac) {
    return res.status(401).send('Invalid signature');
  }
  next();
};

app.post('/nowpayments/ipn', verifyPaymentSignature, async (req, res) => {
  try {
    console.log('Received IPN:', req.body);
    
    const { order_id, payment_status, pay_amount, pay_currency } = req.body;
    
    if (!order_id || !payment_status) {
      console.error('Invalid webhook payload');
      return res.status(400).send('Invalid payload');
    }

    const mapping = orderMapping.get(order_id);
    if (!mapping) {
      console.log(`No mapping found for order ID: ${order_id}`);
      return res.status(200).send('OK');
    }

    if (payment_status === 'confirmed') {
      const guild = client.guilds.cache.get(GUILD_ID);
      if (!guild) {
        console.error('Guild not found!');
        return res.status(500).send('Guild not found');
      }

      try {
        const member = await guild.members.fetch(mapping.userId);
        const roleId = tierRoleMapping[mapping.tier];
        
        if (!roleId) {
          console.error(`No role mapping found for tier: ${mapping.tier}`);
          return res.status(500).send('Invalid tier');
        }

        await member.roles.add(roleId);
        console.log(`Assigned ${mapping.tier} role to user ${mapping.userId}`);

        // Send confirmation DM
        try {
          const embed = new EmbedBuilder()
            .setTitle('Premium Subscription Activated!')
            .setColor(0x00FF00)
            .setDescription(`Your ${mapping.tier} subscription has been activated!`)
            .addFields(
              { name: 'Amount Paid', value: `${pay_amount} ${pay_currency}` },
              { name: 'Order ID', value: order_id }
            )
            .setTimestamp();

          await member.send({ embeds: [embed] });
        } catch (dmError) {
          console.error('Could not send confirmation DM:', dmError);
        }

        // Clean up the mapping
        orderMapping.delete(order_id);
      } catch (error) {
        console.error('Error processing payment confirmation:', error);
        return res.status(500).send('Error processing payment');
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal server error');
  }
});

// Start the webhook server.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});