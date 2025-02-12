const express = require('express');
const router = express.Router();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers
  ] 
});

// Wait for client to be ready before exporting
let clientReady = new Promise((resolve) => {
  client.once('ready', () => {
    console.log('Admin routes: Discord client is ready');
    resolve();
  });
});

client.login(process.env.DISCORD_BOT_TOKEN);

// Use mock data until client is ready
let useRealData = false;
client.on('ready', () => {
  useRealData = true;
});

// Import role mappings from your existing config
const tierRoleMapping = {
  pearl: '1335686254993477663',
  sapphire: '1335835802999197716',
  diamond: '1335835830836789341'
};

// Initialize mock data
const mockRoles = [
  {
    tier: 'pearl',
    roleId: '1335686254993477663',
    memberCount: 50
  },
  {
    tier: 'sapphire',
    roleId: '1335835802999197716',
    memberCount: 30
  },
  {
    tier: 'diamond',
    roleId: '1335835830836789341',
    memberCount: 20
  }
];

// Initialize promo codes
let promoCodes = {
  'LAUNCH2025': {
    discount: 0.20,
    expires: new Date('2025-12-31'),
    validTiers: ['sapphire', 'diamond'],
    oneTime: true,
    usedBy: new Set()
  }
};

// Get roles information
router.get('/roles', (req, res) => {
  try {
    res.json(mockRoles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Get members for a specific role
router.get('/roles/:roleId/members', async (req, res) => {
  try {
    const { roleId } = req.params;
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    const role = guild.roles.cache.get(roleId);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const members = role.members.map(member => ({
      id: member.id,
      username: member.user.username,
      joinedAt: member.joinedAt
    }));

    res.json(members);
  } catch (error) {
    console.error('Error fetching role members:', error);
    res.status(500).json({ error: 'Failed to fetch role members' });
  }
});

// Get promo codes
router.get('/promo-codes', (req, res) => {
  try {
    const formattedPromoCodes = Object.entries(promoCodes).map(([code, details]) => ({
      code,
      discount: details.discount * 100,
      expires: details.expires.toISOString().split('T')[0],
      validTiers: details.validTiers,
      oneTime: details.oneTime
    }));
    res.json(formattedPromoCodes);
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({ error: 'Failed to fetch promo codes' });
  }
});

// Create promo code
router.post('/promo-codes', (req, res) => {
  try {
    const { code, discount, validTiers, expiryDate, oneTime } = req.body;
    
    promoCodes[code] = {
      discount: discount / 100,
      expires: new Date(expiryDate),
      validTiers,
      oneTime,
      usedBy: new Set()
    };

    res.status(201).json({ message: 'Promo code created successfully' });
  } catch (error) {
    console.error('Error creating promo code:', error);
    res.status(500).json({ error: 'Failed to create promo code' });
  }
});

// Export both the router and the ready promise
module.exports = { router, client, clientReady };
