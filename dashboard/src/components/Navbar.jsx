import {
  Box,
  Flex,
  Button,
  useColorMode,
  useColorModeValue,
  Text,
  HStack,
  Avatar
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      px={4}
      borderBottom={1}
      borderStyle="solid"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8}>
          <Text fontSize="xl" fontWeight="bold">
            Admin Dashboard
          </Text>
          <HStack spacing={4}>
            <Button
              as={RouterLink}
              to="/dashboard"
              variant="ghost"
            >
              Dashboard
            </Button>
            <Button
              as={RouterLink}
              to="/admin"
              variant="ghost"
            >
              Admin
            </Button>
          </HStack>
        </HStack>

        <Flex alignItems="center">
          <Button onClick={toggleColorMode} mr={4}>
            {colorMode === 'light' ? <FaMoon /> : <FaSun />}
          </Button>
          {user && (
            <HStack spacing={4}>
              <Avatar
                size="sm"
                name={user.username}
                src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : undefined}
              />
              <Text>{user.username}</Text>
              <Button
                leftIcon={<FaSignOutAlt />}
                onClick={logout}
                variant="ghost"
                colorScheme="red"
              >
                Logout
              </Button>
            </HStack>
          )}
        </Flex>
      </Flex>
    </Box>
  );
} 