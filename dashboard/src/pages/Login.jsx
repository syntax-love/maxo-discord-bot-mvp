import { Box, Button, Center, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { FaDiscord } from 'react-icons/fa';
import { useAuth } from '../providers/AuthProvider';

export default function Login() {
  const { login } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Center h="100vh">
        <Box
          p={8}
          maxWidth="400px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          bg={bgColor}
        >
          <VStack spacing={8}>
            <Heading color={textColor}>Admin Dashboard</Heading>
            <Text color={textColor}>Click to continue</Text>
            <Button
              leftIcon={<FaDiscord />}
              colorScheme="purple"
              size="lg"
              onClick={login}
              width="full"
            >
              Continue
            </Button>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}