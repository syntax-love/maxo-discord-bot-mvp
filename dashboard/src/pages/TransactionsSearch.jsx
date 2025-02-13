import React, { useState } from 'react';
import {
  Container, VStack, Grid, Card, CardHeader, CardBody,
  Heading, Table, Thead, Tbody, Tr, Th, Td,
  Input, InputGroup, InputLeftElement, 
  Badge, Select, HStack, Button, 
  Tabs, TabList, TabPanels, TabPanel, Tab,
  Avatar, Text, Box, Flex, Divider,
  useColorModeValue,
  Stat, StatLabel, StatNumber
} from '@chakra-ui/react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const mockTransactions = [
  {
    id: 'TX_ETH_789012',
    user: {
      id: 'USER_001',
      name: 'Crypto.Whale#1234',
      avatar: 'https://bit.ly/broken-link',
      joinedDate: '2023-12-01',
      tier: 'diamond'
    },
    amount: 39.97,
    currency: 'USD',
    cryptoAmount: '0.0241',
    cryptoType: 'ETH',
    status: 'completed',
    timestamp: '2024-02-11T20:30:00Z',
    paymentMethod: 'Ethereum',
  },
  {
    id: 'TX_SOL_789013',
    user: {
      id: 'USER_002',
      name: 'NFT.Trader#5678',
      avatar: 'https://bit.ly/broken-link',
      joinedDate: '2024-01-15',
      tier: 'sapphire'
    },
    amount: 9.97,
    currency: 'USD',
    cryptoAmount: '0.1234',
    cryptoType: 'SOL',
    status: 'pending',
    timestamp: '2024-02-11T20:15:00Z',
    paymentMethod: 'Solana',
  },
  // Add more mock transactions
];

const mockUsers = [
  {
    id: 'USER_001',
    name: 'Crypto.Whale#1234',
    avatar: 'https://bit.ly/broken-link',
    joinedDate: '2023-12-01',
    tier: 'diamond',
    totalSpent: 299.85,
    lastActive: '2024-02-11T20:30:00Z',
    transactions: 5,
    status: 'active'
  },
  {
    id: 'USER_002',
    name: 'NFT.Trader#5678',
    avatar: 'https://bit.ly/broken-link',
    joinedDate: '2024-01-15',
    tier: 'sapphire',
    totalSpent: 49.85,
    lastActive: '2024-02-11T20:15:00Z',
    transactions: 3,
    status: 'active'
  },
  // Add more mock users
];

const TransactionsSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTimeRange, setFilterTimeRange] = useState('all');
  const bgColor = useColorModeValue('white', 'gray.800');
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);

  // Prevent default form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearch = () => {
    let filtered = [...mockTransactions];

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(tx => 
        tx.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(tx => tx.status === filterStatus);
    }

    // Apply time range filter
    if (filterTimeRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      switch (filterTimeRange) {
        case '24h':
          cutoff.setHours(now.getHours() - 24);
          break;
        case '7d':
          cutoff.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoff.setDate(now.getDate() - 30);
          break;
      }
      filtered = filtered.filter(tx => new Date(tx.timestamp) > cutoff);
    }

    setFilteredTransactions(filtered);
  };

  const UserCard = ({ user }) => (
    <Card mb={4} bg={bgColor}>
      <CardBody>
        <Flex align="center" justify="space-between">
          <HStack spacing={4}>
            <Avatar name={user.name} src={user.avatar} />
            <Box>
              <Text fontWeight="bold">{user.name}</Text>
              <Text fontSize="sm" color="gray.500">
                Joined {new Date(user.joinedDate).toLocaleDateString()}
              </Text>
            </Box>
          </HStack>
          <Badge colorScheme={user.tier === 'diamond' ? 'purple' : 'blue'}>
            {user.tier.toUpperCase()}
          </Badge>
        </Flex>
        <Divider my={4} />
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <Stat>
            <StatLabel>Total Spent</StatLabel>
            <StatNumber>${user.totalSpent}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Transactions</StatLabel>
            <StatNumber>{user.transactions}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Status</StatLabel>
            <Badge colorScheme={user.status === 'active' ? 'green' : 'red'}>
              {user.status}
            </Badge>
          </Stat>
          <Stat>
            <StatLabel>Last Active</StatLabel>
            <Text fontSize="sm">
              {new Date(user.lastActive).toLocaleDateString()}
            </Text>
          </Stat>
        </Grid>
      </CardBody>
    </Card>
  );

  return (
    <Container maxW="container.xl" p={8}>
      <VStack spacing={8} align="stretch">
        <Heading mb={6}>Transaction & User Search</Heading>

        <form onSubmit={handleSubmit}>
          <HStack spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Search by user or transaction ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              w="200px"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </Select>

            <Select 
              value={filterTimeRange} 
              onChange={(e) => setFilterTimeRange(e.target.value)}
              w="200px"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </Select>

            <Button 
              type="submit"
              leftIcon={<FaFilter />} 
              colorScheme="blue"
            >
              Search
            </Button>
          </HStack>
        </form>

        <Tabs>
          <TabList>
            <Tab>Transactions</Tab>
            <Tab>Users</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Transaction ID</Th>
                    <Th>User</Th>
                    <Th>Amount</Th>
                    <Th>Status</Th>
                    <Th>Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredTransactions.map((tx) => (
                    <Tr key={tx.id}>
                      <Td>{tx.id}</Td>
                      <Td>
                        <HStack>
                          <Avatar size="sm" name={tx.user.name} src={tx.user.avatar} />
                          <Text>{tx.user.name}</Text>
                        </HStack>
                      </Td>
                      <Td>${tx.amount} ({tx.cryptoAmount} {tx.cryptoType})</Td>
                      <Td>
                        <Badge colorScheme={tx.status === 'completed' ? 'green' : 'yellow'}>
                          {tx.status}
                        </Badge>
                      </Td>
                      <Td>{new Date(tx.timestamp).toLocaleString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>
            <TabPanel>
              {mockUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default TransactionsSearch;