import { Box } from '@chakra-ui/react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import Navbar from './Navbar/index';

export default function Layout() {
  const { user, loading } = useAuth();

  // Show nothing while checking auth status
  if (loading) {
    return null;
  }

  // If not logged in and not on login page, redirect to login
  if (!user && window.location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  return (
    <Box minH="100vh">
      {user && <Navbar />}
      <Box as="main" p={4}>
        <Outlet />
      </Box>
    </Box>
  );
}