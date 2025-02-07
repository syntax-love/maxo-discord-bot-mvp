const express = require('express');
const router = express.Router();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Import role mappings from your existing config
const tierRoleMapping = {
  pearl: '1335686254993477663',
  sapphire: '1335835802999197716',
  diamond: '1335835830836789341'
};

// Temporary mock data for development
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

const mockPromoCodes = [
  {
    code: 'LAUNCH2025',
    discount: 20,
    expires: '2025-12-31',
    validTiers: ['sapphire', 'diamond'],
    oneTime: true
  }
];

// Get role information and member count
router.get('/roles', async (req, res) => {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    const roleStats = await Promise.all(
      Object.entries(tierRoleMapping).map(async ([tier, roleId]) => {
        const role = guild.roles.cache.get(roleId);
        return {
          tier,
          roleId,
          memberCount: role ? role.members.size : 0,
          exists: !!role
        };
      })
    );

    res.json(roleStats);
  } catch (error) {
    console.error('Error fetching role information:', error);
    res.status(500).json({ error: 'Failed to fetch role information' });
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

// Get roles information
router.get('/roles', (req, res) => {
  try {
    res.json(mockRoles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Get promo codes
router.get('/promo-codes', (req, res) => {
  try {
    res.json(mockPromoCodes);
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    res.status(500).json({ error: 'Failed to fetch promo codes' });
  }
});

// Create promo code
router.post('/promo-codes', (req, res) => {
  try {
    const newPromoCode = req.body;
    mockPromoCodes.push(newPromoCode);
    res.status(201).json(newPromoCode);
  } catch (error) {
    console.error('Error creating promo code:', error);
    res.status(500).json({ error: 'Failed to create promo code' });
  }
});

module.exports = router;
