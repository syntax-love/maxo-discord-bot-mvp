import {
    Box,
    Grid,
    Heading,
    Card,
    CardHeader,
    CardBody,
    Stack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast,
    Container,
    VStack,
    HStack,
    Checkbox
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  
  const AdminDashboard = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
      code: '',
      discount: '',
      validTiers: [],
      expiryDate: '',
      oneTime: true
    });
  
    useEffect(() => {
      const fetchRoles = async () => {
        try {
          const response = await fetch('/api/admin/roles');
          const data = await response.json();
          setRoles(data);
        } catch (error) {
          console.error('Error fetching roles:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch role information',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };
  
      fetchRoles();
    }, []);
  
    const handleCreatePromo = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/admin/promo-codes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) throw new Error('Failed to create promo code');
  
        toast({
          title: 'Success',
          description: 'Promo code created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
        // Reset form
        setFormData({
          code: '',
          discount: '',
          validTiers: [],
          expiryDate: '',
          oneTime: true
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
  
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    };
  
    const handleTierChange = (tier) => {
      setFormData(prev => ({
        ...prev,
        validTiers: prev.validTiers.includes(tier)
          ? prev.validTiers.filter(t => t !== tier)
          : [...prev.validTiers, tier]
      }));
    };
  
    return (
      <Container maxW="container.xl" p={8}>
        <VStack spacing={8} align="stretch">
          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
            {/* Subscription Overview */}
            <Card>
              <CardHeader>
                <Heading size="md">Active Subscriptions</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Tier</Th>
                      <Th>Active Users</Th>
                      <Th>Revenue</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Pearl</Td>
                      <Td>50</Td>
                      <Td>$0</Td>
                    </Tr>
                    <Tr>
                      <Td>Sapphire</Td>
                      <Td>30</Td>
                      <Td>$299.10</Td>
                    </Tr>
                    <Tr>
                      <Td>Diamond</Td>
                      <Td>20</Td>
                      <Td>$799.40</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
  
            {/* Role Management */}
            <Card>
              <CardHeader>
                <Heading size="md">Role Management</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Tier</Th>
                      <Th>Role ID</Th>
                      <Th>Members</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {roles.map(({ tier, roleId, memberCount }) => (
                      <Tr key={roleId}>
                        <Td>{tier.charAt(0).toUpperCase() + tier.slice(1)}</Td>
                        <Td>{roleId}</Td>
                        <Td>{memberCount}</Td>
                        <Td>
                          <Button size="sm" colorScheme="blue">View Members</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
  
            {/* Promo Codes */}
            <Card>
              <CardHeader>
                <HStack justify="space-between">
                  <Heading size="md">Promo Codes</Heading>
                  <Button colorScheme="brand" onClick={onOpen}>Create New</Button>
                </HStack>
              </CardHeader>
              <CardBody>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Code</Th>
                      <Th>Discount</Th>
                      <Th>Expires</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>LAUNCH2025</Td>
                      <Td>20%</Td>
                      <Td>Dec 31, 2025</Td>
                      <Td>
                        <Button size="sm" colorScheme="red">Delete</Button>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </Grid>
  
          {/* Create Promo Modal */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Promo Code</ModalHeader>
              <ModalBody>
                <VStack spacing={4} as="form" onSubmit={handleCreatePromo}>
                  <FormControl isRequired>
                    <FormLabel>Code</FormLabel>
                    <Input
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="EXAMPLE25"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Discount (%)</FormLabel>
                    <Input
                      name="discount"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.discount}
                      onChange={handleInputChange}
                    />
                  </FormControl>
  
                  <FormControl isRequired>
                    <FormLabel>Valid Tiers</FormLabel>
                    <Stack spacing={2}>
                      <Checkbox
                        isChecked={formData.validTiers.includes('sapphire')}
                        onChange={() => handleTierChange('sapphire')}
                      >
                        Sapphire
                      </Checkbox>
                      <Checkbox
                        isChecked={formData.validTiers.includes('diamond')}
                        onChange={() => handleTierChange('diamond')}
                      >
                        Diamond
                      </Checkbox>
                    </Stack>
                  </FormControl>
  
                  <FormControl isRequired>
                    <FormLabel>Expiry Date</FormLabel>
                    <Input
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                  </FormControl>
  
                  <FormControl>
                    <Checkbox
                      name="oneTime"
                      isChecked={formData.oneTime}
                      onChange={handleInputChange}
                    >
                      One-time use only
                    </Checkbox>
                  </FormControl>
  
                  <Button type="submit" colorScheme="brand" width="full">
                    Create
                  </Button>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    );
  };
  
  export default AdminDashboard;