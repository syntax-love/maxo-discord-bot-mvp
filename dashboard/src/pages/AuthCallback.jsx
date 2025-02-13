import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Spinner, Text, useToast } from '@chakra-ui/react';
import { useAuth } from '../providers/AuthProvider';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (!code) {
        console.error('No code received from Discord');
        navigate('/login');
        return;
      }

      try {
        console.log('Sending auth request to:', `${API_URL}/api/auth/discord`);
        const response = await fetch(`${API_URL}/api/auth/discord`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
        console.log('Auth response:', data);

        if (!response.ok) {
          throw new Error(data.message || data.error || 'Authentication failed');
        }

        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        navigate('/admin');
      } catch (error) {
        console.error('Auth error:', error);
        toast({
          title: 'Authentication Error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, setUser, toast]);

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Spinner size="xl" mb={4} />
      <Text>Authenticating with Discord...</Text>
    </Flex>
  );
}