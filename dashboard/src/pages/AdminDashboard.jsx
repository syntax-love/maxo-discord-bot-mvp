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
    useToast
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  
  const AdminDashboard = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const handleCreatePromo = async (e) => {
      e.preventDefault();
      // Implementation coming in next step
    };
  
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
  
    return (
      <Box p={8}>
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
                        <Button 
                          size="sm" 
                          colorScheme="blue"
                          onClick={() => handleViewMembers(roleId)}
                        >
                          View Members
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
  
          {/* Promo Codes Management */}
          <Card>
            <CardHeader>
              <Stack direction="row" justify="space-between" align="center">
                <Heading size="md">Promo Codes</Heading>
                <Button colorScheme="brand" onClick={onOpen}>Create New</Button>
              </Stack>
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
                  <Tr>
                    <Td>SPECIAL50</Td>
                    <Td>50%</Td>
                    <Td>Mar 1, 2025</Td>
                    <Td>
                      <Button size="sm" colorScheme="red">Delete</Button>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </Grid>
  
        {/* Create Promo Code Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Promo Code</ModalHeader>
            <ModalBody>
              <Stack spacing={4} as="form" onSubmit={handleCreatePromo}>
                <FormControl isRequired>
                  <FormLabel>Code</FormLabel>
                  <Input placeholder="EXAMPLE25" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Discount (%)</FormLabel>
                  <Input type="number" min="1" max="100" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Valid Tiers</FormLabel>
                  <Select multiple>
                    <option value="sapphire">Sapphire</option>
                    <option value="diamond">Diamond</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Expiry Date</FormLabel>
                  <Input type="date" />
                </FormControl>
                <Button type="submit" colorScheme="brand">Create</Button>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  };
  
  export default AdminDashboard;