import { Box, Button, Container, Heading, Text, useColorMode } from '@chakra-ui/react';
import { FaDiscord } from 'react-icons/fa';

export default function Login() {
  const { colorMode } = useColorMode();

  const handleLogin = () => {
    const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI;
    
    const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email%20guilds`;
    
    console.log('Redirecting to:', DISCORD_OAUTH_URL); // For debugging
    window.location.href = DISCORD_OAUTH_URL;
  };

  return (
    <Container maxW="container.md" centerContent>
      <Box
        p={8}
        mt={20}
        borderRadius="lg"
        bg={colorMode === 'dark' ? 'gray.700' : 'white'}
        boxShadow="lg"
        textAlign="center"
        width="100%"
      >
        <Heading mb={6}>Admin Dashboard</Heading>
        <Text mb={8} color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}>
          Log in with your Discord account to access the admin dashboard.
        </Text>
        <Button
          leftIcon={<FaDiscord />}
          colorScheme="purple"
          size="lg"
          onClick={handleLogin}
        >
          Login with Discord
        </Button>
      </Box>
    </Container>
  );
}