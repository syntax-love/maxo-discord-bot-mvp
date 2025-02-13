import React, { useState } from 'react';
import {
  Container, VStack, Grid, Card, CardHeader, CardBody,
  Heading, Table, Thead, Tbody, Tr, Th, Td,
  Input, InputGroup, InputLeftElement, 
  Badge, Select, HStack, Button, 
  Tabs, TabList, TabPanels, TabPanel, Tab,
  Avatar, Text, Box, Flex, Divider,
  useColorModeValue,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, useDisclosure, useToast,
  Switch, FormControl, FormLabel, Spinner, Alert, AlertIcon,
  ModalFooter,
  ModalCloseButton,
  FormErrorMessage,
  Checkbox,
  CheckboxGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaUsers, FaCrown, FaMoneyBillWave, FaTag } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useDiscordData } from '../providers/DiscordDataProvider';

const AdminDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  
  const { roles, loading, error, isLive, setIsLive } = useDiscordData();
  const navigate = useNavigate();

  // Add this state at the top of AdminDashboard component
  const [mockPromoCodes, setMockPromoCodes] = useState([
    { code: 'LAUNCH2025', discount: 20, expires: '2025-12-31', validTiers: ['sapphire', 'diamond'] },
    { code: 'SPECIAL50', discount: 50, expires: '2025-03-01', validTiers: ['diamond'] }
  ]);

  // Revenue data
  const revenueData = [
    { date: '2024-02-05', revenue: 149.85, users: 5 },
    { date: '2024-02-06', revenue: 189.82, users: 7 },
    { date: '2024-02-07', revenue: 259.70, users: 10 },
    { date: '2024-02-08', revenue: 299.67, users: 12 },
    { date: '2024-02-09', revenue: 349.64, users: 15 },
    { date: '2024-02-10', revenue: 399.61, users: 18 },
    { date: '2024-02-11', revenue: 449.58, users: 20 }
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899'];

  // Mock transactions
  const mockTransactions = [
    { user: 'Crypto.Whale#1234', amount: '$39.97', status: 'completed', date: '2024-02-11' },
    { user: 'NFT.Trader#5678', amount: '$9.97', status: 'pending', date: '2024-02-11' }
  ];

  // Quick Stats Component
  const QuickStats = () => (
    <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
      <StatCard
        icon={<FaUsers />}
        title="Total Users"
        value={isLive ? "0" : "100"}
        change={isLive ? "0%" : "+12%"}
        timeRange="this week"
      />
      <StatCard
        icon={<FaCrown />}
        title="Premium Users"
        value={isLive ? "0" : "50"}
        change={isLive ? "0%" : "+8%"}
        timeRange="this week"
      />
      <StatCard
        icon={<FaMoneyBillWave />}
        title="Monthly Revenue"
        value={isLive ? "$0.00" : "$1,098.50"}
        change={isLive ? "0%" : "+15%"}
        timeRange="vs last month"
      />
      <StatCard
        icon={<FaTag />}
        
        title="Active Promos"
        value={isLive ? "0" : "3"}
        change={isLive ? "0" : "+2"}
        timeRange="new this week"
      />
    </Grid>
  );

  // Stat Card Component
  const StatCard = ({ icon, title, value, change, timeRange }) => (
    <Card>
      <CardBody>
        <Flex align="center" mb={2}>
          <Box color="brand.500" mr={2} fontSize="xl">
            {icon}
          </Box>
          <Text fontSize="sm" color="gray.500">
            {title}
          </Text>
        </Flex>
        <Stat>
          <StatNumber fontSize="2xl">{value}</StatNumber>
          <StatHelpText>
            <StatArrow type={change.startsWith('+') ? 'increase' : 'decrease'} />
            {change} {timeRange}
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );

  // Charts Section
  const ChartsSection = () => (
    <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
      <Card>
        <CardHeader>
          <Heading size="md">Revenue Trend</Heading>
        </CardHeader>
        <CardBody>
          <LineChart width={500} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3B82F6" />
            <Line type="monotone" dataKey="users" stroke="#8B5CF6" />
          </LineChart>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <Heading size="md">User Distribution</Heading>
        </CardHeader>
        <CardBody>
          <PieChart width={500} height={300}>
            <Pie
              data={[
                { name: 'Diamond', value: 20 },
                { name: 'Sapphire', value: 30 },
                { name: 'Pearl', value: 50 }
              ]}
              cx={250}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {[
                { name: 'Diamond', value: 20 },
                { name: 'Sapphire', value: 30 },
                { name: 'Pearl', value: 50 }
              ].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </CardBody>
      </Card>
    </Grid>
  );

  // Transactions Table
  const TransactionsTable = () => (
    <Card>
      <CardHeader>
        <Heading size="md">Recent Transactions</Heading>
      </CardHeader>
      <CardBody>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLive ? (
              <Tr>
                <Td colSpan={4} textAlign="center">No transactions available in live mode</Td>
              </Tr>
            ) : (
              mockTransactions.map((tx, i) => (
                <Tr key={i}>
                  <Td>{tx.user}</Td>
                  <Td>{tx.amount}</Td>
                  <Td>
                    <Badge colorScheme={tx.status === 'completed' ? 'green' : 'yellow'}>
                      {tx.status}
                    </Badge>
                  </Td>
                  <Td>{tx.date}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );

  // Active Subscriptions
  const ActiveSubscriptions = () => (
    <Card>
      <CardHeader>
        <Heading size="md">Active Subscriptions</Heading>
      </CardHeader>
      <CardBody>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Tier</Th>
              <Th>Members</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLive ? (
              <Tr>
                <Td colSpan={3} textAlign="center">No subscription data available in live mode</Td>
              </Tr>
            ) : (
              roles.map((role) => (
                <Tr key={role.tier}>
                  <Td>
                    <Badge colorScheme={
                      role.tier === 'diamond' ? 'purple' :
                      role.tier === 'sapphire' ? 'blue' : 'gray'
                    }>
                      {role.tier.charAt(0).toUpperCase() + role.tier.slice(1)}
                    </Badge>
                  </Td>
                  <Td>{role.memberCount}</Td>
                  <Td>
                    <Badge colorScheme="green">Active</Badge>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );

  // At the top of AdminDashboard component, update the state declarations
  const [promoFormData, setPromoFormData] = useState({
    code: '',
    discount: 10,
    expires: '',
    validTiers: ['diamond']
  });

  // Add this function to handle promo creation
  const handleCreatePromo = (e) => {
    e.preventDefault(); // Prevent form submission refresh
    
    if (!promoFormData.code || !promoFormData.expires) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Add to mock data
    setMockPromoCodes(prev => [...prev, {
      code: promoFormData.code,
      discount: promoFormData.discount,
      expires: promoFormData.expires,
      validTiers: promoFormData.validTiers
    }]);

    toast({
      title: 'Success',
      description: `Promo code ${promoFormData.code} created successfully`,
      status: 'success',
      duration: 3000,
    });

    // Reset form
    setPromoFormData({
      code: '',
      discount: 10,
      expires: '',
      validTiers: ['diamond']
    });
    onClose();
  };

  // Update the CreatePromoModal component
  const CreatePromoModal = () => {
    const [formData, setFormData] = useState({
      code: '',
      discount: 10,
      expires: '',
      validTiers: ['diamond']
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!formData.code || !formData.expires) {
        toast({
          title: 'Error',
          description: 'Please fill all required fields',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      // Add to mock data
      setMockPromoCodes(prev => [...prev, {
        code: formData.code,
        discount: formData.discount,
        expires: formData.expires,
        validTiers: formData.validTiers
      }]);

      toast({
        title: 'Success',
        description: `Promo code ${formData.code} created successfully`,
        status: 'success',
        duration: 3000,
      });

      setFormData({
        code: '',
        discount: 10,
        expires: '',
        validTiers: ['diamond']
      });
      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Promo Code</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Promo Code</FormLabel>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase()
                    })}
                    placeholder="SUMMER2024"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Discount (%)</FormLabel>
                  <NumberInput
                    value={formData.discount}
                    onChange={(valueString) => setFormData({
                      ...formData,
                      discount: parseInt(valueString)
                    })}
                    min={1}
                    max={100}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Expiration Date</FormLabel>
                  <Input
                    type="date"
                    value={formData.expires}
                    onChange={(e) => setFormData({
                      ...formData,
                      expires: e.target.value
                    })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Valid Tiers</FormLabel>
                  <CheckboxGroup
                    value={formData.validTiers}
                    onChange={(values) => setFormData({
                      ...formData,
                      validTiers: values
                    })}
                  >
                    <VStack align="start">
                      <Checkbox value="pearl">Pearl</Checkbox>
                      <Checkbox value="sapphire">Sapphire</Checkbox>
                      <Checkbox value="diamond">Diamond</Checkbox>
                    </VStack>
                  </CheckboxGroup>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="brand">
                Create Promo
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    );
  };

  // Update the PromoCodesTable to use mockPromoCodes
  const PromoCodesTable = () => (
    <Card>
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Heading size="md">Active Promo Codes</Heading>
          <Button
            leftIcon={<FaTag />}
            colorScheme="brand"
            onClick={onOpen}
            size="sm"
          >
            Create Promo Code
          </Button>
        </Flex>
      </CardHeader>
      <CardBody>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Code</Th>
              <Th>Discount</Th>
              <Th>Expires</Th>
              <Th>Valid Tiers</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mockPromoCodes.map((promo, index) => (
              <Tr key={index}>
                <Td>{promo.code}</Td>
                <Td>{promo.discount}%</Td>
                <Td>{promo.expires}</Td>
                <Td>{promo.validTiers.join(', ')}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );

  return (
    <Container maxW="container.xl" p={8}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading>Admin Dashboard</Heading>
          <FormControl display="flex" alignItems="center" w="auto">
            <FormLabel htmlFor="test-mode" mb="0" mr={3}>
              Test Mode
            </FormLabel>
            <Switch 
              id="test-mode" 
              isChecked={!isLive}
              onChange={() => setIsLive(!isLive)}
              colorScheme="brand"
            />
          </FormControl>
          <HStack>
            <Select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              w="200px"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </Select>
            <Button
              leftIcon={<FaTag />}
              colorScheme="brand"
              onClick={onOpen}
              size="sm"
              ml={4}
            >
              Create Promo Code
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                navigate('/transactions');
              }}
              variant="ghost"
              leftIcon={<FaSearch />}
            >
              Transactions
            </Button>
          </HStack>
        </Flex>

        {loading && (
          <Flex justify="center" p={8}>
            <Spinner size="xl" color="brand.500" />
          </Flex>
        )}

        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            Error loading dashboard data: {error.message}
          </Alert>
        )}

        <QuickStats />
        <Grid templateColumns="1fr" gap={6}>
          <ActiveSubscriptions />
          <TransactionsTable />
        </Grid>
      </VStack>

      {/* Create Promo Modal */}
      <CreatePromoModal />

      <PromoCodesTable />
    </Container>
  );
};

export default AdminDashboard;