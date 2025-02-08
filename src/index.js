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
  AttachmentBuilder,
  Collection
} = require('discord.js');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

// Import the qrcode package to generate QR codes.
const QRCode = require('qrcode');

// Import the NowPayments service module.
const NowPaymentsService = require('./payments/nowPaymentsService');

// Import the role mapping
const tierRoleMapping = {
  pearl: '1335686254993477663',    // Replace with actual Pearl role ID
  sapphire: '1335835802999197716', // Replace with actual Sapphire role ID
  diamond: '1335835830836789341'   // Replace with actual Diamond role ID
};

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

// Promo code mapping (in production, this should be in a database)
const promoCodes = {
  'LAUNCH2025': {
    discount: 0.20,  // 20% off
    expires: new Date('2025-12-31'),
    validTiers: ['sapphire', 'diamond'],
    oneTime: true,
    usedBy: new Set()  // Track who's used this code
  },
  'SPECIAL50': {
    discount: 0.50,  // 50% off
    expires: new Date('2025-03-01'),
    validTiers: ['diamond'],
    oneTime: true,
    usedBy: new Set()
  }
};

// Channel IDs (replace with actual channel IDs)
const channels = {
  lounge: 'LOUNGE_CHANNEL_ID',
  privateSuite: 'PRIVATE_SUITE_CHANNEL_ID',
  penthouse: 'PENTHOUSE_CHANNEL_ID'
};

// Add payment tracking
const activePayments = new Collection();

// Add cooldown handling
const cooldowns = new Collection();

// Add order mapping
const orderMapping = new Map();

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
          { name: 'Sapphire ($9.97/week)', value: 'sapphire' },
          { name: 'Diamond ($39.97/lifetime)', value: 'diamond' }
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
          { name: 'SOL', value: 'sol' }
        ]
      },
      {
        name: 'promo',
        description: 'Enter promo code (optional)',
        type: ApplicationCommandOptionType.String,
        required: false
      }
    ]
  };

  // Command to check a payment status.
  const checkPaymentCommand = {
    name: 'checkpayment',
    description: 'Check the status of your premium payment',
    options: [
      {
        name: 'paymentid',
        description: 'Your payment ID',
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  };

  // Enhanced search command with detailed service information
  const searchCommand = {
    name: 'search',
    description: 'Browse available premium tiers and their benefits',
    options: []
  };

  const subscriptionCommand = {
    name: 'subscription',
    description: 'Check your current subscription status and remaining time',
    options: []
  };

  // Add command to check available promo codes (admin only)
  const promoListCommand = {
    name: 'promolist',
    description: 'List all promotional codes (Admin only)',
    options: []
  };

  // Add a separate command for admins to assign Pearl tier
  const assignPearlCommand = {
    name: 'assignpearl',
    description: 'Assign Pearl tier to a user (Admin only)',
    options: [
      {
        name: 'user',
        description: 'User to assign Pearl tier to',
        type: ApplicationCommandOptionType.User,
        required: true
      }
    ]
  };

  try {
    await guild.commands.create(currenciesCommand);
    await guild.commands.create(premiumCommand);
    await guild.commands.create(checkPaymentCommand);
    await guild.commands.create(searchCommand);
    await guild.commands.create(subscriptionCommand); 
    await guild.commands.create(promoListCommand);
    await guild.commands.create(assignPearlCommand);
    console.log(`Registered slash commands in guild: ${guild.name}`);
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
}

// Add this helper function
async function checkRoleHierarchy(guild) {
  const botMember = await guild.members.fetch(client.user.id);
  const botRole = botMember.roles.highest;
  
  const premiumRoles = Object.values(tierRoleMapping).map(id => guild.roles.cache.get(id));
  
  const issues = premiumRoles
    .filter(role => role && botRole.position <= role.position)
    .map(role => role.name);
    
  if (issues.length > 0) {
    console.error(`Bot cannot manage these roles: ${issues.join(', ')}`);
    return false;
  }
  return true;
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

  // Start checking for expired Sapphire subscriptions
  setInterval(async () => {
    try {
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
      if (!guild) return;

      const sapphireRole = guild.roles.cache.get(tierRoleMapping.sapphire);
      if (!sapphireRole) return;

      // Check all members with Sapphire role
      for (const [memberId, member] of sapphireRole.members) {
        const expiryDate = await getSubscriptionExpiry(memberId);
        if (expiryDate < new Date()) {
          await member.roles.remove(sapphireRole);
          await updateChannelAccess(member);
          
          try {
            await member.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle('Subscription Expired')
                  .setColor(0xFF0000)
                  .setDescription('Your Sapphire subscription has expired. Use `/premium` to renew!')
                  .setTimestamp()
              ]
            });
          } catch (dmError) {
            console.error(`Could not send expiry DM to ${memberId}:`, dmError);
          }
        }
      }
    } catch (error) {
      console.error('Error in subscription check interval:', error);
    }
  }, 60 * 60 * 1000); // Check every hour

  const hierarchyCheck = await checkRoleHierarchy(guild);
  if (!hierarchyCheck) {
    console.error('Bot role hierarchy issues detected!');
  }

  // Add subscription cleanup interval
  setInterval(async () => {
    try {
      const guild = client.guilds.cache.get(GUILD_ID);
      if (!guild) return;
      
      const sapphireRole = guild.roles.cache.get(tierRoleMapping.sapphire);
      const members = sapphireRole.members;
      
      for (const [memberId, member] of members) {
        const expiry = await getSubscriptionExpiry(memberId);
        if (expiry && new Date() > expiry) {
          await member.roles.remove(sapphireRole);
          try {
            await member.send({
              content: 'Your Sapphire subscription has expired. Use `/premium` to renew!'
            });
          } catch (dmError) {
            console.error(`Could not DM user ${memberId} about expiration`);
          }
        }
      }
    } catch (error) {
      console.error('Error in subscription cleanup:', error);
    }
  }, 1000 * 60 * 60); // Check every hour
});

// Listen for interaction events from Discord (slash commands).
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  // Add cooldown check
  if (cooldowns.has(interaction.user.id)) {
    const cooldownEnd = cooldowns.get(interaction.user.id);
    if (Date.now() < cooldownEnd) {
      await interaction.reply({
        content: 'Please wait a few seconds between commands.',
        ephemeral: true
      });
      return;
    }
  }
  cooldowns.set(interaction.user.id, Date.now() + 3000); // 3s cooldown

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

  // Handle the premium command
  if (commandName === 'premium') {
    const nowPayments = new NowPaymentsService(process.env.NOWPAYMENTS_API_KEY);
    await interaction.deferReply({ ephemeral: true });
    
    try {
      const tierSelection = interaction.options.getString('tier');
      const cryptoSelection = interaction.options.getString('crypto');
      
      // Map tier selections to prices
      const tierPrices = {
        pearl: '0.00',
        sapphire: '9.97',
        diamond: '39.97'
      };

      let finalPrice = tierPrices[tierSelection];
      
      // Create unique order ID
      const orderId = `ORDER_${Date.now()}_${interaction.user.id}`;
      
      // Create payment
      const paymentData = {
        price_amount: finalPrice,
        price_currency: 'usd',
        pay_currency: cryptoSelection,
        order_id: orderId,
        order_description: `${tierSelection} tier subscription`,
        ipn_callback_url: process.env.WEBHOOK_URL
      };

      const paymentResponse = await nowPayments.createPayment(paymentData);
      
      if (!paymentResponse) {
        throw new Error('Failed to create payment');
      }

      // Store order details for later
      orderMapping.set(orderId, {
        userId: interaction.user.id,
        tier: tierSelection,
        timestamp: Date.now()
      });

      // Build a payment URI for QR code generation.
      let paymentURI = '';
      if (cryptoSelection === 'btc') {
        paymentURI = `bitcoin:${paymentResponse.pay_address}?amount=${paymentResponse.pay_amount}`;
      } else if (cryptoSelection === 'eth') {
        paymentURI = `ethereum:${paymentResponse.pay_address}?value=${paymentResponse.pay_amount}`;
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
    } catch (error) {
      console.error('Error executing /premium command:', error);
      await interaction.editReply(`Failed to create premium payment. Error: ${error.message}`);
    }
  }

  // Add payment verification and role assignment
  async function verifyAndAssignRole(paymentId, orderId) {
    try {
      // Get payment status from NowPayments
      const statusResponse = await nowPayments.getPaymentStatus(paymentId);
      
      // Get order details from our mapping
      const orderDetails = orderMapping.get(orderId);
      if (!orderDetails) {
        console.error(`Order ${orderId} not found in mapping`);
        return false;
      }

      // Get the guild and member
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
      const member = await guild.members.fetch(orderDetails.userId);

      if (statusResponse.payment_status === 'finished' || statusResponse.payment_status === 'confirmed') {
        // Remove any existing tier roles
        await member.roles.remove([
          tierRoleMapping.sapphire,
          tierRoleMapping.diamond
        ]).catch(console.error);

        // Assign new role based on tier
        const roleId = tierRoleMapping[orderDetails.tier];
        if (roleId) {
          await member.roles.add(roleId);
          
          // Update channel permissions
          await updateChannelAccess(member);

          // Send confirmation DM
          try {
            const embed = new EmbedBuilder()
              .setTitle('🎉 Premium Activated!')
              .setColor(0x00AE86)
              .setDescription(`Your ${orderDetails.tier} subscription is now active!`)
              .addFields(
                { 
                  name: 'Tier', 
                  value: orderDetails.tier.charAt(0).toUpperCase() + orderDetails.tier.slice(1),
                  inline: true 
                },
                { 
                  name: 'Payment ID', 
                  value: paymentId,
                  inline: true 
                }
              )
              .setTimestamp();

            await member.send({ embeds: [embed] });
          } catch (dmError) {
            console.error('Could not send confirmation DM:', dmError);
          }

          // For Sapphire tier, set up expiration
          if (orderDetails.tier === 'sapphire') {
            // Store subscription expiry (7 days from now)
            const expiryDate = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
            // In production, save this to a database
            console.log(`Sapphire subscription for ${member.user.tag} expires: ${expiryDate}`);
          }

          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error in verifyAndAssignRole:', error);
      return false;
    }
  }

  // /checkpayment command remains unchanged.
  if (commandName === 'checkpayment') {
    await interaction.deferReply({ ephemeral: true });
    
    try {
      const paymentId = interaction.options.getString('paymentid');
      const success = await verifyAndAssignRole(paymentId, `ORDER_${paymentId}`);
      
      if (success) {
        await interaction.editReply('✅ Payment verified! Your premium role has been assigned.');
      } else {
        await interaction.editReply('Payment is still pending or not found. Please try again later or contact support if you need help.');
      }
    } catch (error) {
      console.error('Error in checkpayment command:', error);
      await interaction.editReply('An error occurred while checking your payment. Please try again later.');
    }
  }

  // Add handler for the new /search command
  if (commandName === 'search') {
    await interaction.deferReply();
    
    const embed = new EmbedBuilder()
      .setTitle('🌟 Premium Tiers & Benefits')
      .setColor(0x00AE86)
      .setDescription('Explore our exclusive membership tiers:')
      .addFields(
        {
          name: '💎 Pearl (FREE)',
          value: `• Access to Lounge (general chat)
                 • Basic community features
                 • View announcements
                 
                 Price: FREE`,
          inline: false
        },
        {
          name: '🔷 Sapphire ($9.97/week)',
          value: `• All Pearl features
                 • Access to Private Suite
                 • Weekly exclusive content
                 • Premium community status
                 • Priority support
                 
                 Price: $9.97/week
                 Use \`/premium tier:sapphire\` to subscribe`,
          inline: false
        },
        {
          name: '💠 Diamond ($39.97/lifetime)',
          value: `• All Sapphire features
                 • Access to Penthouse (exclusive channel)
                 • Lifetime benefits
                 • Special perks and bonuses
                 • VIP status
                 • Early access to new features
                 • Custom profile badge
                 
                 Price: $39.97 (one-time payment)
                 Use \`/premium tier:diamond\` to subscribe`,
          inline: false
        }
      )
      .setFooter({ 
        text: 'Use /premium to subscribe • Crypto payments accepted: BTC, ETH, SOL' 
      });

    await interaction.editReply({ embeds: [embed] });
  }

  // Add handler for the new /subscription command
  if (commandName === 'subscription') {
    await interaction.deferReply({ ephemeral: true });
    
    try {
      // Get user's roles
      const member = interaction.member;
      const roles = member.roles.cache;
      
      // Check which premium role they have
      let subscriptionDetails = {
        tier: 'None',
        status: 'No active subscription',
        expiry: null
      };

      if (roles.has(tierRoleMapping.diamond)) {
        subscriptionDetails = {
          tier: 'Diamond',
          status: 'Active (Lifetime)',
          expiry: 'Never'
        };
      } else if (roles.has(tierRoleMapping.sapphire)) {
        // Fetch expiry from database (implementation needed)
        const expiryDate = await getSubscriptionExpiry(interaction.user.id);
        const now = new Date();
        
        subscriptionDetails = {
          tier: 'Sapphire',
          status: expiryDate > now ? 'Active' : 'Expired',
          expiry: expiryDate.toLocaleString()
        };
      } else if (roles.has(tierRoleMapping.pearl)) {
        subscriptionDetails = {
          tier: 'Pearl',
          status: 'Active (Free)',
          expiry: 'Never'
        };
      }

      const embed = new EmbedBuilder()
        .setTitle('Subscription Status')
        .setColor(0x00AE86)
        .addFields(
          { name: 'Current Tier', value: subscriptionDetails.tier, inline: true },
          { name: 'Status', value: subscriptionDetails.status, inline: true },
          { name: 'Expires', value: subscriptionDetails.expiry || 'N/A', inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error checking subscription:', error);
      await interaction.editReply('Failed to check subscription status. Please try again later.');
    }
  }

  // Add handler for promolist command
  if (commandName === 'promolist') {
    await interaction.deferReply({ ephemeral: true });

    // Check if user has admin role
    if (!interaction.member.permissions.has('Administrator')) {
      await interaction.editReply('You do not have permission to use this command.');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('Active Promotional Codes')
      .setColor(0x00AE86)
      .setDescription('Current promotional codes and their details:')
      .setTimestamp();

    for (const [code, details] of Object.entries(promoCodes)) {
      const isExpired = new Date() > details.expires;
      embed.addFields({
        name: code,
        value: `Discount: ${details.discount * 100}%
                Valid Tiers: ${details.validTiers.join(', ')}
                Expires: ${details.expires.toLocaleDateString()}
                One-Time Use: ${details.oneTime ? 'Yes' : 'No'}
                Status: ${isExpired ? '❌ Expired' : '✅ Active'}
                Times Used: ${details.usedBy.size}`
      });
    }

    await interaction.editReply({ embeds: [embed] });
  }

  // Add handler for assignpearl command
  if (commandName === 'assignpearl') {
    await interaction.deferReply({ ephemeral: true });
    
    // Check if user has admin permissions
    if (!interaction.member.permissions.has('Administrator')) {
      await interaction.editReply('You do not have permission to use this command.');
      return;
    }

    try {
      const targetUser = interaction.options.getUser('user');
      const member = await interaction.guild.members.fetch(targetUser.id);
      
      await member.roles.add(tierRoleMapping.pearl);
      await interaction.editReply(`Successfully assigned Pearl tier to ${targetUser.username}`);
      
      // Update channel permissions
      await updateChannelAccess(member);
    } catch (error) {
      console.error('Error assigning Pearl role:', error);
      await interaction.editReply('Failed to assign Pearl role. Please try again later.');
    }
  }
});

// Add subscription expiry checking function
async function getSubscriptionExpiry(userId) {
  // For now, return a dummy date 7 days from purchase
  // This should be replaced with actual database lookup
  return new Date(Date.now() + (7 * 24 * 60 * 60 * 1000));
}

// Function to manage channel access when roles change
async function updateChannelAccess(member) {
  const guild = member.guild;
  
  // Get channels
  const loungeChannel = guild.channels.cache.get(channels.lounge);
  const privateSuiteChannel = guild.channels.cache.get(channels.privateSuite);
  const penthouseChannel = guild.channels.cache.get(channels.penthouse);
  
  // Get user's roles
  const roles = member.roles.cache;
  
  // Pearl (everyone) gets Lounge access
  if (loungeChannel) {
    await loungeChannel.permissionOverwrites.edit(member.id, {
      ViewChannel: true,
      SendMessages: true
    });
  }
  
  // Sapphire and Diamond get Private Suite access
  if (privateSuiteChannel) {
    const hasAccess = roles.has(tierRoleMapping.sapphire) || roles.has(tierRoleMapping.diamond);
    await privateSuiteChannel.permissionOverwrites.edit(member.id, {
      ViewChannel: hasAccess,
      SendMessages: hasAccess
    });
  }
  
  // Only Diamond gets Penthouse access
  if (penthouseChannel) {
    const hasAccess = roles.has(tierRoleMapping.diamond);
    await penthouseChannel.permissionOverwrites.edit(member.id, {
      ViewChannel: hasAccess,
      SendMessages: hasAccess
    });
  }
}

// Add role update listener
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  // Check if roles changed
  if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
    try {
      await updateChannelAccess(newMember);
    } catch (error) {
      console.error('Error updating channel access:', error);
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