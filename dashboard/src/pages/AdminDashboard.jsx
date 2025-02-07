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
  
  const AdminDashboard = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
  
    const handleCreatePromo = async (e) => {
      e.preventDefault();
      // Implementation coming in next step
    };
  
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