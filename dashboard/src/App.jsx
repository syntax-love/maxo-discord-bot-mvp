import { ChakraProvider, ColorModeScript, Spinner, Center, Text, VStack } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import theme from './theme';

// Configure axios defaults
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth status...');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/status`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Auth status response:', data);

        if (data.isAuthenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <ChakraProvider theme={theme}>
        <Center height="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading...</Text>
          </VStack>
        </Center>
      </ChakraProvider>
    );
  }

  if (error) {
    return (
      <ChakraProvider theme={theme}>
        <Center height="100vh">
          <Text color="red.500">Error: {error}</Text>
        </Center>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Dashboard user={user} />
              ) : (
                <Navigate to="/" replace state={{ from: '/dashboard' }} />
              )
            } 
          />
          <Route 
            path="/auth/discord/callback" 
            element={<Center height="100vh"><Spinner /></Center>} 
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;