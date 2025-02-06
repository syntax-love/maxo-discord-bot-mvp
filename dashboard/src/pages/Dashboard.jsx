import { Box, Container, Grid, Heading, Stat, StatLabel, StatNumber, useColorMode } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const { colorMode } = useColorMode();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/stats`, {
          withCredentials: true
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Dashboard</Heading>
      
      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
        <Stat
          p={4}
          bg={colorMode === 'dark' ? 'gray.700' : 'white'}
          borderRadius="lg"
          boxShadow="sm"
        >
          <StatLabel>Total Users</StatLabel>
          <StatNumber>{stats?.totalUsers || 0}</StatNumber>
        </Stat>

        <Stat
          p={4}
          bg={colorMode === 'dark' ? 'gray.700' : 'white'}
          borderRadius="lg"
          boxShadow="sm"
        >
          <StatLabel>Active Subscriptions</StatLabel>
          <StatNumber>{stats?.activeSubscriptions || 0}</StatNumber>
        </Stat>

        <Stat
          p={4}
          bg={colorMode === 'dark' ? 'gray.700' : 'white'}
          borderRadius="lg"
          boxShadow="sm"
        >
          <StatLabel>Revenue This Month</StatLabel>
          <StatNumber>${stats?.revenueThisMonth || 0}</StatNumber>
        </Stat>
      </Grid>
    </Container>
  );
} 