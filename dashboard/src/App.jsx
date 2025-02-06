import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
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
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth status...');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/status`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        const data = await response.json();
        console.log('Auth response:', data);
        
        if (data.isAuthenticated && data.user) {
          console.log('Setting user:', data.user);
          setUser(data.user);
        } else {
          console.log('No authenticated user found');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Only render routes after auth check
  if (!authChecked) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        {console.log('Current user state:', user)}
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
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;