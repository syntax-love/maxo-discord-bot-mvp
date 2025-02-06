import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import theme from './theme';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Checking authentication status...');
    // Check if user is logged in
    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/status`, { 
      withCredentials: true 
    })
      .then(res => {
        console.log('Auth response:', res.data);
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Auth error:', error);
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  console.log('Current user state:', user);

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
                <Navigate to="/" state={{ from: '/dashboard' }} />
              )
            } 
          />
          <Route 
            path="/auth/discord/callback" 
            element={<Navigate to="/dashboard" />} 
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;