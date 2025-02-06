import { Box, Button, Container, Heading, Text, useColorMode, useToast } from '@chakra-ui/react';
import { FaDiscord } from 'react-icons/fa';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Login() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Debug logging
    console.log('Environment variables:', {
      VITE_DISCORD_CLIENT_ID: import.meta.env.VITE_DISCORD_CLIENT_ID,
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD,
      BASE_URL: import.meta.env.BASE_URL,
    });
    
    const error = searchParams.get('error');
    if (error) {
      toast({
        title: 'Authentication Error',
        description: 'Failed to log in with Discord. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [searchParams, toast]);

  const handleLogin = () => {
    const authUrl = new URL('https://discord.com/api/oauth2/authorize');
    authUrl.searchParams.append('client_id', '1335678688712196146');
    authUrl.searchParams.append('redirect_uri', 'https://maxo-discord-bot-mvp.onrender.com/auth/discord/callback');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'identify email');
    authUrl.searchParams.append('prompt', 'consent');
    
    window.location.href = authUrl.toString();
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