export const testTransactions = [
    {
      id: 'TEST_TX_1',
      user: {
        name: 'Test.User#1234',
        tier: 'diamond'
      },
      amount: 39.97,
      status: 'completed',
      timestamp: new Date().toISOString()
    },
    // Add more test transactions
  ];
  
  export const testRoles = [
    { tier: 'pearl', roleId: 'TEST_ROLE_1', memberCount: 3 },
    { tier: 'sapphire', roleId: 'TEST_ROLE_2', memberCount: 2 },
    { tier: 'diamond', roleId: 'TEST_ROLE_3', memberCount: 1 }
  ];
  
  export const testPromoCodes = [
    { 
      code: 'TEST25',
      discount: 25,
      expires: '2025-12-31',
      validTiers: ['sapphire', 'diamond']
    }
  ];