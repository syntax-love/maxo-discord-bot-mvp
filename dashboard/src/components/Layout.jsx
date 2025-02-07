import { Box, Flex, Button, Spacer, useColorMode } from '@chakra-ui/react';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { FaSun, FaMoon, FaUser, FaShieldAlt } from 'react-icons/fa';

const Layout = ({ isAdmin }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box minH="100vh">
      <Flex 
        as="nav" 
        align="center" 
        justify="space-between" 
        padding="1rem" 
        bg={colorMode === 'dark' ? 'gray.800' : 'white'} 
        borderBottom="1px" 
        borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
      >
        <Flex align="center" gap={4}>
          <Button
            as={RouterLink}
            to="/dashboard"
            variant="ghost"
            leftIcon={<FaUser />}
          >
            Dashboard
          </Button>
          
          {isAdmin && (
            <Button
              as={RouterLink}
              to="/admin"
              variant="ghost"
              leftIcon={<FaShieldAlt />}
            >
              Admin
            </Button>
          )}
        </Flex>

        <Spacer />

        <Button onClick={toggleColorMode} variant="ghost">
          {colorMode === 'light' ? <FaMoon /> : <FaSun />}
        </Button>
      </Flex>

      <Box as="main" p={4}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;