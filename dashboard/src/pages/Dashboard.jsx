import { 
  Box, 
  Grid, 
  Heading, 
  Text, 
  Card, 
  CardHeader, 
  CardBody,
  Stack,
  Badge,
  useColorMode
} from '@chakra-ui/react';

const tiers = {
  pearl: {
    name: 'Pearl',
    color: 'gray.400',
    features: ['Access to Lounge', 'Basic Support']
  },
  sapphire: {
    name: 'Sapphire',
    color: 'blue.400',
    features: ['Access to Private Suite', 'Priority Support', 'Custom Role']
  },
  diamond: {
    name: 'Diamond',
    color: 'purple.400',
    features: ['Access to Penthouse', 'VIP Support', 'Custom Role', 'Exclusive Events']
  }
};

export default function Dashboard() {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'dark' ? 'gray.700' : 'white';

  return (
    <Box p={8}>
      <Heading mb={6}>Dashboard</Heading>
      
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        {/* Current Subscription */}
        <Card bg={bgColor}>
          <CardHeader>
            <Heading size="md">Current Subscription</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <Badge colorScheme="purple" p={2} borderRadius="md">
                Diamond Tier
              </Badge>
              <Text>Status: Active</Text>
              <Text>Next Payment: March 1, 2024</Text>
            </Stack>
          </CardBody>
        </Card>

        {/* Active Promo Codes */}
        <Card bg={bgColor}>
          <CardHeader>
            <Heading size="md">Active Promo Codes</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <Badge colorScheme="green" p={2} borderRadius="md">
                LAUNCH2025 (20% OFF)
              </Badge>
              <Text>Valid until: Dec 31, 2025</Text>
              <Text>Applicable to: Sapphire, Diamond</Text>
            </Stack>
          </CardBody>
        </Card>

        {/* Server Access */}
        <Card bg={bgColor}>
          <CardHeader>
            <Heading size="md">Server Access</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <Text>✅ Lounge</Text>
              <Text>✅ Private Suite</Text>
              <Text>✅ Penthouse</Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
} 